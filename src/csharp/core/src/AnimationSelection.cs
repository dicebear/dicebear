using System.Collections.Generic;

namespace DiceBear.Internal
{
    /// <summary>
    /// The interpreted <c>animation</c> option: off, all timelines, or a
    /// selection of timeline names.
    /// </summary>
    /// <remarks>
    /// Built from the raw memoized option value, so the resolved-options
    /// snapshot keeps the user's shape (a boolean, or the name list in the
    /// given order) while consumers work with these accessors.
    /// </remarks>
    internal readonly struct AnimationSelection
    {
        private readonly bool _all;
        private readonly IReadOnlyList<string>? _names;

        private AnimationSelection(bool all, IReadOnlyList<string>? names)
        {
            _all = all;
            _names = names;
        }

        internal static AnimationSelection From(object? raw)
        {
            switch (raw)
            {
                case bool flag:
                    return new AnimationSelection(flag, null);
                case IReadOnlyList<string> names:
                    return new AnimationSelection(false, names);
                default:
                    return new AnimationSelection(false, null);
            }
        }

        /// <summary>Whether no timeline plays at all.</summary>
        internal bool Off => !_all && (_names is null || _names.Count == 0);

        /// <summary>
        /// Whether a timeline carrying the given name plays. <c>true</c>
        /// plays every timeline. A name selection plays only named timelines
        /// carrying one of the selected names.
        /// </summary>
        internal bool Matches(string? name)
        {
            if (_all)
            {
                return true;
            }

            if (name is null || _names is null)
            {
                return false;
            }

            foreach (var candidate in _names)
            {
                if (candidate == name)
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// The selected names in user order, or <see langword="null"/> for
        /// the boolean forms. Consumed by the animation class namespace hash.
        /// </summary>
        internal IReadOnlyList<string>? Names => _names;
    }
}
