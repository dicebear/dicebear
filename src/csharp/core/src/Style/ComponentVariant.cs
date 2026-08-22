using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over an entry in a component's <c>variants</c> block.
    /// </summary>
    internal sealed class ComponentVariant
    {
        private readonly JsonObject _data;

        private IReadOnlyList<Element>? _elements;
        private IReadOnlyList<string>? _tags;

        internal ComponentVariant(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the variant's elements, lazily wrapped as
        /// <see cref="Element"/> instances on first access.
        /// </summary>
        internal IReadOnlyList<Element> Elements() => _elements ??= JsonRead.Elements(_data, "elements");

        /// <summary>
        /// Returns the weighted-pick weight for this variant, defaulting
        /// to <c>1</c>.
        /// </summary>
        internal double Weight() => JsonRead.Num(_data, "weight") ?? 1.0;

        /// <summary>
        /// Returns the variant's descriptive tags (e.g. <c>hairLength:long</c>),
        /// or an empty list when none are authored. Consumed by the <c>tags</c>
        /// render option to filter the variant pool.
        /// </summary>
        internal IReadOnlyList<string> Tags()
        {
            if (_tags is not null)
            {
                return _tags;
            }

            var array = JsonRead.Arr(_data, "tags");

            if (array is null)
            {
                return _tags = Array.Empty<string>();
            }

            var result = new List<string>(array.Count);

            foreach (var tag in array)
            {
                var value = JsonRead.Str(tag);

                if (value is not null)
                {
                    result.Add(value);
                }
            }

            return _tags = result;
        }

        /// <summary>
        /// Tests this variant against a single tag-filter token's grammar.
        /// </summary>
        /// <remarks>
        /// With no <paramref name="value"/>, it matches a whole category: the
        /// bare <c>category</c> tag or any <c>category:value</c> tag. With a
        /// value, it matches only the exact <c>category:value</c> tag. The
        /// resolver composes these checks into the allow/disallow filter
        /// structure.
        /// </remarks>
        internal bool HasTag(string category, string? value = null)
        {
            var tags = Tags();

            if (value is null)
            {
                var prefix = category + ":";

                foreach (var tag in tags)
                {
                    if (string.Equals(tag, category, StringComparison.Ordinal)
                        || tag.StartsWith(prefix, StringComparison.Ordinal))
                    {
                        return true;
                    }
                }

                return false;
            }

            var exact = category + ":" + value;

            foreach (var tag in tags)
            {
                if (string.Equals(tag, exact, StringComparison.Ordinal))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
