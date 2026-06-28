/// Read-only view over an entry in a component's `variants` block.
library;

import 'element.dart';

/// A single variant of a component: the element subtree it renders and its
/// weighted-pick weight.
class ComponentVariant {
  final Map<String, Object?> _data;
  List<ElementNode>? _elements;

  ComponentVariant(Map<String, Object?> data) : _data = data;

  /// Returns the variant's elements, lazily wrapped as [ElementNode]
  /// instances on first access.
  List<ElementNode> elements() => _elements ??= List.unmodifiable(
        (_data['elements'] as List<Object?>)
            .map((element) => ElementNode(element as Map<String, Object?>)),
      );

  /// Returns the weighted-pick weight for this variant, defaulting to `1`.
  double weight() {
    final weight = _data['weight'];

    return weight == null ? 1 : (weight as num).toDouble();
  }

  /// Returns the variant's descriptive tags (e.g. `hairLength:long`), or an
  /// empty list when none are authored. Consumed by the `tags` render option
  /// to filter the variant pool.
  List<String> tags() {
    final tags = _data['tags'];

    if (tags is! List) {
      return const [];
    }

    return [
      for (final tag in tags)
        if (tag is String) tag,
    ];
  }

  /// Tests this variant against a single tag-filter token's grammar. With no
  /// [value], it matches a whole category: the bare `category` tag or any
  /// `category:value` tag. With a [value], it matches only the exact
  /// `category:value` tag. The resolver composes these checks into the
  /// allow/disallow filter structure.
  bool hasTag(String category, [String? value]) {
    if (value == null) {
      final prefix = '$category:';

      return tags().any((tag) => tag == category || tag.startsWith(prefix));
    }

    return tags().contains('$category:$value');
  }
}
