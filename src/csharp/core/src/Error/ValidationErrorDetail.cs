namespace DiceBear
{
    /// <summary>
    /// One field-level failure reported by the schema validator.
    /// </summary>
    public sealed class ValidationErrorDetail
    {
        /// <summary>
        /// Creates a detail from the validator's output.
        /// </summary>
        public ValidationErrorDetail(
            string? message = null,
            string? instancePath = null,
            string? schemaPath = null,
            string? keyword = null)
        {
            Message = message;
            InstancePath = instancePath;
            SchemaPath = schemaPath;
            Keyword = keyword;
        }

        /// <summary>
        /// Human-readable description of the failure.
        /// </summary>
        public string? Message { get; }

        /// <summary>
        /// JSON pointer to the failing value, e.g. <c>/canvas/width</c>.
        /// </summary>
        public string? InstancePath { get; }

        /// <summary>
        /// JSON pointer to the schema rule that failed, e.g.
        /// <c>#/properties/size/minimum</c>.
        /// </summary>
        public string? SchemaPath { get; }

        /// <summary>
        /// The failing schema keyword, e.g. <c>minimum</c> or <c>pattern</c>.
        /// </summary>
        public string? Keyword { get; }
    }
}
