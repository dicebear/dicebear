using System.Text;

namespace DiceBear.Internal
{
    /// <summary>
    /// Minimal XML escaping helper for SVG/XML text and attribute content.
    /// </summary>
    internal static class Xml
    {
        private static readonly char[] Escapable = { '&', '\'', '"', '<', '>' };

        /// <summary>
        /// Returns <paramref name="value"/> with the five XML predefined
        /// entities escaped. The substitution walks the string once, so an
        /// escaped '&amp;' is never escaped again.
        /// </summary>
        /// <remarks>
        /// Most of what the renderer escapes is path data, numbers and hex
        /// colors, none of which carry one of the five characters. Those
        /// values are handed straight back, the way the reference's
        /// <c>replace</c> returns its subject string when the pattern does not
        /// match.
        /// </remarks>
        internal static string Escape(string value)
        {
            if (value.IndexOfAny(Escapable) < 0)
            {
                return value;
            }

            var builder = new StringBuilder(value.Length);

            foreach (var ch in value)
            {
                switch (ch)
                {
                    case '&':
                        builder.Append("&amp;");
                        break;
                    case '\'':
                        builder.Append("&apos;");
                        break;
                    case '"':
                        builder.Append("&quot;");
                        break;
                    case '<':
                        builder.Append("&lt;");
                        break;
                    case '>':
                        builder.Append("&gt;");
                        break;
                    default:
                        builder.Append(ch);
                        break;
                }
            }

            return builder.ToString();
        }
    }
}
