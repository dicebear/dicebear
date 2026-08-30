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
        private bool? _hasAnimations;
        private IReadOnlyList<string>? _animationNames;

        /// <summary>
        /// Validates and wraps a style definition.
        /// </summary>
        /// <exception cref="StyleValidationException">
        /// The definition violates the style definition schema, an
        /// <c>extends</c> alias points at something that cannot be aliased, or
        /// the definition nests deeper than this port reads.
        /// </exception>
        public Style(JsonNode? definition)
        {
            // Before the validator, which walks the definition with recursion
            // and would run out of stack rather than report anything.
            if (JsonSnapshot.ExceedsMaxDepth(definition))
            {
                throw new StyleValidationException(new[]
                {
                    new ValidationErrorDetail(message: JsonSnapshot.DepthMessage),
                });
            }

            try
            {
                StyleValidator.Validate(definition);
            }
            catch (System.Text.Json.JsonException exception)
            {
                // The validator reads the definition through a serializer,
                // which turns some documents down on its own: one nested past
                // its limit, or a string that came in as JSON text carrying an
                // unpaired surrogate. Either way it leaves here as this port's
                // own error.
                throw new StyleValidationException(new[]
                {
                    new ValidationErrorDetail(message: exception.Message),
                });
            }

            _data = JsonSnapshot.Of(definition);

            ValidateAliases();
            ValidateAnimations();
        }

        /// <summary>
        /// Parses and validates a style definition from its JSON text.
        /// </summary>
        /// <exception cref="StyleValidationException">
        /// The text is not valid JSON, the definition violates the schema, or
        /// it nests deeper than this port reads.
        /// </exception>
        public static Style Parse(string json)
        {
            JsonNode? node;

            try
            {
                // The reader carries a nesting limit of its own, so hand it the
                // port's number and both ways into a Style stop in the same
                // place.
                node = JsonNode.Parse(
                    json,
                    documentOptions: new System.Text.Json.JsonDocumentOptions
                    {
                        MaxDepth = JsonSnapshot.MaxDepth,
                    });
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

        /// <summary>
        /// Verifies that every animation track lists its keyframes in strictly
        /// ascending <c>at</c> order. The schema cannot express ordering
        /// between array items; step jumps are expressed with the <c>hold</c>
        /// easing rather than duplicate positions.
        /// </summary>
        private void ValidateAnimations()
        {
            var errors = new List<ValidationErrorDetail>();

            VisitElements((element, path) =>
            {
                if (element["animations"] is not JsonArray animations)
                {
                    return;
                }

                for (var a = 0; a < animations.Count; a++)
                {
                    if (animations[a] is not JsonObject animation
                        || JsonRead.Obj(animation, "tracks") is not JsonObject tracks)
                    {
                        continue;
                    }

                    foreach (var trackEntry in tracks)
                    {
                        if (trackEntry.Value is not JsonObject track
                            || track["keyframes"] is not JsonArray keyframes)
                        {
                            continue;
                        }

                        for (var i = 1; i < keyframes.Count; i++)
                        {
                            var current = JsonRead.Num(keyframes[i] as JsonObject, "at");
                            var previous = JsonRead.Num(keyframes[i - 1] as JsonObject, "at");

                            if (current.HasValue && previous.HasValue && current.Value <= previous.Value)
                            {
                                errors.Add(new ValidationErrorDetail(
                                    message: "must be greater than the previous keyframe",
                                    instancePath: $"{path}/animations/{a}/tracks/{trackEntry.Key}/keyframes/{i}/at"));
                            }
                        }
                    }
                }
            });

            if (errors.Count > 0)
            {
                throw new StyleValidationException(errors);
            }
        }

        /// <summary>
        /// Walks every element in the definition — the canvas tree and every
        /// component variant tree — and invokes <paramref name="visit"/> with
        /// the element and its JSON pointer path.
        /// </summary>
        private void VisitElements(Action<JsonObject, string> visit)
        {
            void Walk(JsonArray? elements, string path)
            {
                if (elements is null)
                {
                    return;
                }

                for (var i = 0; i < elements.Count; i++)
                {
                    if (elements[i] is not JsonObject element)
                    {
                        continue;
                    }

                    var elementPath = path + "/" + i;

                    visit(element, elementPath);
                    Walk(element["children"] as JsonArray, elementPath + "/children");
                }
            }

            Walk(JsonRead.Obj(_data, "canvas")?["elements"] as JsonArray, "/canvas/elements");

            var components = JsonRead.Obj(_data, "components");

            if (components is null)
            {
                return;
            }

            foreach (var entry in components)
            {
                if (entry.Value is not JsonObject component || IsAlias(component))
                {
                    continue;
                }

                var variants = JsonRead.Obj(component, "variants");

                if (variants is null)
                {
                    continue;
                }

                foreach (var variantEntry in variants)
                {
                    if (variantEntry.Value is JsonObject variant)
                    {
                        Walk(
                            variant["elements"] as JsonArray,
                            $"/components/{entry.Key}/variants/{variantEntry.Key}/elements");
                    }
                }
            }
        }

        /// <summary>
        /// Returns whether any element in the definition carries declarative
        /// animations. Computed once and cached; consumed by the options
        /// descriptor to advertise the <c>animation</c> options only where
        /// they have an effect.
        /// </summary>
        public bool HasAnimations()
        {
            if (_hasAnimations is null)
            {
                var found = false;

                VisitElements((element, _) =>
                {
                    if (element["animations"] is JsonArray animations && animations.Count > 0)
                    {
                        found = true;
                    }
                });

                _hasAnimations = found;
            }

            return _hasAnimations.Value;
        }

        /// <summary>
        /// Returns the sorted distinct names of the definition's animation
        /// timelines. Computed once and cached; consumed by the options
        /// descriptor so tooling can offer the by-name form of the
        /// <c>animation</c> option. Sorted so every port reports the same
        /// order regardless of how it walks the definition.
        /// </summary>
        public IReadOnlyList<string> AnimationNames()
        {
            if (_animationNames is null)
            {
                var names = new SortedSet<string>(StringComparer.Ordinal);

                VisitElements((element, _) =>
                {
                    if (element["animations"] is not JsonArray animations)
                    {
                        return;
                    }

                    foreach (var node in animations)
                    {
                        if (JsonRead.Str(node, "name") is string name)
                        {
                            names.Add(name);
                        }
                    }
                });

                _animationNames = new List<string>(names);
            }

            return _animationNames;
        }
    }
}
