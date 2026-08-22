using System;
using System.Collections.Generic;

namespace DiceBear
{
    /// <summary>
    /// Thrown when a color in the style definition references itself, directly
    /// or indirectly. The <see cref="Chain"/> reproduces the resolution path.
    /// </summary>
    public sealed class CircularColorReferenceException : Exception
    {
        /// <summary>
        /// Creates the error from the color names on the resolution path.
        /// </summary>
        public CircularColorReferenceException(IReadOnlyList<string> chain)
            : base("Circular color reference: " + string.Join(" → ", chain))
        {
            Chain = chain;
        }

        /// <summary>
        /// The color names on the resolution path, in the order they were
        /// visited.
        /// </summary>
        public IReadOnlyList<string> Chain { get; }
    }
}
