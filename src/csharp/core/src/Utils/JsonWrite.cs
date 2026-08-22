using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Writes a <see cref="JsonNode"/> as JSON text the way the reference's
    /// <c>JSON.stringify</c> does.
    /// </summary>
    /// <remarks>
    /// System.Text.Json cannot produce this output. Its default encoder
    /// escapes the HTML-sensitive characters that fill the embedded SVG, and
    /// <c>JavaScriptEncoder.UnsafeRelaxedJsonEscaping</c>, which fixes that,
    /// still escapes every supplementary-plane character plus a stretch of the
    /// Basic Multilingual Plane, so an emoji in a seed or title would come out
    /// as a surrogate escape where every other port writes it literally. The
    /// writer's own escaping is therefore hand-rolled, the same way the Go port
    /// builds its envelope by hand. Numbers and booleans hold no character that
    /// needs escaping, so those still go through System.Text.Json.
    /// </remarks>
    internal static class JsonWrite
    {
        /// <summary>
        /// Serializes <paramref name="node"/> to compact JSON text.
        /// </summary>
        internal static string Node(JsonNode? node)
        {
            var builder = new StringBuilder();

            Write(node, builder);

            return builder.ToString();
        }

        private static void Write(JsonNode? node, StringBuilder builder)
        {
            if (node is null)
            {
                builder.Append("null");

                return;
            }

            switch (node.GetValueKind())
            {
                case JsonValueKind.Object:
                    WriteObject(node.AsObject(), builder);

                    break;

                case JsonValueKind.Array:
                    WriteArray(node.AsArray(), builder);

                    break;

                case JsonValueKind.String:
                    WriteString(node.GetValue<string>(), builder);

                    break;

                default:
                    builder.Append(node.ToJsonString());

                    break;
            }
        }

        private static void WriteObject(JsonObject value, StringBuilder builder)
        {
            var first = true;

            builder.Append('{');

            foreach (var entry in value)
            {
                if (!first)
                {
                    builder.Append(',');
                }

                first = false;

                WriteString(entry.Key, builder);
                builder.Append(':');
                Write(entry.Value, builder);
            }

            builder.Append('}');
        }

        private static void WriteArray(JsonArray value, StringBuilder builder)
        {
            var first = true;

            builder.Append('[');

            foreach (var item in value)
            {
                if (!first)
                {
                    builder.Append(',');
                }

                first = false;

                Write(item, builder);
            }

            builder.Append(']');
        }

        /// <summary>
        /// Writes a quoted JSON string, escaping exactly what the reference
        /// escapes: the two structural characters, the five control characters
        /// with a short form, every other C0 control, and an unpaired
        /// surrogate. Everything else is written as it stands.
        /// </summary>
        private static void WriteString(string value, StringBuilder builder)
        {
            builder.Append('"');

            for (var i = 0; i < value.Length; i++)
            {
                var ch = value[i];

                switch (ch)
                {
                    case '"':
                        builder.Append("\\\"");

                        continue;

                    case '\\':
                        builder.Append("\\\\");

                        continue;

                    case '\b':
                        builder.Append("\\b");

                        continue;

                    case '\f':
                        builder.Append("\\f");

                        continue;

                    case '\n':
                        builder.Append("\\n");

                        continue;

                    case '\r':
                        builder.Append("\\r");

                        continue;

                    case '\t':
                        builder.Append("\\t");

                        continue;
                }

                // A well-formed stringify leaves a matched pair alone and
                // escapes a surrogate that stands on its own, so the result is
                // always valid UTF-16.
                var lone = char.IsSurrogate(ch)
                    && !(char.IsHighSurrogate(ch) && i + 1 < value.Length && char.IsLowSurrogate(value[i + 1]))
                    && !(char.IsLowSurrogate(ch) && i > 0 && char.IsHighSurrogate(value[i - 1]));

                if (ch < 0x20 || lone)
                {
                    builder
                        .Append("\\u")
                        .Append(((int)ch).ToString("x4", CultureInfo.InvariantCulture));

                    continue;
                }

                builder.Append(ch);
            }

            builder.Append('"');
        }
    }
}
