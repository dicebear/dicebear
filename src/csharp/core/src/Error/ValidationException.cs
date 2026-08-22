using System;
using System.Collections.Generic;
using System.Linq;

namespace DiceBear
{
    /// <summary>
    /// Base class for schema validation failures. Carries the prefix in
    /// <see cref="Exception.Message"/> and the per-field failures in
    /// <see cref="Details"/>.
    /// </summary>
    /// <remarks>
    /// The other ports name these types <c>ValidationError</c>, after their own
    /// conventions. Here they end in <c>Exception</c>, because that is what a
    /// .NET caller expects to catch.
    /// </remarks>
    public class ValidationException : Exception
    {
        /// <summary>
        /// Creates a validation failure from a message prefix and the
        /// individual field failures.
        /// </summary>
        public ValidationException(string prefix, IReadOnlyList<ValidationErrorDetail> details)
            : base(Format(prefix, details))
        {
            Details = details;
        }

        /// <summary>
        /// The individual field failures behind this error.
        /// </summary>
        public IReadOnlyList<ValidationErrorDetail> Details { get; }

        private static string Format(string prefix, IReadOnlyList<ValidationErrorDetail> details)
        {
            var parts = details.Select(detail => string.Join(
                " ",
                new[] { detail.InstancePath, detail.Message }
                    .Where(segment => !string.IsNullOrEmpty(segment))));

            return prefix + ": " + string.Join(", ", parts);
        }
    }
}
