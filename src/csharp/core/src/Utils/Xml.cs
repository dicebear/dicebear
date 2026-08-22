using System.Text;

namespace DiceBear.Internal
{
    /// <summary>
    /// Minimal XML escaping helper for SVG/XML text and attribute content.
    /// </summary>
    internal static class Xml
    {
        /// <summary>
        /// Returns <paramref name="value"/> with the five XML predefined
        /// entities escaped. The substitution walks the string once, so an
        /// escaped '&amp;' is never escaped again.
        /// </summary>
        internal static string Escape(string value)
        {
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
