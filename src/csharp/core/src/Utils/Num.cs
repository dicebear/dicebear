using System;
using System.Globalization;
using System.Text;

namespace DiceBear.Internal
{
    /// <summary>
    /// The numeric helpers shared by the PRNG and the renderer: SVG number
    /// formatting, the JavaScript-compatible half-up rounding the rest of the
    /// engine depends on, and JavaScript's <c>String(number)</c>.
    /// </summary>
    internal static class Num
    {
        /// <summary>
        /// Formats a number for SVG output, rounded to at most 5 decimal
        /// places.
        /// </summary>
        /// <remarks>
        /// Rounding to a fixed precision keeps the output bounded and identical
        /// across every port: every value becomes a multiple of 1e-5 in the SVG
        /// coordinate range, which has no exponential form, so the result is
        /// built from integer arithmetic with no locale- or language-specific
        /// float stringifying.
        /// </remarks>
        internal static string Format(double value)
        {
            if (double.IsNaN(value))
            {
                return "NaN";
            }

            if (double.IsPositiveInfinity(value))
            {
                return "Infinity";
            }

            if (double.IsNegativeInfinity(value))
            {
                return "-Infinity";
            }

            var scaled = (long)RoundHalfUp(value * 100000.0);
            var sign = string.Empty;

            if (scaled < 0)
            {
                sign = "-";
                scaled = -scaled;
            }

            var integerPart = scaled / 100000;
            var fraction = (scaled % 100000)
                .ToString(CultureInfo.InvariantCulture)
                .PadLeft(5, '0')
                .TrimEnd('0');

            if (fraction.Length == 0)
            {
                return sign + integerPart.ToString(CultureInfo.InvariantCulture);
            }

            return sign + integerPart.ToString(CultureInfo.InvariantCulture) + "." + fraction;
        }

        /// <summary>
        /// Rounds half toward +∞, matching JavaScript's <c>Math.round</c>.
        /// </summary>
        /// <remarks>
        /// .NET's <c>Math.Round</c> defaults to banker's rounding and
        /// <c>MidpointRounding.AwayFromZero</c> rounds negative halves the
        /// wrong way, while the naive <c>Math.Floor(x + 0.5)</c> over-rounds
        /// the largest double below 0.5. Comparing the fractional part against
        /// 0.5 reproduces <c>Math.round</c> exactly.
        /// </remarks>
        internal static double RoundHalfUp(double value)
        {
            var floor = Math.Floor(value);

            return value - floor < 0.5 ? floor : floor + 1.0;
        }

        /// <summary>
        /// Stringifies a number the way JavaScript's <c>String()</c> does, for
        /// the values that reach the PRNG's sort keys (font weights and
        /// component weights are whole numbers).
        /// </summary>
        /// <remarks>
        /// A whole number below 1e21 gets no decimal point and no exponent,
        /// which is where JS and .NET disagree: <c>String(1e20)</c> is
        /// "100000000000000000000", while the round-trip format would render
        /// it as "1E+20". Everything else falls back to the shortest
        /// round-trippable form.
        /// </remarks>
        internal static string JsString(double value)
        {
            if (double.IsNaN(value))
            {
                return "NaN";
            }

            if (double.IsPositiveInfinity(value))
            {
                return "Infinity";
            }

            if (double.IsNegativeInfinity(value))
            {
                return "-Infinity";
            }

            // JS prints -0 as "0"; .NET's "F0" would keep the sign.
            if (value == 0.0)
            {
                return "0";
            }

            if (value == Math.Truncate(value) && Math.Abs(value) < 1e21)
            {
                return value.ToString("F0", CultureInfo.InvariantCulture);
            }

            return value.ToString("R", CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Percent-encodes <paramref name="value"/> exactly like JavaScript's
        /// <c>encodeURIComponent</c>: every UTF-8 byte is escaped except the
        /// unreserved set A-Za-z0-9 and -_.!~*'().
        /// </summary>
        internal static string EncodeUriComponent(string value)
        {
            const string Unreserved = "-_.!~*'()";
            const string Hex = "0123456789ABCDEF";

            var bytes = Encoding.UTF8.GetBytes(value);
            var builder = new StringBuilder(bytes.Length);

            foreach (var b in bytes)
            {
                var ch = (char)b;

                if ((ch >= 'A' && ch <= 'Z')
                    || (ch >= 'a' && ch <= 'z')
                    || (ch >= '0' && ch <= '9')
                    || Unreserved.IndexOf(ch) >= 0)
                {
                    builder.Append(ch);
                }
                else
                {
                    builder.Append('%').Append(Hex[b >> 4]).Append(Hex[b & 0x0f]);
                }
            }

            return builder.ToString();
        }
    }
}
