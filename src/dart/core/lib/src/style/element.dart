/// Read-only view over a single render-tree node from a style definition.
library;

/// A single render-tree element from a style definition.
///
/// The same node type covers SVG elements, text, and component references —
/// [type] discriminates between them. The node is a thin view over the
/// decoded definition JSON; the data is shared, never copied.
class ElementNode {
  final Map<String, Object?> _data;
  List<ElementNode>? _children;

  ElementNode(Map<String, Object?> data) : _data = data;

  /// Returns the element type discriminator
  /// (`'element'`, `'text'` or `'component'`).
  String get type => _data['type'] as String;

  /// Returns the element's tag/component name, or `null` for elements that
  /// don't have one.
  String? get name => _data['name'] as String?;

  /// Returns the element's textual value (for `text` elements): a literal
  /// [String], a `{'type': 'variable', 'name': ...}` reference map, or `null`
  /// when not applicable. The value is passed through raw, like the JS port.
  Object? get value => _data['value'];

  /// Returns the element's raw attribute map, or `null` when no attributes
  /// are defined.
  ///
  /// The map is the decoded definition JSON itself, in JSON insertion order —
  /// SVG attributes must render in the order they were declared, so the order
  /// is load-bearing (the JS/Rust/Go ports rely on `Map`/`IndexMap`/an
  /// ordered list for the same reason; Dart maps preserve insertion order
  /// natively). Values are literal strings or
  /// `{'type': 'color' | 'variable', 'name': ...}` reference maps.
  Map<String, Object?>? get attributes =>
      _data['attributes'] as Map<String, Object?>?;

  /// Returns the element's declarative animation timelines as raw definition
  /// maps, in definition order. Empty for elements without animations.
  List<Object?> get animations =>
      _data['animations'] as List<Object?>? ?? const [];

  /// Returns the element's children, lazily wrapped as [ElementNode]
  /// instances on first access. Defaults to an empty list.
  List<ElementNode> get children => _children ??= List.unmodifiable(
        (_data['children'] as List<Object?>? ?? const [])
            .map((child) => ElementNode(child as Map<String, Object?>)),
      );
}
