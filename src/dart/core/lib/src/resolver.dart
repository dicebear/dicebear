/// Derives every deterministic value for an avatar from the style, the user
/// options, and a seeded PRNG, exposing them as memoized named accessors.
library;

import 'error/circular_color_reference_error.dart';
import 'options.dart';
import 'prng/prng.dart';
import 'range.dart';
import 'style.dart';
import 'style/color.dart';
import 'style/component.dart';
import 'style/component_variant.dart';
import 'utils/color.dart';

/// Bundles the three inputs needed to derive any deterministic value for an
/// avatar — the [Style], the validated user [Options], and a seeded [Prng] —
/// and exposes them as named accessors. Each accessor memoizes its result so
/// that repeated calls cannot drift. The memo also serves as the
/// informational snapshot returned by [resolved] — every value the resolver
/// picks during one resolution lands there, except for the raw seed.
class Resolver {
  final Style _style;
  final Options _options;
  final Prng _prng;
  final List<String> _colorResolving = [];

  // The memo doubles as the resolved-options snapshot: the first write wins,
  // and the map's insertion order is the first-resolution order the JSON
  // envelope emits (Dart maps preserve it natively; Go had to track the order
  // explicitly). Unset values are recorded as null and filtered on exposure.
  final Map<String, Object?> _result = {};

  Resolver(Style style, Options options)
      : _style = style,
        _options = options,
        _prng = Prng(options.seed() ?? '');

  /// Deliberately not memoized — the seed is the only input we keep out of
  /// the [resolved] snapshot, so a serialized avatar never leaks it.
  String seed() => _options.seed() ?? '';

  double? size() => _memo('size', () => _options.size());

  bool idRandomization() =>
      _memo('idRandomization', () => _options.idRandomization() ?? false);

  String? title() => _memo('title', () => _options.title());

  String flip() =>
      _memo('flip', () => _prng.pick('flip', _options.flip()) ?? 'none');

  String fontFamily() => _memo(
        'fontFamily',
        () => _prng.pick('fontFamily', _options.fontFamily()) ?? 'system-ui',
      );

  double fontWeight() => _memo(
        'fontWeight',
        () => _prng.pick('fontWeight', _options.fontWeight()) ?? 400.0,
      );

  double scale() => _memoFloat('scale', _options.scale(), 1);

  double borderRadius() =>
      _memoFloat('borderRadius', _options.borderRadius(), 0);

  double rotate() => _memoFloat('rotate', _options.rotate(), 0);

  double translateX() => _memoFloat('translateX', _options.translateX(), 0);

  double translateY() => _memoFloat('translateY', _options.translateY(), 0);

  /// Selects a variant for the given component, or `null` when the component
  /// is unknown or rolled invisible. The pool the PRNG draws from is built
  /// from the per-component `${name}Variant` option and the global `tags`
  /// filter (see [_variantWeights]). Only variants that exist in the style
  /// definition are considered.
  ///
  /// User option lookup uses the component's source name (so a single option
  /// propagates to every alias), while the PRNG keys use the element's own
  /// name — each alias rolls its own visibility and variant.
  String? variant(String name) {
    return _memo('${name}Variant', () {
      final component = _style.components[name];

      if (component == null || !_isVisible(name, component)) {
        return null;
      }

      return _prng.weightedPick(
        '${name}Variant',
        _variantWeights(component),
      );
    });
  }

  /// Builds the name → weight map the PRNG draws a variant from. The
  /// per-component `${name}Variant` option is more specific than the global
  /// `tags` filter, so it takes precedence: when set, it fully governs the
  /// component's pool (its named variants, weighted by the option) and the
  /// tags filter is ignored for that component. The tags filter applies only
  /// where the user gave no explicit `${name}Variant` (see
  /// [_tagFilteredNames]), and falls back to every variant when neither is
  /// set.
  ///
  /// Names the style does not define are dropped, and an empty `${name}Variant`
  /// (or an empty tag result) yields no variant.
  Map<String, double> _variantWeights(Component component) {
    final variants = component.variants();
    final named = _options.componentVariant(component.sourceName);
    final weights = <String, double>{};

    final Iterable<String> names;

    if (named != null) {
      names = named.keys;
    } else if (_options.tags().isNotEmpty) {
      names = _tagFilteredNames(variants);
    } else {
      names = variants.keys;
    }

    for (final name in names) {
      final variant = variants[name];

      if (variant != null) {
        weights[name] = named != null ? named[name]! : variant.weight();
      }
    }

    return weights;
  }

