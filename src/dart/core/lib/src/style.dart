/// The validated, lazily-decomposed model of a style definition: the element
/// tree, components (with aliases resolved), colors, and metadata.
library;

import 'dart:collection';
import 'dart:convert';

import 'error/style_validation_error.dart';
import 'style/canvas.dart';
import 'style/color.dart';
import 'style/component.dart';
import 'style/meta.dart';
import 'utils/deep_copy.dart';
import 'validator/style_validator.dart';

/// Validated, lazily-decomposed wrapper around a style definition.
///
/// Construction runs the style validator (the JSON Schema plus the alias,
/// component-cycle and animation keyframe-order checks) and stores a deep
/// copy of the input so that later mutation of the source map cannot leak
/// into the rendered avatar (the JS port's `structuredClone`). Build it once,
/// then reuse it across many avatars.
class Style {
  final Map<String, Object?> _data;
  Meta? _meta;
  Canvas? _canvas;
  Map<String, Component>? _components;
  Map<String, ColorDefinition>? _colors;
  bool? _hasAnimations;
  List<String>? _animationNames;

  /// Creates a style from an already-decoded style definition.
  ///
  /// Throws a [StyleValidationError] when [definition] violates the style
  /// definition schema, contains an invalid component alias or a component
  /// cycle, or lists animation keyframes out of order. See [Style.parse] to
  /// build one directly from a raw JSON string.
  Style(Map<String, Object?> definition) : _data = _validatedCopy(definition);

  /// Parses and validates a style definition from its raw JSON [definition].
  ///
  /// This is the string counterpart to the default constructor, for the
  /// common case where the definition is raw JSON, such as the style
  /// constants shipped by the `dicebear_styles` package:
  ///
  /// ```dart
  /// import 'package:dicebear_styles/lorelei.dart';
  ///
  /// final style = Style.parse(lorelei);
  /// ```
  ///
  /// Throws a [FormatException] when [definition] is not valid JSON, and a
  /// [StyleValidationError] when the parsed value is not a valid style
  /// definition (a JSON value that is not an object fails the same way). Use
  /// the default constructor when you already hold a decoded map.
  factory Style.parse(String definition) {
    final decoded = jsonDecode(definition);

    // A valid definition is a JSON object. Route anything else through the
    // validator so it surfaces as a StyleValidationError like every other
    // malformed definition, not as a raw cast error.
    if (decoded is! Map) {
      validateStyle(decoded);
    }

    return Style((decoded as Map).cast<String, Object?>());
  }

  // Validation runs on the caller's map first, then the copy is taken —
  // matching the JS port's `validate(data)` before `structuredClone(data)`.
  static Map<String, Object?> _validatedCopy(Map<String, Object?> definition) {
    validateStyle(definition);

    return deepCopyJsonMap(definition);
  }

  /// Returns the definition's `$id`, or `null` when not set.
  String? get id => _data[r'$id'] as String?;

  /// Returns the definition's `$schema` URI, or `null` when not set.
  String? get schema => _data[r'$schema'] as String?;

  /// Returns the definition's `$comment`, or `null` when not set.
  String? get comment => _data[r'$comment'] as String?;

  /// Returns the [Meta] view, lazily constructed on first access and
  /// defaulting to an empty block when the definition omits `meta`.
  Meta get meta =>
      _meta ??= Meta(_data['meta'] as Map<String, Object?>? ?? const {});

  /// Returns the [Canvas] view, lazily constructed on first access.
  Canvas get canvas =>
      _canvas ??= Canvas(_data['canvas'] as Map<String, Object?>);

  /// Returns a name → [Component] map for all defined components, built
  /// lazily on first access.
  ///
  /// The map is built in two passes: all non-alias entries first (definition
  /// order), then all alias entries (definition order), each alias sharing
  /// the source component's data. The resulting insertion order — non-aliases
  /// before aliases — is observable through `OptionsDescriptor` and must not
  /// change.
  Map<String, Component> get components {
    final cached = _components;

    if (cached != null) {
      return cached;
    }

    final entries = _data['components'] as Map<String, Object?>? ?? const {};
    final map = <String, Component>{};

    for (final entry in entries.entries) {
      final data = entry.value as Map<String, Object?>;

      if (!_isAlias(data)) {
        map[entry.key] = Component(entry.key, data);
      }
    }

    for (final entry in entries.entries) {
      final data = entry.value as Map<String, Object?>;

      if (_isAlias(data)) {
        final target = data['extends'] as String;
        final source = map[target];

        // An alias whose source is missing or is itself an alias is skipped —
        // unreachable here because validateStyle already rejected it at
        // construction (kept for safety, like the Go and Rust ports).
        if (source != null) {
          map[entry.key] = Component.alias(entry.key, target, source);
        }
      }
    }

    return _components = UnmodifiableMapView(map);
  }

