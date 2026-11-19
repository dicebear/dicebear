using System.Text;

namespace DiceBear.Internal
{
    /// <summary>
    /// Makes user text well-formed before the core reads it.
    /// </summary>
    /// <remarks>
    /// A C# string can hold a lone UTF-16 surrogate, for example half of an
    /// emoji cut off by a substring. Ports that keep strings as UTF-8 can hold
    /// ill-formed bytes instead. Neither has a meaning another port could
    /// reproduce, so every port replaces them with U+FFFD first, the same as
    /// JavaScript's <c>String.prototype.toWellFormed()</c>.
    /// </remarks>
    internal static class Text
    {
        private const char Replacement = '�';

        /// <summary>
        /// Returns <paramref name="value"/> with every lone surrogate replaced
        /// by U+FFFD. A well-formed string comes back unchanged.
        /// </summary>
        internal static string WellFormed(string value)
        {
            StringBuilder? result = null;
            var start = 0;

            for (var i = 0; i < value.Length; i++)
            {
                if (!char.IsSurrogate(value[i]))
                {
                    continue;
                }

                if (char.IsHighSurrogate(value[i]) && i + 1 < value.Length && char.IsLowSurrogate(value[i + 1]))
                {
                    i++;
                    continue;
                }

                result ??= new StringBuilder(value.Length);
                result.Append(value, start, i - start).Append(Replacement);
                start = i + 1;
            }

            return result is null ? value : result.Append(value, start, value.Length - start).ToString();
        }
    }
}
