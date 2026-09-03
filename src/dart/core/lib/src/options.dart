/// Reads and normalizes the raw user-supplied options.
library;

import 'error/options_validation_error.dart';
import 'range.dart';
import 'utils/deep_copy.dart';
import 'validator/options_validator.dart';

/// The two values of the per-color `${name}ColorOrder` option.
const colorOrderRandom = 'random';
const colorOrderFixed = 'fixed';

/// A parsed `tags` filter token. [Options.tags] decodes each raw
/// `category` / `category:value` / `!…` string into this shape so the resolver
/// composes the filter without parsing the grammar itself.
class TagFilterToken {
  final String category;
  final String? value;
  final bool negated;

  const TagFilterToken({
    required this.category,
    required this.negated,
    this.value,
  });
}

/// Validates the raw user-supplied options and exposes them through typed
/// accessors. Each accessor returns the user's input in a normalized form
/// (always a list for options that accept either a scalar or a list, or
/// `null` when the option is not set), so consumers — chiefly the resolver —
/// never have to do their own normalization.
///
/// Resolution against the style definition and the PRNG happens in the
/// resolver; this class is purely about reading user input. A JSON `null`
/// value is treated like an absent key everywhere, matching the Go and Rust
/// readers.
class Options {
  final Map<String, Object?> _data;
  List<TagFilterToken>? _tags;

  /// Validates [data] (throws [OptionsValidationError]) and keeps a deep
  /// copy, so later mutations of the caller's map cannot leak into the
  /// avatar. `null` is treated as an empty options object.
  Options(Map<String, Object?>? data)
      : _data = _validateAndCopy(data ?? const <String, Object?>{});

  String? seed() {
    final value = _get('seed');

    return value is String ? value : null;
  }

  double? size() {
    final value = _get('size');

    return value is num ? value.toDouble() : null;
  }

  bool? idRandomization() {
    final value = _get('idRandomization');

    return value is bool ? value : null;
  }

  String? title() {
    final value = _get('title');

    return value is String ? value : null;
  }

  List<String> flip() => _asStringArray(_get('flip'));

  List<String> fontFamily() => _asStringArray(_get('fontFamily'));

  List<double> fontWeight() => _asNumberArray(_get('fontWeight'));

  Range? scale() => _toRange(_get('scale'));

  Range? borderRadius() => _toRange(_get('borderRadius'));

  Range? rotate() => _toRange(_get('rotate'));

  Range? translateX() => _toRange(_get('translateX'));

  Range? translateY() => _toRange(_get('translateY'));

  bool? animation() {
    final value = _get('animation');

    return value is bool ? value : null;
  }

  /// Returns the `${name}Animation` switch for one animation name, or `null`
  /// when unset.
  bool? animationFor(String name) {
    final value = _get('${name}Animation');

    return value is bool ? value : null;
  }

  Range? animationSpeed() => _toRange(_get('animationSpeed'));

  /// Returns the `${name}AnimationSpeed` option for one animation name as a
  /// range, or `null` when unset.
  Range? animationSpeedFor(String name) =>
      _toRange(_get('${name}AnimationSpeed'));

  Range? animationDelay() => _toRange(_get('animationDelay'));

  /// Returns the `${name}AnimationDelay` option for one animation name as a
  /// range, or `null` when unset.
  Range? animationDelayFor(String name) =>
      _toRange(_get('${name}AnimationDelay'));

  /// Returns the global `tags` filter as parsed tokens, or an empty list when
  /// unset. Each raw token (`category` / `category:value`, optionally
  /// `!`-prefixed to disallow) is decoded into a [TagFilterToken] so the
  /// resolver composes the filter without parsing the grammar itself. An empty
  /// list means no tag filtering (classic behavior). Memoized, since the
  /// resolver reads it once per component.
  List<TagFilterToken> tags() {
    return _tags ??= [
      for (final token in _asStringArray(_get('tags'))) _parseTagToken(token),
    ];
  }