  /// Returns a name → [ColorDefinition] map for all defined colors, built
  /// lazily on first access, in definition order.
  Map<String, ColorDefinition> get colors => _colors ??= UnmodifiableMapView({
        for (final entry
            in (_data['colors'] as Map<String, Object?>? ?? const {}).entries)
          entry.key: ColorDefinition(entry.value as Map<String, Object?>),
      });

  /// Returns a deep copy of the root SVG attributes from the definition,
  /// defaulting to an empty map. A fresh copy is made per call, keeping the
  /// JSON insertion order — attribute order is load-bearing for byte parity.
  Map<String, Object?> attributes() =>
      deepCopyJsonMap(_data['attributes'] as Map<String, Object?>? ?? const {});

  /// Returns a deep copy of the underlying definition. A fresh copy is made
  /// per call, so mutating the result cannot corrupt this style.
  Map<String, Object?> definition() => deepCopyJsonMap(_data);

  /// Walks every element in the definition — the canvas tree and every
  /// non-alias component variant tree — and invokes [visit] with the raw
  /// element map and its JSON pointer path.
  void _visitElements(
    void Function(Map<String, Object?> element, String path) visit,
  ) {
    void walk(List<Object?> elements, String path) {
      for (var index = 0; index < elements.length; index++) {
        final element = elements[index] as Map<String, Object?>;
        final elementPath = '$path/$index';

        visit(element, elementPath);

        final children = element['children'] as List<Object?>?;

        if (children != null) {
          walk(children, '$elementPath/children');
        }
      }
    }

    walk(
      (_data['canvas'] as Map<String, Object?>)['elements'] as List<Object?>,
      '/canvas/elements',
    );

    final components = _data['components'] as Map<String, Object?>? ?? const {};

    for (final entry in components.entries) {
      final component = entry.value as Map<String, Object?>;

      if (_isAlias(component)) {
        continue;
      }

      final variants = component['variants'] as Map<String, Object?>;

      for (final variant in variants.entries) {
        walk(
          (variant.value as Map<String, Object?>)['elements'] as List<Object?>,
          '/components/${entry.key}/variants/${variant.key}/elements',
        );
      }
    }
  }

  /// Returns whether any element in the definition carries declarative
  /// animations. Computed once and cached. Consumed by the options descriptor
  /// to advertise the `animation` options only where they have an effect.
  bool get hasAnimations {
    final cached = _hasAnimations;

    if (cached != null) {
      return cached;
    }

    var found = false;

    _visitElements((element, _) {
      final animations = element['animations'] as List<Object?>?;

      if (animations != null && animations.isNotEmpty) {
        found = true;
      }
    });

    return _hasAnimations = found;
  }

  /// Returns the sorted distinct names of the definition's animation
  /// timelines. Computed once and cached. Consumed by the options descriptor
  /// so tooling can offer a switch, a speed and a delay per animation name.
  /// Sorted so every port reports the same order regardless of how it walks
  /// the definition.
  List<String> get animationNames {
    final cached = _animationNames;

    if (cached != null) {
      return cached;
    }

    final names = <String>{};

    _visitElements((element, _) {
      final animations = element['animations'] as List<Object?>? ?? const [];

      for (final animation in animations) {
        final name = (animation as Map<String, Object?>)['name'] as String?;

        if (name != null) {
          names.add(name);
        }
      }
    });

    return _animationNames = List.unmodifiable(names.toList()..sort());
  }

  // The discriminator between a base component and an alias, matching the JS
  // port's `'extends' in data`.
  static bool _isAlias(Map<String, Object?> data) =>
      data.containsKey('extends');
}
