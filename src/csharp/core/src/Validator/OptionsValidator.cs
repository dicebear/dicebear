using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Runtime validation of avatar options: the nesting limit and the shared
    /// JSON Schema.
    /// </summary>
    internal static class OptionsValidator
    {
        /// <summary>
        /// Throws an <see cref="OptionsValidationException"/> when
        /// <paramref name="data"/> nests deeper than this port reads or
        /// violates the options schema.
        /// </summary>
        internal static void Validate(JsonNode? data)
        {
            // Before the schema validator, which walks the options with
            // recursion and would run out of stack rather than report
            // anything.
            if (JsonSnapshot.ExceedsMaxDepth(data))
            {
                throw new OptionsValidationException(new[]
                {
                    new ValidationErrorDetail(message: JsonSnapshot.DepthMessage),
                });
            }

            OptionsSchemaValidator.Validate(data);
        }
    }
}
