using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace DiceBear.Internal
{
    /// <summary>
    /// Derives display initials from a seed string.
    /// </summary>
    /// <remarks>
    /// Words are split by Unicode letter and mark categories, the equivalent of
    /// the <c>\p{L}</c> / <c>\p{M}</c> classes the JS reference matches with,
    /// so the result matches the other ports for accented and non-Latin input.
    /// The scan walks code points rather than UTF-16 units because .NET's
    /// regular expressions classify a surrogate pair as two <c>Cs</c>
    /// characters, which would drop letters outside the Basic Multilingual
    /// Plane that the reference matches.
    /// See https://www.regular-expressions.info/unicode.html
    /// </remarks>
    internal static class Initials
    {
        /// <summary>
        /// Apostrophes and accents that should not break a word (e.g. l'eau,
        /// d´or).
        /// </summary>
        private const string Quotes = "`´'ʼ";

        /// <summary>
        /// Returns one or two uppercase initials for the given seed,
        /// discarding an "@…" suffix so email addresses yield a single
        /// initial.
        /// </summary>
        internal static string FromSeed(string seed) => FromSeed(seed, true);

        /// <summary>
        /// <see cref="FromSeed(string)"/> with control over whether the "@…"
        /// suffix is stripped before the initials are derived.
        /// </summary>
        private static string FromSeed(string seed, bool discardAtSymbol)
        {
            var input = seed;

            if (discardAtSymbol)
            {
                // Strip the whole @ suffix, including any line terminators.
                // Only the first @ matters since the strip reaches the end.
                var at = input.IndexOf('@');

                if (at >= 0)
                {
                    input = input.Substring(0, at);
                }
            }

            input = StripQuotes(input);

            var words = Words(input);

            if (words.Count == 0)
            {
                return discardAtSymbol ? FromSeed(seed, false) : string.Empty;
            }

            if (words.Count == 1)
            {
                var leading = LeadingUnits(words[0], 2);

                return leading.Length == 0 ? string.Empty : Uppercase.JsToUpperCase(leading);
            }

            var first = LeadingUnits(words[0], 1);
            var last = LeadingUnits(words[words.Count - 1], 1);

            if (first.Length == 0 || last.Length == 0)
            {
                return string.Empty;
            }

            return Uppercase.JsToUpperCase(first + last);
        }

        /// <summary>
        /// Removes the apostrophes and accents that must not break a word.
        /// </summary>
        private static string StripQuotes(string value)
        {
            var builder = new StringBuilder(value.Length);

            foreach (var ch in value)
            {
                if (Quotes.IndexOf(ch) < 0)
                {
                    builder.Append(ch);
                }
            }

            return builder.ToString();
        }

        /// <summary>
        /// Splits <paramref name="value"/> into words: a letter followed by any
        /// run of letters and combining marks.
        /// </summary>
        private static List<string> Words(string value)
        {
            var words = new List<string>();
            var index = 0;

            while (index < value.Length)
            {
                var width = Width(value, index);

                if (!IsLetter(value, index))
                {
                    index += width;
                    continue;
                }

                var start = index;
                index += width;

                while (index < value.Length && (IsLetter(value, index) || IsMark(value, index)))
                {
                    index += Width(value, index);
                }

                words.Add(value.Substring(start, index - start));
            }

            return words;
        }

        /// <summary>
        /// Returns the first <paramref name="max"/> letter-plus-marks units of
        /// a word, or fewer when the word is shorter.
        /// </summary>
        private static string LeadingUnits(string word, int max)
        {
            var index = 0;

            for (var taken = 0; taken < max && index < word.Length; taken++)
            {
                if (!IsLetter(word, index))
                {
                    break;
                }

                index += Width(word, index);

                while (index < word.Length && IsMark(word, index))
                {
                    index += Width(word, index);
                }
            }

            return word.Substring(0, index);
        }

        private static int Width(string value, int index) =>
            char.IsSurrogatePair(value, index) ? 2 : 1;

        private static bool IsLetter(string value, int index)
        {
            switch (CharUnicodeInfo.GetUnicodeCategory(value, index))
            {
                case UnicodeCategory.UppercaseLetter:
                case UnicodeCategory.LowercaseLetter:
                case UnicodeCategory.TitlecaseLetter:
                case UnicodeCategory.ModifierLetter:
                case UnicodeCategory.OtherLetter:
                    return true;
                default:
                    return false;
            }
        }

        private static bool IsMark(string value, int index)
        {
            switch (CharUnicodeInfo.GetUnicodeCategory(value, index))
            {
                case UnicodeCategory.NonSpacingMark:
                case UnicodeCategory.SpacingCombiningMark:
                case UnicodeCategory.EnclosingMark:
                    return true;
                default:
                    return false;
            }
        }
    }
}
