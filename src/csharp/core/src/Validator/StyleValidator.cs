using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Runtime validation of style definitions: the nesting limit, the shared
    /// JSON Schema, and the checks the schema cannot express.
    /// </summary>
    internal static class StyleValidator
    {
        /// <summary>
        /// Throws a <see cref="StyleValidationException"/> when
        /// <paramref name="definition"/> nests deeper than this port reads,
        /// violates the style definition schema, carries an <c>extends</c>
        /// alias that points at something that cannot be aliased, closes a
        /// component cycle, or lists animation keyframes out of order.
        /// </summary>
        internal static void Validate(JsonNode? definition)
        {
            // Before the schema validator, which walks the definition with
            // recursion and would run out of stack rather than report
            // anything.
            if (JsonSnapshot.ExceedsMaxDepth(definition))
            {
                throw new StyleValidationException(new[]
                {
                    new ValidationErrorDetail(message: JsonSnapshot.DepthMessage),
                });
            }

            try
            {
                StyleSchemaValidator.Validate(definition);
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

            // The checks below read the same copy the style reads, so a
            // hand-built number counts as a number here too.
            var data = JsonSnapshot.Of(definition);

            ValidateAliases(data);
            ValidateComponentCycles(data);
            ValidateAnimations(data);
        }

        private static bool IsAlias(JsonObject data) => data.ContainsKey("extends");

        /// <summary>
        /// Verifies that every component declared via <c>extends</c> references
        /// an existing, non-alias component in the same <c>components</c> map.
        /// The schema itself cannot enforce cross-references between sibling
        /// keys.
        /// </summary>
        private static void ValidateAliases(JsonObject definition)
        {
            var components = JsonRead.Obj(definition, "components");

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
        /// Verifies that no component renders itself, directly or through
        /// other components. The renderer registers a variant's
        /// <c>&lt;defs&gt;</c> entry only after its body has rendered, so a
        /// cycle would recurse until the stack runs out. A reference to an
        /// alias counts as a reference to its source, since the alias renders
        /// the source's variants. Unknown names render nothing and close no
        /// cycle. Runs after <see cref="ValidateAliases"/>, so every alias
        /// points at a base component here.
        /// </summary>
        private static void ValidateComponentCycles(JsonObject definition)
        {
            var components = JsonRead.Obj(definition, "components");

            if (components is null)
            {
                return;
            }

            var references = new Dictionary<string, List<(string Name, string Source, string Path)>>(StringComparer.Ordinal);
            var order = new List<string>();

            foreach (var entry in components)
            {
                if (entry.Value is not JsonObject data || IsAlias(data))
                {
                    continue;
                }

                var found = new List<(string Name, string Source, string Path)>();

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

                        if (JsonRead.Str(element, "type") == "component"
                            && JsonRead.Str(element, "name") is string referenced
                            && components[referenced] is JsonObject target)
                        {
                            var source = IsAlias(target)
                                ? JsonRead.Str(target, "extends") ?? referenced
                                : referenced;

                            found.Add((referenced, source, elementPath));
                        }

                        Walk(element["children"] as JsonArray, elementPath + "/children");
                    }
                }

                var variants = JsonRead.Obj(data, "variants");

                if (variants is not null)
                {
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

                references[entry.Key] = found;
                order.Add(entry.Key);
            }

            // Depth-first search: a reference to a component that is still on
            // the stack closes a cycle. The depth is bounded by the number of
            // components.
            var onStack = new HashSet<string>(StringComparer.Ordinal);
            var done = new HashSet<string>(StringComparer.Ordinal);
            var errors = new List<ValidationErrorDetail>();

            void Visit(string name)
            {
                onStack.Add(name);

                if (references.TryGetValue(name, out var outgoing))
                {
                    foreach (var reference in outgoing)
                    {
                        if (onStack.Contains(reference.Source))
                        {
                            errors.Add(new ValidationErrorDetail(
                                message: $"references component \"{reference.Name}\", which leads back to \"{reference.Source}\" — component cycles are not allowed",
                                instancePath: reference.Path));
                        }
                        else if (!done.Contains(reference.Source))
                        {
                            Visit(reference.Source);
                        }
                    }
                }

                onStack.Remove(name);
                done.Add(name);
            }

            foreach (var name in order)
            {
                if (!done.Contains(name))
                {
                    Visit(name);
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
        /// between array items. Step jumps are expressed with the <c>hold</c>
        /// easing rather than duplicate positions.
        /// </summary>
        private static void ValidateAnimations(JsonObject definition)
        {
            var errors = new List<ValidationErrorDetail>();

            VisitElements(definition, (element, path) =>
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
        /// the element and its JSON pointer path. The same walk as
        /// <c>Style.VisitElements</c>.
        /// </summary>
        private static void VisitElements(JsonObject definition, Action<JsonObject, string> visit)
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

            Walk(JsonRead.Obj(definition, "canvas")?["elements"] as JsonArray, "/canvas/elements");

            var components = JsonRead.Obj(definition, "components");

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
    }
}