  /// Narrows a component's variants to the names satisfying the global `tags`
  /// filter, applying the parsed [Options.tags] tokens in one pass over the
  /// pool:
  ///
  /// - A positive `cat:value` token is an axis-scoped allow. Within each
  ///   category some allow mentions, a variant is kept only if it carries no
  ///   tag in that category (untouched) or matches one of the allowed values
  ///   (OR within the category). Distinct allowed categories combine with
  ///   AND, and a category no allow mentions is left unconstrained. A bare
  ///   positive `cat` token carries no value, so it imposes no constraint (a
  ///   no-op).
  /// - A negative `!cat`/`!cat:value` token disallows, dropping every variant
  ///   carrying any tag in `cat` (bare) or the exact `cat:value` tag. Disallows
  ///   are checked alongside allows but always win.
  ///
  /// Returns the surviving variant names in definition order.
  List<String> _tagFilteredNames(Map<String, ComponentVariant> variants) {
    final allows = <String, List<String>>{};
    final disallows = <({String category, String? value})>[];

    for (final token in _options.tags()) {
      if (token.negated) {
        disallows.add((category: token.category, value: token.value));
      } else if (token.value != null) {
        allows.putIfAbsent(token.category, () => []).add(token.value!);
      }
    }

    final allowGroups = allows.entries.toList();
    final names = <String>[];

    for (final entry in variants.entries) {
      final variant = entry.value;

      final allowed = allowGroups.every(
        (group) =>
            !variant.hasTag(group.key) ||
            group.value.any((value) => variant.hasTag(group.key, value)),
      );
      final disallowed = disallows.any(
        (token) => variant.hasTag(token.category, token.value),
      );

      if (allowed && !disallowed) {
        names.add(entry.key);
      }
    }

    return names;
  }

  /// Resolves a named color to its final stop list.
  ///
  /// The memo is also a DoS guard: a color already resolved this pass is
  /// returned from the snapshot instead of being recomputed. Without it, a
  /// graph where each color references the next via both `contrastTo` and
  /// `notEqualTo` re-resolves exponentially (a schema-valid hang).
  List<String> color(String name) =>
      _memo('${name}Color', () => _resolveColor(name));

  String colorFill(String name) => _memo(
        '${name}ColorFill',
        () =>
            _prng.pick('${name}ColorFill', _options.colorFill(name)) ?? 'solid',
      );

  /// Memoized like every float option, but only ever called while a gradient
  /// def is built — `${name}ColorAngle` therefore appears in the snapshot
  /// only for colors that actually rendered as a gradient.
  double colorAngle(String name) =>
      _memoFloat('${name}ColorAngle', _options.colorAngle(name), 0);

  /// Picks the rotate/translateX/translateY/scale values for a single
  /// component. Memoized per `name`, so the four values land in [resolved] as
  /// `${name}Rotate` / `${name}TranslateX` / `${name}TranslateY` /
  /// `${name}Scale` for downstream introspection — recorded in exactly that
  /// order, which the snapshot key order depends on.
  ({double rotate, double translateX, double translateY, double scale})
      componentTransform(String name) {
    final component = _style.components[name];

    // Record fields evaluate in source order: Rotate, TranslateX,
    // TranslateY, Scale — the same order the JS port memoizes them in.
    return (
      rotate: _memoFloat('${name}Rotate', component?.rotate(), 0),
      translateX:
          _memoFloat('${name}TranslateX', component?.translate().x(), 0),
      translateY:
          _memoFloat('${name}TranslateY', component?.translate().y(), 0),
      scale: _memoFloat('${name}Scale', component?.scale(), 1),
    );
  }

