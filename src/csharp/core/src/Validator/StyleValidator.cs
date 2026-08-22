using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Runtime validation of style definitions against the shared draft-07
    /// JSON Schema, which ships as the pure-data <c>DiceBear.Schema</c>
    /// package.
    /// </summary>
    internal static class StyleValidator
    {
        /// <summary>
        /// Throws a <see cref="StyleValidationException"/> when
        /// <paramref name="data"/> violates the style definition schema.
        /// </summary>
        internal static void Validate(JsonNode? data)
        {
            var details = SchemaValidator.CollectStyleErrors(data);

            if (details.Count > 0)
            {
                throw new StyleValidationException(details);
            }
        }
    }
}
