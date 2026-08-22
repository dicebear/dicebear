using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Typed reads over the parsed style definition and options.
    /// </summary>
    /// <remarks>
    /// Both documents reach the engine as <see cref="JsonNode"/> trees that
    /// have been through a JSON round-trip, so every leaf is backed by a
    /// <c>JsonElement</c> and the <c>TryGetValue</c> calls below take the same
    /// path whether the caller handed in parsed JSON or built the object by
    /// hand. A read that does not match the requested type returns
    /// <see langword="null"/> rather than throwing: the schema validator has
    /// already rejected the shapes that matter, and the views mirror the
    /// reference's optional-property reads.
    /// </remarks>
    internal static class JsonRead
    {
        internal static JsonObject? Obj(JsonNode? node, string key) =>
            node is JsonObject obj ? obj[key] as JsonObject : null;

        internal static JsonArray? Arr(JsonNode? node, string key) =>
            node is JsonObject obj ? obj[key] as JsonArray : null;

        internal static string? Str(JsonNode? node, string key) =>
            Str(node is JsonObject obj ? obj[key] : null);

        internal static string? Str(JsonNode? node) =>
            node is JsonValue value && value.TryGetValue<string>(out var result) ? result : null;

        internal static double? Num(JsonNode? node, string key) =>
            Num(node is JsonObject obj ? obj[key] : null);

        internal static double? Num(JsonNode? node) =>
            node is JsonValue value && value.TryGetValue<double>(out var result) ? result : (double?)null;

        internal static bool? Bool(JsonNode? node, string key) =>
            Bool(node is JsonObject obj ? obj[key] : null);

        internal static bool? Bool(JsonNode? node) =>
            node is JsonValue value && value.TryGetValue<bool>(out var result) ? result : (bool?)null;

        /// <summary>
        /// Reads a <c>{ min, max, step? }</c> object into a
        /// <see cref="NumberRange"/>, or <see langword="null"/> when the key
        /// holds no object. A missing bound falls back to 0, which the schema
        /// rules out for style definitions but keeps the read total.
        /// </summary>
        internal static NumberRange? Range(JsonNode? node, string key)
        {
            var obj = Obj(node, key);

            if (obj is null)
            {
                return null;
            }

            return new NumberRange(Num(obj, "min") ?? 0.0, Num(obj, "max") ?? 0.0, Num(obj, "step"));
        }
    }
}
