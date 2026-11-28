using System;
using System.Collections.Generic;

namespace DiceBear
{
    /// <summary>
    /// Thrown when a component in the style definition references itself,
    /// directly or indirectly. The <see cref="Chain"/> reproduces the render
    /// path.
    /// </summary>
    /// <remarks>
    /// <see cref="Style"/> rejects component cycles with a
    /// <see cref="StyleValidationException"/> when it loads a definition, so a
    /// render no longer meets one. The renderer keeps its guard as a backstop:
    /// .NET kills the process on a stack overflow instead of throwing, and
    /// this error is the safer outcome should a cycle ever get past the load.
    /// </remarks>
    public sealed class CircularComponentReferenceException : Exception
    {
        /// <summary>
        /// Creates the error from the component names on the render path.
        /// </summary>
        public CircularComponentReferenceException(IReadOnlyList<string> chain)
            : base("Circular component reference: " + string.Join(" → ", chain))
        {
            Chain = chain;
        }

        /// <summary>
        /// The component names on the render path, in the order they were
        /// visited, ending with the one that repeats.
        /// </summary>
        public IReadOnlyList<string> Chain { get; }
    }
}
