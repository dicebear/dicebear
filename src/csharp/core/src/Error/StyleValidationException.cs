using System.Collections.Generic;

namespace DiceBear
{
    /// <summary>
    /// Thrown when a style definition fails schema validation.
    /// </summary>
    public sealed class StyleValidationException : ValidationException
    {
        /// <summary>
        /// Creates the error from the individual field failures.
        /// </summary>
        public StyleValidationException(IReadOnlyList<ValidationErrorDetail> details)
            : base("Invalid style definition", details)
        {
        }
    }
}
