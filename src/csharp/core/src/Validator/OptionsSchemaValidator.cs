using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Runtime validation of avatar options against the shared draft-07 JSON
    /// Schema, which ships as the pure-data <c>DiceBear.Schema</c> package.
    /// </summary>
    /// <remarks>
    /// Covers the schema only. <see cref="OptionsValidator"/> runs it after
    /// the depth check.
    /// </remarks>
    internal static class OptionsSchemaValidator
    {
        /// <summary>
        /// Throws an <see cref="OptionsValidationException"/> when
        /// <paramref name="data"/> violates the options schema.
        /// </summary>
        internal static void Validate(JsonNode? data)
        {
            var details = SchemaValidator.CollectOptionsErrors(data);

            if (details.Count > 0)
            {
                throw new OptionsValidationException(details);
            }
        }
    }
}
