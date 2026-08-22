using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;
using DiceBear.Internal;

namespace DiceBear
{
    /// <summary>
    /// Builds a descriptor of every option a given style accepts.
    /// </summary>
    /// <remarks>
    /// Tooling such as the editor uses the result to render form controls and
    /// validation hints without having to introspect the style itself.
    /// </remarks>
    public sealed class OptionsDescriptor
    {
        private readonly Style _style;

        private JsonObject? _descriptor;

        /// <summary>
        /// Creates a descriptor builder for the given style.
        /// </summary>
        public OptionsDescriptor(Style style)
        {
            _style = style ?? throw new ArgumentNullException(nameof(style));
        }

        /// <summary>
        /// Returns a deep copy of the descriptor, building it lazily on first
        /// call.
        /// </summary>
        public JsonObject ToJson()
        {
            _descriptor ??= Build();

            return _descriptor.DeepClone().AsObject();
        }

        private static JsonObject RotateRange() => new JsonObject
        {
            ["type"] = "range",
            ["min"] = -360,
            ["max"] = 360,
        };

        private static JsonObject TranslateRange() => new JsonObject
        {
            ["type"] = "range",
            ["min"] = -1000,
            ["max"] = 1000,
        };

        /// <summary>
        /// Walks the style's components and colors and assembles the field map.
        /// </summary>
        private JsonObject Build()
        {
            var descriptor = new JsonObject();

            descriptor["seed"] = new JsonObject { ["type"] = "string" };
            descriptor["size"] = new JsonObject { ["type"] = "number", ["min"] = 1, ["max"] = 4096 };
            descriptor["idRandomization"] = new JsonObject { ["type"] = "boolean" };
            descriptor["title"] = new JsonObject { ["type"] = "string" };
            descriptor["flip"] = new JsonObject
            {
                ["type"] = "enum",
                ["values"] = new JsonArray("none", "horizontal", "vertical", "both"),
                ["list"] = true,
            };
            descriptor["fontFamily"] = new JsonObject { ["type"] = "string", ["list"] = true };
            descriptor["fontWeight"] = new JsonObject
            {
                ["type"] = "number",
                ["min"] = 1,
                ["max"] = 1000,
                ["list"] = true,
            };
            descriptor["scale"] = new JsonObject { ["type"] = "range", ["min"] = 0, ["max"] = 10 };
            descriptor["borderRadius"] = new JsonObject { ["type"] = "range", ["min"] = 0, ["max"] = 50 };
            descriptor["rotate"] = RotateRange();
            descriptor["translateX"] = TranslateRange();
            descriptor["translateY"] = TranslateRange();

            var tags = new HashSet<string>(StringComparer.Ordinal);

            foreach (var entry in _style.Components())
            {
                var component = entry.Value;

                if (component.ExtendsName() is not null)
                {
                    continue;
                }

                var variants = component.Variants();

                descriptor[entry.Key + "Variant"] = new JsonObject
                {
                    ["type"] = "enum",
                    ["values"] = ToArray(Sorted(variants.Keys)),
                    ["list"] = true,
                    ["weighted"] = true,
                };
                descriptor[entry.Key + "Probability"] = new JsonObject
                {
                    ["type"] = "number",
                    ["min"] = 0,
                    ["max"] = 100,
                };

                foreach (var variant in variants.Values)
                {
                    foreach (var tag in variant.Tags())
                    {
                        tags.Add(tag);
                    }
                }
            }

            var colors = _style.Colors();
            var colorNames = colors.Keys.Concat(new[] { "background" });

            foreach (var name in colorNames)
            {
                var hasColor = colors.TryGetValue(name, out var color);
                var contrastTo = hasColor ? color.ContrastTo() : null;
                var notEqualTo = hasColor ? color.NotEqualTo() : Array.Empty<string>();

                var field = new JsonObject { ["type"] = "color", ["list"] = true };

                if (!string.IsNullOrEmpty(contrastTo))
                {
                    field["contrastTo"] = contrastTo;
                }

                if (notEqualTo.Count > 0)
                {
                    field["notEqualTo"] = ToArray(notEqualTo);
                }

                descriptor[name + "Color"] = field;
                descriptor[name + "ColorFill"] = new JsonObject
                {
                    ["type"] = "enum",
                    ["values"] = new JsonArray("solid", "linear", "radial"),
                    ["list"] = true,
                };
                descriptor[name + "ColorFillStops"] = new JsonObject { ["type"] = "range", ["min"] = 2 };
                descriptor[name + "ColorAngle"] = RotateRange();
                descriptor[name + "ColorOrder"] = new JsonObject
                {
                    ["type"] = "enum",
                    ["values"] = new JsonArray(Resolver.ColorOrderRandom, Resolver.ColorOrderFixed),
                };
            }

            // Only advertise the `tags` filter when the style actually carries
            // tags. The values are the sorted union of every tag across the
            // style's variants, but `open` marks them as suggestions: the
            // filter also accepts `!` disallows and bare categories. Only an
            // unknown category is ignored. An unknown value inside a category
            // the style does use matches nothing, so every variant tagged on
            // that axis is dropped.
            if (tags.Count > 0)
            {
                descriptor["tags"] = new JsonObject
                {
                    ["type"] = "enum",
                    ["values"] = ToArray(Sorted(tags.ToList())),
                    ["list"] = true,
                    ["open"] = true,
                };
            }

            return descriptor;
        }

        private static IReadOnlyList<string> Sorted(IReadOnlyList<string> values) =>
            values.OrderBy(value => value, StringComparer.Ordinal).ToList();

        private static JsonArray ToArray(IReadOnlyList<string> values)
        {
            var array = new JsonArray();

            foreach (var value in values)
            {
                array.Add(JsonValue.Create(value));
            }

            return array;
        }
    }
}