  /// Returns an informational snapshot of every value the resolver picked.
  /// Includes top-level options (scale/rotate/translate/…), per-component
  /// variants/colors, and per-component transform picks. The raw seed is
  /// deliberately excluded; unset values are recorded as `null` and filtered
  /// out on exposure (Avatar drops them, like `JSON.stringify` drops
  /// `undefined` properties in JS).
  ///
  /// The returned map aliases the internal cache; callers that need isolation
  /// (e.g. `Avatar.toJson`) clone it themselves.
  Map<String, Object?> resolved() => _result;

  /// Returns the visibility probability (0–100) for the given component.
  /// Aliases read the source component's user-set probability so a single
  /// `<source>Probability` option propagates to every alias of the source.
  double _probability(Component component) =>
      _options.componentProbability(component.sourceName) ??
      component.probability();

  // `${name}Probability` is a PRNG key but never a memo key — visibility
  // rolls are not part of the resolved snapshot in any port.
  bool _isVisible(String name, Component component) =>
      _prng.boolean('${name}Probability', _probability(component));

  /// Resolves a named color to its final stop list, applying contrast sorting
  /// and `notEqualTo` filtering from the style definition. Detects circular
  /// references between colors and throws [CircularColorReferenceError].
  List<String> _resolveColor(String name) {
    final userColors = _options.color(name);
    final styleColor = _style.colors[name];
    final source = userColors ?? styleColor?.values() ?? const <String>[];

    var candidates = [for (final c in source) Color.toHex(c)];

    // colorFill is memoized inside this computation, so it lands in the
    // snapshot before `${name}Color` — the memo writes after compute returns.
    final fill = colorFill(name);
    final stops = fill == 'solid' ? 1 : _colorFillStops(name);

    if (styleColor == null) {
      return _takeN(_prng.shuffle('${name}Color', candidates), stops);
    }

    // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a).
    if (_colorResolving.contains(name)) {
      throw CircularColorReferenceError([..._colorResolving, name]);
    }

    _colorResolving.add(name);
    final contrastTo = _contrastTo(styleColor);
    final notEqualTo = styleColor.notEqualTo();

    try {
      if (contrastTo != null) {
        final refColors = color(contrastTo);

        if (refColors.isNotEmpty) {
          candidates = Color.sortByContrast(candidates, refColors[0]);
        }
      }

      if (notEqualTo.isNotEmpty) {
        final excluded = <String>[];

        for (final ref in notEqualTo) {
          excluded.addAll(color(ref));
        }

        candidates = Color.filterNotEqualTo(candidates, excluded);
      }
    } finally {
      _colorResolving.removeLast();
    }

    // Skip the shuffle when sorted by contrast, to preserve that ordering.
    final ordered = contrastTo != null
        ? candidates
        : _prng.shuffle('${name}Color', candidates);

    return _takeN(ordered, stops);
  }

  // The JS port's truthy check: an empty `contrastTo` counts as unset.
  static String? _contrastTo(ColorDefinition styleColor) {
    final value = styleColor.contrastTo();

    return value == null || value.isEmpty ? null : value;
  }

  /// Draws the gradient stop count, defaulting to `2`. Not memoized — the
  /// `${name}ColorFillStops` PRNG key never appears in the snapshot.
  int _colorFillStops(String name) {
    final range = _options.colorFillStops(name);

    return range != null ? _prng.integer('${name}ColorFillStops', range) : 2;
  }

  double _memoFloat(String key, Range? range, double fallback) =>
      _memo(key, () => range != null ? _prng.float(key, range) : fallback);

  T _memo<T>(String key, T Function() compute) {
    if (_result.containsKey(key)) {
      return _result[key] as T;
    }

    final value = compute();

    _result[key] = value;

    return value;
  }

  /// Returns a copy of the first [n] elements of [list] (or all of them when
  /// [n] is larger), mirroring the JS `slice(0, stops)`. Negative counts are
  /// clamped to 0, like the Go and Rust ports — the schema forbids them.
  static List<String> _takeN(List<String> list, int n) {
    if (n > list.length) {
      n = list.length;
    }

    if (n < 0) {
      n = 0;
    }

    return list.sublist(0, n);
  }
}
