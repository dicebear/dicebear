using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using DiceBear.Internal;

namespace DiceBear
{
    /// <summary>
    /// Top-level entry point for rendering an avatar from a style and options.
    /// </summary>
    /// <remarks>
    /// Construction immediately resolves and renders the SVG; the accessors
    /// return different serializations of that result.
    /// </remarks>
    public sealed class Avatar
    {
        private readonly string _svg;
        private readonly OrderedMap<object?> _resolvedOptions;

        /// <summary>
        /// Validates the options, then resolves and renders an avatar for the
        /// given style. Passing no options is the same as passing an empty
        /// object.
        /// </summary>
        /// <exception cref="OptionsValidationException">
        /// The options violate the options schema.
        /// </exception>
        /// <exception cref="CircularColorReferenceException">
        /// A color in the style definition references itself.
        /// </exception>
        /// <exception cref="CircularComponentReferenceException">
        /// A component in the style definition references itself.
        /// </exception>
        public Avatar(Style style, JsonObject? options = null)
        {
            if (style is null)
            {
                throw new ArgumentNullException(nameof(style));
            }

            var resolver = new Resolver(style, new Options(options));

            _svg = new Renderer(style, resolver).Render();
            _resolvedOptions = resolver.Resolved();
        }

        /// <summary>
        /// Renders an avatar from options given as JSON text.
        /// </summary>
        /// <exception cref="OptionsValidationException">
        /// The text is not valid JSON, or the options violate the schema.
        /// </exception>
        public static Avatar FromJson(Style style, string optionsJson)
        {
            JsonNode? node;

            try
            {
                node = JsonNode.Parse(optionsJson);
            }
            catch (JsonException exception)
            {
                throw new OptionsValidationException(new[]
                {
                    new ValidationErrorDetail(message: exception.Message),
                });
            }

            if (node is not JsonObject options)
            {
                // The constructor reads a null argument as "no options", which
                // is what its default parameter means. JSON text always carries
                // a value, so `null`, `[]` and `5` are inputs the schema
                // rejects rather than an absent argument.
                OptionsValidator.Validate(node);

                options = new JsonObject();
            }

            return new Avatar(style, options);
        }

        /// <summary>
        /// Returns the rendered SVG markup.
        /// </summary>
        public string ToSvg() => _svg;

        /// <summary>
        /// Returns the rendered SVG markup.
        /// </summary>
        public override string ToString() => _svg;

        /// <summary>
        /// Returns the SVG encoded as a <c>data:image/svg+xml</c> URI.
        /// </summary>
        public string ToDataUri() => "data:image/svg+xml;charset=utf-8," + Num.EncodeUriComponent(_svg);

        /// <summary>
        /// Returns the fully resolved options used to render the avatar, in
        /// resolution order. The raw seed is deliberately excluded.
        /// </summary>
        /// <remarks>
        /// A fresh object on every call, so a caller mutating the result cannot
        /// corrupt the avatar's internal state.
        /// </remarks>
        public JsonObject ResolvedOptions()
        {
            var result = new JsonObject();

            foreach (var entry in _resolvedOptions)
            {
                var value = ToJsonNode(entry.Value);

                // An option the user left unset is stored as null and dropped
                // here, the way JSON.stringify drops an undefined value in the
                // reference.
                if (value is not null)
                {
                    result[entry.Key] = value;
                }
            }

            return result;
        }

        /// <summary>
        /// Returns <c>{ "svg", "options" }</c> — the SVG and the resolved
        /// options used to render it — as JSON text.
        /// </summary>
        public string ToJson()
        {
            var envelope = new JsonObject
            {
                ["svg"] = JsonValue.Create(_svg),
                ["options"] = ResolvedOptions(),
            };

            return JsonWrite.Node(envelope);
        }

        private static JsonNode? ToJsonNode(object? value)
        {
            switch (value)
            {
                case null:
                    return null;
                case string text:
                    return JsonValue.Create(text);
                case bool flag:
                    return JsonValue.Create(flag);
                case double number:
                    return JsonValue.Create(number);
                case IReadOnlyList<string> list:
                    {
                        var array = new JsonArray();

                        foreach (var item in list)
                        {
                            array.Add(JsonValue.Create(item));
                        }

                        return array;
                    }

                default:
                    return JsonValue.Create(value.ToString());
            }
        }
    }
}
