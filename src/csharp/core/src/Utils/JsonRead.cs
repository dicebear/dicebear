using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Typed reads over the parsed style definition and options.
    /// </summary>
    /// <remarks>
    /// Both documents reach the engine as <see cref="JsonNode"/> trees whose
    /// number leaves have been rebuilt from their own JSON text, so every
    /// number is backed by a <c>JsonElement</c> and the <c>TryGetValue</c>
    /// calls below take the same path whether the caller handed in parsed JSON
    /// or built the object by hand. Strings and booleans already read alike
    /// either way and are copied as they stand, which is what keeps an
    /// unpaired surrogate intact. A read that does not match the requested
    /// type returns
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
        /// Reads an array of render-tree nodes into <see cref="Element"/>
        /// views, or an empty list when the key holds no array. Entries that
        /// are not objects are dropped, a case the schema rules out before the
        /// definition reaches the engine.
        /// </summary>
        internal static IReadOnlyList<Element> Elements(JsonNode? node, string key)
        {
            var array = Arr(node, key);

            if (array is null)
            {
                return Array.Empty<Element>();
            }

            var result = new List<Element>(array.Count);

            foreach (var item in array)
            {
                if (item is JsonObject obj)
                {
                    result.Add(new Element(obj));
                }
            }

            return result;
        }

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
