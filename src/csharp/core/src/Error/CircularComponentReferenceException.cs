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
    /// The schema cannot express this, so the definition validates and the
    /// cycle only shows up while rendering. The reference runs out of stack
    /// there and throws a <c>RangeError</c> the caller can catch. .NET kills
    /// the process on a stack overflow instead, so the renderer counts the
    /// components it is inside and reports the cycle before that happens.
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