  /// Returns the user-set variant constraint for [name] as a weighted map, or
  /// `null` when `${name}Variant` is unset. A bare string or string list is
  /// normalized to a map with each entry weighted `1`, preserving the list's
  /// order (duplicates collapse last-wins, keeping the first position — the
  /// same semantics as JS `Object.fromEntries`).
  Map<String, double>? componentVariant(String name) {
    final raw = _get('${name}Variant');

    if (raw == null) {
      return null;
    }

    if (raw is String) {
      return {raw: 1.0};
    }

    if (raw is List) {
      return {
        for (final item in raw)
          if (item is String) item: 1.0,
      };
    }

    if (raw is Map) {
      // Non-numeric weights are silently dropped, like the Go and Rust
      // readers. Insertion order is kept — the PRNG sorts keys itself.
      return {
        for (final entry in raw.entries)
          if (entry.value is num)
            entry.key as String: (entry.value as num).toDouble(),
      };
    }

    return null;
  }

  double? componentProbability(String name) {
    final value = _get('${name}Probability');

    return value is num ? value.toDouble() : null;
  }

  /// Asymmetric on purpose: returns `null` (rather than `[]`) when
  /// `${name}Color` is unset so the resolver can fall back to the style
  /// definition's color values.
  List<String>? color(String name) {
    final raw = _get('${name}Color');

    if (raw == null) {
      return null;
    }

    return _asStringArray(raw);
  }

  List<String> colorFill(String name) =>
      _asStringArray(_get('${name}ColorFill'));

  Range? colorAngle(String name) => _toRange(_get('${name}ColorAngle'));

  Range? colorFillStops(String name) => _toRange(_get('${name}ColorFillStops'));

  String? colorOrder(String name) {
    final value = _get('${name}ColorOrder');

    return value is String ? value : null;
  }

  /// Returns the raw value of [key], with a JSON `null` value collapsed to
  /// absent (Dart map lookup already yields `null` for missing keys).
  Object? _get(String key) => _data[key];

  /// Validates the user input, then deep-copies it so the stored data cannot
  /// alias the caller's map. Validation runs on the original input, like the
  /// JS port (validate, then `structuredClone`).
  static Map<String, Object?> _validateAndCopy(Map<String, Object?> data) {
    validateOptions(data);

    return deepCopyJsonMap(data);
  }

  /// Decodes a single raw `tags` token into a [TagFilterToken]. A leading `!`
  /// marks a disallow. The remainder splits on the first `:` into a category
  /// and an optional value (a bare category leaves [TagFilterToken.value]
  /// null). Mirrors the JS reader's `Options.tags` parse.
  static TagFilterToken _parseTagToken(String token) {
    final negated = token.startsWith('!');
    final body = negated ? token.substring(1) : token;
    final sep = body.indexOf(':');

    if (sep == -1) {
      return TagFilterToken(category: body, negated: negated);
    }

    return TagFilterToken(
      category: body.substring(0, sep),
      value: body.substring(sep + 1),
      negated: negated,
    );
  }

  /// Normalizes a scalar/list/absent string value into a fresh list.
  /// Wrong-typed list elements are silently dropped, like the Go and Rust
  /// readers.
  static List<String> _asStringArray(Object? value) {
    if (value is List) {
      return [
        for (final item in value)
          if (item is String) item,
      ];
    }

    if (value is String) {
      return [value];
    }

    return const [];
  }

  /// Normalizes a scalar/list/absent numeric value into a fresh list.
  static List<double> _asNumberArray(Object? value) {
    if (value is List) {
      return [
        for (final item in value)
          if (item is num) item.toDouble(),
      ];
    }

    if (value is num) {
      return [value.toDouble()];
    }

    return const [];
  }

  /// Normalizes a user-facing range option (bare number, `[n]`, `[min, max]`,
  /// or absent) into the internal [Range] struct. A bare number `n` — or a
  /// single-element list `[n]` — becomes a fixed `min == max`. A list's
  /// smallest/largest numeric element is taken as min/max (non-numeric
  /// elements are skipped). An empty list is treated as unset so the resolver
  /// applies the option's default (rather than yielding `NaN` from a missing
  /// bound). Matches the JS, PHP, Python, Go and Rust ports. User options
  /// never carry a step.
  static Range? _toRange(Object? value) {
    if (value is num) {
      final fixed = value.toDouble();

      return Range(min: fixed, max: fixed);
    }

    if (value is List) {
      final numbers = [
        for (final item in value)
          if (item is num) item.toDouble(),
      ];

      if (numbers.isEmpty) {
        return null;
      }

      var min = numbers.first;
      var max = numbers.first;

      for (final n in numbers) {
        if (n < min) {
          min = n;
        }

        if (n > max) {
          max = n;
        }
      }

      return Range(min: min, max: max);
    }

    return null;
  }
}
