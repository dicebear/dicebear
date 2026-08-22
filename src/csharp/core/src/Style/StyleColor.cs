using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over an entry in a style definition's <c>colors</c>
    /// block. Named <c>StyleColor</c> to keep it apart from the
    /// <see cref="DiceBear.Internal.Color"/> helpers.
    /// </summary>
    /// <remarks>
    /// A style is built once and rendered many times, so the string lists are
    /// read from the JSON on first access and then handed out as they stand.
    /// Callers read them without modifying them.
    /// </remarks>
    internal sealed class StyleColor
    {
        private readonly JsonObject _data;

        private IReadOnlyList<string>? _values;
        private IReadOnlyList<string>? _notEqualTo;

        internal StyleColor(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the candidate color values, in definition order.
        /// </summary>
        internal IReadOnlyList<string> Values() => _values ??= Strings("values");

        /// <summary>
        /// Returns the colors that the resolver should avoid picking, or an
        /// empty list when the field is unset.
        /// </summary>
        internal IReadOnlyList<string> NotEqualTo() => _notEqualTo ??= Strings("notEqualTo");

        /// <summary>
        /// Returns the name of another color that this one should contrast
        /// against, or <see langword="null"/> when no contrast constraint is
        /// defined.
        /// </summary>
        internal string? ContrastTo() => JsonRead.Str(_data, "contrastTo");

        private IReadOnlyList<string> Strings(string key)
        {
            var array = JsonRead.Arr(_data, key);

            if (array is null)
            {
                return Array.Empty<string>();
            }

            var result = new List<string>(array.Count);

            foreach (var item in array)
            {
                var value = JsonRead.Str(item);

                if (value is not null)
                {
                    result.Add(value);
                }
            }

            return result;
        }
    }
}
