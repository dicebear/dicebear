using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Json.Schema;

namespace DiceBear.Internal
{
    /// <summary>
    /// Shared plumbing for the style and options validators: schema
    /// compilation and the mapping from JsonSchema.Net failures to
    /// <see cref="ValidationErrorDetail"/>.
    /// </summary>
    /// <remarks>
    /// The JS port has no counterpart for this file — its validators are
    /// standalone code compiled from the schemas at build time. Here the two
    /// validators compile their schema at runtime instead and share this
    /// helper. Only the accept and reject decisions are parity-pinned across
    /// the ports, the detail list and the message text are not.
    /// </remarks>
    internal static class SchemaValidator
    {
        private static readonly Lazy<JsonSchema> DefinitionSchema =
            new Lazy<JsonSchema>(() => Compile(DiceBear.Schema.Definition));

        private static readonly Lazy<JsonSchema> OptionsSchema =
            new Lazy<JsonSchema>(() => Compile(DiceBear.Schema.Options));

        private static readonly EvaluationOptions Options = new EvaluationOptions
        {
            OutputFormat = OutputFormat.List,
        };

        /// <summary>
        /// Collects every way <paramref name="data"/> violates
        /// <c>definition.json</c>. An empty result means the data is valid.
        /// </summary>
        internal static IReadOnlyList<ValidationErrorDetail> CollectStyleErrors(JsonNode? data) =>
            Collect(DefinitionSchema.Value, data);

        /// <summary>
        /// Collects every way <paramref name="data"/> violates
        /// <c>options.json</c>. An empty result means the data is valid.
        /// </summary>
        internal static IReadOnlyList<ValidationErrorDetail> CollectOptionsErrors(JsonNode? data) =>
            Collect(OptionsSchema.Value, data);

        private static IReadOnlyList<ValidationErrorDetail> Collect(JsonSchema schema, JsonNode? data)
        {
            // JSON cannot represent non-finite numbers, and the compiled
            // validators of the JS reference reject them wherever a number is
            // allowed (`type: "number"` compiles to `typeof data == "number" &&
            // isFinite(data)`). A hand-built JsonObject can still hold one, and
            // serializing it would throw instead of reporting a validation
            // failure, so the walk comes first.
            var nonFinite = new List<ValidationErrorDetail>();

            CollectNonFinite(data, string.Empty, nonFinite);

            if (nonFinite.Count > 0)
            {
                return nonFinite;
            }

            var results = schema.Evaluate(ToElement(data), Options);

            if (results.IsValid)
            {
                return Array.Empty<ValidationErrorDetail>();
            }

            var details = new List<ValidationErrorDetail>();

            foreach (var node in results.Details ?? new List<EvaluationResults>())
            {
                if (node.Errors is null)
                {
                    continue;
                }

                foreach (var error in node.Errors)
                {
                    var keyword = string.IsNullOrEmpty(error.Key) ? null : error.Key;
                    // The absolute schema location carries a generated base URI
                    // that changes from run to run, so the pointer is composed
                    // from the evaluation path instead: stable, and shaped like
                    // the `schemaPath` the reference reports.
                    var schemaPath = "#" + node.EvaluationPath
                        + (keyword is null ? string.Empty : "/" + keyword);

                    details.Add(new ValidationErrorDetail(
                        message: error.Value,
                        instancePath: node.InstanceLocation.ToString(),
                        schemaPath: schemaPath,
                        keyword: keyword));
                }
            }

            // An invalid instance must never come back with an empty detail
            // list, or the caller would read it as valid.
            if (details.Count == 0)
            {
                details.Add(new ValidationErrorDetail(message: "does not match the schema"));
            }

            return details;
        }

        private static JsonElement ToElement(JsonNode? data) => JsonSerializer.SerializeToElement(data);

        private static void CollectNonFinite(JsonNode? node, string path, List<ValidationErrorDetail> into)
        {
            switch (node)
            {
                case JsonArray array:
                    for (var i = 0; i < array.Count; i++)
                    {
                        CollectNonFinite(array[i], path + "/" + i, into);
                    }

                    break;

                case JsonObject obj:
                    foreach (var entry in obj)
                    {
                        CollectNonFinite(entry.Value, path + "/" + PointerSegment(entry.Key), into);
                    }

                    break;

                case JsonValue value:
                    if (value.TryGetValue<double>(out var number)
                        && (double.IsNaN(number) || double.IsInfinity(number)))
                    {
                        into.Add(new ValidationErrorDetail(
                            message: "must be a finite number",
                            instancePath: path));
                    }

                    break;
            }
        }

        /// <summary>
        /// Escapes a JSON pointer segment per RFC 6901 (<c>~</c> to <c>~0</c>,
        /// <c>/</c> to <c>~1</c>).
        /// </summary>
        private static string PointerSegment(string key) =>
            key.Replace("~", "~0").Replace("/", "~1");

