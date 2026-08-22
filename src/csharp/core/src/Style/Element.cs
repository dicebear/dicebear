using System.Collections.Generic;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over a single render-tree element from a style
    /// definition.
    /// </summary>
    /// <remarks>
    /// The same node type covers SVG elements, text and component references;
    /// <see cref="Type"/> discriminates between them.
    /// </remarks>
    internal sealed class Element
    {
        private readonly JsonObject _data;

        private IReadOnlyList<Element>? _children;

        internal Element(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the element type discriminator (<c>element</c>,
        /// <c>text</c>, <c>component</c>).
        /// </summary>
        internal string? Type() => JsonRead.Str(_data, "type");

        /// <summary>
        /// Returns the element's tag or component name, or
        /// <see langword="null"/> for elements that don't have one.
        /// </summary>
        internal string? Name() => JsonRead.Str(_data, "name");

        /// <summary>
        /// Returns the element's textual value (for <c>text</c> elements) or
        /// its variable reference, or <see langword="null"/> when not
        /// applicable.
        /// </summary>
        internal JsonNode? Value() => _data["value"];

        /// <summary>
        /// Returns the element's raw attribute map, or <see langword="null"/>
        /// when no attributes are defined.
        /// </summary>
        internal JsonObject? Attributes() => JsonRead.Obj(_data, "attributes");

        /// <summary>
        /// Returns the element's children, lazily wrapped as
        /// <see cref="Element"/> instances on first access.
        /// </summary>
        internal IReadOnlyList<Element> Children() => _children ??= JsonRead.Elements(_data, "children");
    }
}
