namespace DiceBear.Internal
{
    /// <summary>
    /// A closed numeric range. <c>Min == Max</c> represents a fixed value.
    /// </summary>
    /// <remarks>
    /// <c>Step</c> (consumed by <see cref="Prng.Float"/>, ignored by
    /// <see cref="Prng.Integer"/>) quantizes the range to multiples of
    /// <c>Step</c> starting at <c>Min</c>; a non-positive or absent step means
    /// continuous. It mirrors the <c>Range</c> type the other ports share; the
    /// name avoids a clash with <c>System.Range</c>.
    /// </remarks>
    internal readonly struct NumberRange
    {
        internal NumberRange(double min, double max, double? step = null)
        {
            Min = min;
            Max = max;
            Step = step;
        }

        internal double Min { get; }

        internal double Max { get; }

        internal double? Step { get; }
    }
}