        /// <summary>
        /// Parses one of the shared schemas, brings its anchors in line with
        /// ECMA-262, and compiles the result.
        /// </summary>
        /// <remarks>
        /// <para>
        /// JsonSchema.Net hands every <c>pattern</c> to
        /// <c>System.Text.RegularExpressions</c> with
        /// <c>RegexOptions.ECMAScript</c>, and that flag does not make the .NET
        /// engine an ECMA-262 engine. <c>$</c> is where the two still part
        /// ways. .NET matches it at the end of the input or right before a
        /// single trailing newline, whatever options are set, while ECMA-262
        /// without the <c>m</c> flag matches only at the end of the input, and
        /// that is what the compiled validators of the JS reference do.
        /// Untranslated, every anchored pattern here would accept a value with
        /// a trailing newline that the other ports reject, and that value
        /// would go on to be rendered into the SVG.
        /// </para>
        /// <para>
        /// The shared schemas cannot settle this by spelling the anchor out,
        /// because no spelling reads the same everywhere: <c>\z</c> is unknown
        /// to ECMA-262, <c>\Z</c> means "before a trailing newline" in several
        /// other engines, and <c>(?![\s\S])</c> needs a lookahead that not
        /// every engine has. So the port whose engine takes <c>$</c> the wide
        /// way translates it, and <see cref="EvaluationOptions"/> carries no
        /// setting that would do it here.
        /// </para>
        /// </remarks>
        private static JsonSchema Compile(string text)
        {
            var schema = JsonNode.Parse(text)
                ?? throw new InvalidOperationException("The schema is empty");

            RewritePatterns(schema);

            return JsonSchema.FromText(schema.ToJsonString());
        }

        /// <summary>
        /// Walks a parsed schema and replaces every <c>pattern</c> value and
        /// every <c>patternProperties</c> key with its rewritten form.
        /// </summary>
        private static void RewritePatterns(JsonNode? node)
        {
            switch (node)
            {
                case JsonArray array:
                    foreach (var item in array)
                    {
                        RewritePatterns(item);
                    }

                    break;

                case JsonObject obj:
                    // Walking a snapshot keeps the loop valid while entries of
                    // `obj` are being replaced.
                    foreach (var entry in new List<KeyValuePair<string, JsonNode?>>(obj))
                    {
                        var key = entry.Key;
                        var value = entry.Value;

                        if (key == "pattern"
                            && value is JsonValue pattern
                            && pattern.TryGetValue<string>(out var source))
                        {
                            obj[key] = JsonValue.Create(RewritePattern(source));
                        }
                        else if (key == "patternProperties" && value is JsonObject patterned)
                        {
                            obj[key] = RewritePatternProperties(patterned);
                        }
                        else if (IsSchemaMap(key) && value is JsonObject named)
                        {
                            // Only the values are schemas here. A member called
                            // `pattern` is a property name, not a keyword.
                            foreach (var member in named)
                            {
                                RewritePatterns(member.Value);
                            }
                        }
                        else if (!HoldsInstanceData(key))
                        {
                            RewritePatterns(value);
                        }
                    }

                    break;
            }
        }

        /// <summary>
        /// Whether <paramref name="key"/> maps names to subschemas rather than
        /// being a subschema itself.
        /// </summary>
        private static bool IsSchemaMap(string key) =>
            key == "properties"
            || key == "definitions"
            || key == "$defs"
            || key == "dependencies"
            || key == "dependentSchemas";

        /// <summary>
        /// Whether <paramref name="key"/> holds instance values instead of
        /// subschemas. A <c>pattern</c> nested under one of these is data and
        /// has to come through the walk untouched.
        /// </summary>
        private static bool HoldsInstanceData(string key) =>
            key == "const" || key == "enum" || key == "default" || key == "examples";

        /// <summary>
        /// Rebuilds a <c>patternProperties</c> map with its keys rewritten.
        /// </summary>
        private static JsonObject RewritePatternProperties(JsonObject map)
        {
            var rewritten = new JsonObject();

            foreach (var entry in map)
            {
                // Cloning detaches the subschema, which a node has to be before
                // it can go into another object.
                var subSchema = entry.Value?.DeepClone();

                RewritePatterns(subSchema);

                rewritten[RewritePattern(entry.Key)] = subSchema;
            }

            return rewritten;
        }

        /// <summary>
        /// Rewrites one ECMA-262 regular expression into the form the .NET
        /// engine reads the same way. <see cref="Compile"/> covers what
        /// diverges and why it matters.
        /// </summary>
        /// <exception cref="InvalidOperationException">
        /// The pattern uses something this rewriter cannot translate without
        /// guessing. The schemas ship with the port, so that is a bug in the
        /// port rather than anything a caller can provoke.
        /// </exception>
        private static string RewritePattern(string pattern)
        {
            var rewritten = new StringBuilder(pattern.Length);
            var inClass = false;

            for (var i = 0; i < pattern.Length; i++)
            {
                var current = pattern[i];

                if (current == '\\')
                {
                    if (i + 1 == pattern.Length)
                    {
                        throw Untranslatable(pattern, "it ends on a lone backslash");
                    }

                    // Every escape reads the same in both engines, `\\` and
                    // `\$` included. Copying the pair over keeps an escaped
                    // bracket from opening or closing a class and an escaped
                    // dollar from being read as the anchor.
                    rewritten.Append(current).Append(pattern[i + 1]);
                    i++;
                    continue;
                }

                if (current == '[' && !inClass)
                {
                    inClass = true;
                }
                else if (current == ']' && inClass)
                {
                    inClass = false;
                }
                else if (current == '$' && !inClass)
                {
                    // `\z` is the .NET spelling of the anchor ECMA-262 gives
                    // `$` while the `m` flag is off. Inside a class `$` is a
                    // literal and stays one.
                    rewritten.Append(@"\z");
                    continue;
                }

                rewritten.Append(current);
            }

            if (inClass)
            {
                throw Untranslatable(pattern, "a character class is left open");
            }

            return rewritten.ToString();
        }

        /// <summary>
        /// Builds the failure for a pattern the rewriter refuses to translate.
        /// </summary>
        private static InvalidOperationException Untranslatable(string pattern, string reason) =>
            new InvalidOperationException(
                "The schema pattern '" + pattern + "' cannot be translated because " + reason + ".");
    }
}
