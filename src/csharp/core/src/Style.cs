using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;
using DiceBear.Internal;

namespace DiceBear
{
    /// <summary>
    /// A validated, lazily-decomposed wrapper around a style definition. Build
    /// it once and reuse it across many avatars.
    /// </summary>
    /// <remarks>
    /// Construction runs the JSON Schema validator and stores a deep copy of
    /// the input, so later mutation of the source object cannot leak into a
    /// rendered avatar.
    /// </remarks>
    public sealed class Style
    {
        private readonly JsonObject _data;

        private Meta? _meta;
        private Canvas? _canvas;
        private OrderedMap<Component>? _components;
        private OrderedMap<StyleColor>? _colors;

        /// <summary>
        /// Validates and wraps a style definition.
        /// </summary>
        /// <exception cref="StyleValidationException">
        /// The definition violates the style definition schema, or an
        /// <c>extends</c> alias points at something that cannot be aliased.
        /// </exception>
        public Style(JsonNode? definition)
        {
            StyleValidator.Validate(definition);

            // The round-trip both deep-copies the input and normalizes every
            // leaf to a JsonElement, so the accessors read the same way whether
            // the caller parsed JSON or assembled the definition by hand.
            _data = JsonNode.Parse(definition!.ToJsonString()) as JsonObject ?? new JsonObject();

            ValidateAliases();
        }

        /// <summary>
        /// Parses and validates a style definition from its JSON text.
        /// </summary>
        /// <exception cref="StyleValidationException">
        /// The text is not valid JSON, or the definition violates the schema.
        /// </exception>
        public static Style Parse(string json)
        {
            JsonNode? node;

            try
            {
                node = JsonNode.Parse(json);
            }
            catch (System.Text.Json.JsonException exception)
            {
                throw new StyleValidationException(new[]
                {
                    new ValidationErrorDetail(message: exception.Message),
                });
            }

            return new Style(node);
        }

        /// <summary>
        /// The definition's <c>$id</c>, or <see langword="null"/> when not set.
        /// </summary>
        public string? Id => JsonRead.Str(_data, "$id");

        /// <summary>
        /// The definition's <c>$schema</c> URI, or <see langword="null"/> when
        /// not set.
        /// </summary>
        public string? Schema => JsonRead.Str(_data, "$schema");

        /// <summary>
        /// The definition's <c>$comment</c>, or <see langword="null"/> when not
        /// set.
        /// </summary>
        public string? Comment => JsonRead.Str(_data, "$comment");

        /// <summary>
        /// Returns a deep copy of the root SVG attributes from the definition,
        /// defaulting to an empty object.
        /// </summary>
        public JsonObject Attributes() =>
            JsonRead.Obj(_data, "attributes")?.DeepClone().AsObject() ?? new JsonObject();

        /// <summary>
        /// Returns a deep copy of the underlying definition.
        /// </summary>
        public JsonObject Definition() => _data.DeepClone().AsObject();

        /// <summary>
        /// Returns the <see cref="Meta"/> view, lazily constructed on first
        /// access.
        /// </summary>
        internal Meta MetaBlock() =>
            _meta ??= new Meta(JsonRead.Obj(_data, "meta") ?? new JsonObject());

        /// <summary>
        /// Returns the <see cref="Canvas"/> view, lazily constructed on first
        /// access.
        /// </summary>
        internal Canvas CanvasBlock() =>
            _canvas ??= new Canvas(JsonRead.Obj(_data, "canvas") ?? new JsonObject());

        /// <summary>
        /// Returns a name to <see cref="Component"/> map for all defined
        /// components, in definition order, built lazily on first access.
        /// </summary>
        internal OrderedMap<Component> Components()
        {
            if (_components is not null)
            {
                return _components;
            }

            var map = new OrderedMap<Component>();
            var components = JsonRead.Obj(_data, "components");

            if (components is null)
            {
                return _components = map;
            }

            foreach (var entry in components)
            {
                if (entry.Value is JsonObject obj && !IsAlias(obj))
                {
                    map.Set(entry.Key, new Component(entry.Key, obj));
                }
            }

            foreach (var entry in components)
            {
                if (entry.Value is JsonObject obj && IsAlias(obj))
                {
                    map.TryGetValue(JsonRead.Str(obj, "extends")!, out var source);
                    map.Set(entry.Key, new Component(entry.Key, obj, source));
                }
            }

            return _components = map;
        }

        /// <summary>
        /// Returns a name to <see cref="StyleColor"/> map for all defined
        /// colors, in definition order, built lazily on first access.
        /// </summary>
        internal OrderedMap<StyleColor> Colors()
        {
            if (_colors is not null)
            {
                return _colors;
            }

            var map = new OrderedMap<StyleColor>();
            var colors = JsonRead.Obj(_data, "colors");

            if (colors is null)
            {
                return _colors = map;
            }

            foreach (var entry in colors)
            {
                if (entry.Value is JsonObject obj)
                {
                    map.Set(entry.Key, new StyleColor(obj));
                }
            }

            return _colors = map;
        }

        private static bool IsAlias(JsonObject data) => data.ContainsKey("extends");

        /// <summary>
        /// Verifies that every component declared via <c>extends</c> references
        /// an existing, non-alias component in the same <c>components</c> map.
        /// The schema itself cannot enforce cross-references between sibling
        /// keys.
        /// </summary>
        private void ValidateAliases()
        {
            var components = JsonRead.Obj(_data, "components");

            if (components is null)
            {
                return;
            }

            var errors = new List<ValidationErrorDetail>();

            foreach (var entry in components)
            {
                if (entry.Value is not JsonObject data || !IsAlias(data))
                {
                    continue;
                }

                var target = JsonRead.Str(data, "extends") ?? string.Empty;
                var targetData = components[target];

                if (targetData is null)
                {
                    errors.Add(new ValidationErrorDetail(
                        message: $"references unknown component \"{target}\"",
                        instancePath: $"/components/{entry.Key}/extends"));

                    continue;
                }

                if (targetData is JsonObject targetObj && IsAlias(targetObj))
                {
                    errors.Add(new ValidationErrorDetail(
                        message: $"references alias \"{target}\" — alias chains are not allowed",
                        instancePath: $"/components/{entry.Key}/extends"));
                }
            }

            if (errors.Count > 0)
            {
                throw new StyleValidationException(errors);
            }
        }
    }
}
