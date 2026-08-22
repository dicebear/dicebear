using System.Collections.Generic;

namespace DiceBear
{
    /// <summary>
    /// Thrown when avatar options fail schema validation.
    /// </summary>
    public sealed class OptionsValidationException : ValidationException
    {
        /// <summary>
        /// Creates the error from the individual field failures.
        /// </summary>
        public OptionsValidationException(IReadOnlyList<ValidationErrorDetail> details)
            : base("Invalid options", details)
        {
        }
    }
}
