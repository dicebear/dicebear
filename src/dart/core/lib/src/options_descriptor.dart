/// Builds a descriptor of every option a given style accepts.
library;

import 'options.dart';
import 'style.dart';
import 'utils/deep_copy.dart';

/// Builds a descriptor of every option a given style accepts. Tooling such as
/// the editor uses the result to render form controls and validation hints
/// without having to introspect the style itself.
class OptionsDescriptor {
  final Style _style;
  Map<String, Object?>? _descriptor;

  OptionsDescriptor(Style style) : _style = style;

  /// Returns a deep copy of the descriptor, building it lazily on first call.
  Map<String, Object?> toJson() => deepCopyJsonMap(_descriptor ??= _build());

  /// Walks the style's components and colors and assembles the field map.
  /// The map's insertion order matches the JS port — the descriptor fixtures
  /// are compared serialized, so the order is part of the parity contract.
  Map<String, Object?> _build() {
    final result = <String, Object?>{
      'seed': {'type': 'string'},
      'size': {'type': 'number', 'min': 1, 'max': 4096},
      'idRandomization': {'type': 'boolean'},
      'title': {'type': 'string'},
      'flip': {
        'type': 'enum',
        'values': ['none', 'horizontal', 'vertical', 'both'],
        'list': true,
      },
      'fontFamily': {'type': 'string', 'list': true},
      'fontWeight': {'type': 'number', 'min': 1, 'max': 1000, 'list': true},
      'scale': {'type': 'range', 'min': 0, 'max': 10},
      'borderRadius': {'type': 'range', 'min': 0, 'max': 50},
      'rotate': _rotateRange,
      'translateX': _translateRange,
      'translateY': _translateRange,
    };

    // The sorted union of every tag across the style's variants, collected
    // while walking the components below and advertised as an open enum at the
    // end (only when the style actually carries tags).
    final tags = <String>{};

    // Aliases are skipped: they accept no options of their own — the source
    // component's `${name}Variant` / `${name}Probability` covers them.
    for (final entry in _style.components.entries) {
      final component = entry.value;

      if (component.extendsName != null) {
        continue;
      }

      final variants = component.variants();
      final variantNames = variants.keys.toList()..sort();

      result['${entry.key}Variant'] = {
        'type': 'enum',
        'values': variantNames,
        'list': true,
        'weighted': true,
      };
      result['${entry.key}Probability'] = {
        'type': 'number',
        'min': 0,
        'max': 100,
      };

      for (final variant in variants.values) {
        tags.addAll(variant.tags());
      }
    }

    // `background` is always appended: it is resolvable even when the style
    // defines no such color. A style that defines `background` itself writes
    // the same fields twice — the second write overwrites identically and
    // keeps the first position, like the JS object semantics.
    for (final name in [..._style.colors.keys, 'background']) {
      final contrastTo = _style.colors[name]?.contrastTo();

      result['${name}Color'] = {
        'type': 'color',
        'list': true,
        // The JS truthy spread: an empty contrastTo is treated as unset.
        if (contrastTo != null && contrastTo.isNotEmpty)
          'contrastTo': contrastTo,
      };
      result['${name}ColorFill'] = {
        'type': 'enum',
        'values': ['solid', 'linear', 'radial'],
        'list': true,
      };
      result['${name}ColorFillStops'] = {'type': 'range', 'min': 2};
      result['${name}ColorAngle'] = _rotateRange;
      result['${name}ColorOrder'] = {
        'type': 'enum',
        'values': [colorOrderRandom, colorOrderFixed],
      };
    }

    // Only advertise the `tags` filter when the style actually carries tags.
    // The values are the sorted union of every tag across the style's variants,
    // but `open` marks them as suggestions: the filter also accepts `!`
    // disallows and bare categories. Only an unknown category is ignored. An
    // unknown value inside a category the style does use matches nothing, so
    // every variant tagged on that axis is dropped.
    if (tags.isNotEmpty) {
      result['tags'] = {
        'type': 'enum',
        'values': tags.toList()..sort(),
        'list': true,
        'open': true,
      };
    }

    return result;
  }

  // Shared, immutable singletons reused across the rotate/translate/colorAngle
  // fields, mirroring the JS port's static descriptors. toJson deep-copies the
  // whole descriptor per call, so handing out the same instance is safe.
  static const Map<String, Object?> _rotateRange = {
    'type': 'range',
    'min': -360,
    'max': 360,
  };

  static const Map<String, Object?> _translateRange = {
    'type': 'range',
    'min': -1000,
    'max': 1000,
  };
}
