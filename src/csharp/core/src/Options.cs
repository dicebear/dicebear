using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// A parsed <c>tags</c> filter token.
    /// </summary>
    /// <remarks>
    /// <see cref="Options.Tags"/> decodes each raw <c>category</c> /
    /// <c>category:value</c> / <c>!…</c> string into this shape so the
    /// resolver composes the filter without parsing the grammar itself.
    /// </remarks>
    internal readonly struct TagFilterToken
    {
        internal TagFilterToken(string category, string? value, bool negated)
        {
            Category = category;
            Value = value;
            Negated = negated;
        }

        internal string Category { get; }

        internal string? Value { get; }

        internal bool Negated { get; }
    }

    /// <summary>
    /// Copies a validated document into the form the typed accessors read.
    /// </summary>
    /// <remarks>
    /// The copy is what the reference gets from <c>structuredClone</c>: once
    /// construction is done, changing the object the caller passed in cannot
    /// change a rendered avatar. Numbers are rebuilt from their JSON text on
    /// the way, because a hand-built C# <c>int</c> does not read back as a
    /// <c>double</c> and would drop out of the accessors. After the copy, a
    /// hand-built <c>128</c> and a parsed <c>128</c> read the same.
    ///
    /// Serializing the document and parsing it back does both jobs in one
    /// line, and that is what this class replaces. The round-trip encodes to
    /// UTF-8, so an unpaired surrogate in a seed or a title comes back as
    /// U+FFFD and the seed then drives a different PRNG stream than the
    /// reference. It also left the nesting limit to a serializer default,
    /// which <see cref="MaxDepth"/> states as a number of its own.
    /// </remarks>
    internal static class JsonSnapshot
    {
        /// <summary>
        /// How many levels of objects and arrays a document may nest before
        /// the port turns it down. Levels are counted the way the JSON reader
        /// counts them, so only objects and arrays add to the depth.
        /// </summary>
        /// <remarks>
        /// The reference sets no limit of its own and renders a thousand
        /// nested elements before the JavaScript stack runs out. This port
        /// names a number instead, and two things pin it here. The validator
        /// hands the document to the schema library through a serializer that
        /// reads 64 levels of its own, and that library evaluates the document
        /// with recursion at a cost of several kilobytes of stack per level,
        /// so a document two or three times deeper ends the process on a one
        /// megabyte thread rather than coming back as an error a caller can
        /// catch. 64 levels is around five times what the
        /// deepest style definition uses.
        /// </remarks>
        internal const int MaxDepth = 64;

        /// <summary>
        /// What the callers report when a document nests too deep. Both entry
        /// points read the wording from here, so they say the same thing.
        /// </summary>
        internal static readonly string DepthMessage =
            $"nesting is deeper than the {MaxDepth} levels this port reads";

        /// <summary>
        /// Returns whether <paramref name="node"/> nests deeper than
        /// <see cref="MaxDepth"/>.
        /// </summary>
        /// <remarks>
        /// Callers ask before anything else walks the document, so input that
        /// would run the validator out of stack is turned down first. Only
        /// objects and arrays count toward the depth, the way the JSON reader
        /// counts it.
        /// </remarks>
        internal static bool ExceedsMaxDepth(JsonNode? node) => ExceedsMaxDepth(node, 1);

        /// <summary>
        /// Returns the copy as an object, or an empty object when the document
        /// has no object at its root. Check
        /// <see cref="ExceedsMaxDepth(JsonNode?)"/> first, since the copy
        /// follows the document's nesting.
        /// </summary>
        internal static JsonObject Of(JsonNode? node) => Copy(node) as JsonObject ?? new JsonObject();

        private static bool ExceedsMaxDepth(JsonNode? node, int depth)
        {
            if (node is JsonObject obj)
            {
                if (depth > MaxDepth)
                {
                    return true;
                }

                foreach (var entry in obj)
                {
                    if (ExceedsMaxDepth(entry.Value, depth + 1))
                    {
                        return true;
                    }
                }

                return false;
            }

            if (node is JsonArray array)
            {
                if (depth > MaxDepth)
                {
                    return true;
                }

                foreach (var item in array)
                {
                    if (ExceedsMaxDepth(item, depth + 1))
                    {
                        return true;
                    }
                }

                return false;
            }

            return false;
        }

        /// <summary>
        /// Copies one node, rebuilding numbers from their JSON text and taking
        /// everything else as it stands.
        /// </summary>
        private static JsonNode? Copy(JsonNode? node)
        {
            if (node is JsonObject obj)
            {
                var result = new JsonObject();

                foreach (var entry in obj)
                {
                    result[entry.Key] = Copy(entry.Value);
                }

                return result;
            }

            if (node is JsonArray array)
            {
                var items = new JsonArray();

                foreach (var item in array)
                {
                    items.Add(Copy(item));
                }

                return items;
            }

            if (node is JsonValue value && value.GetValueKind() == JsonValueKind.Number)
            {
                return Number(value);
            }

            return node?.DeepClone();
        }

        /// <summary>
        /// Rebuilds a number from its own JSON text, which keeps the digits the
        /// caller wrote and makes the value read as a number whatever it was
        /// built from.
        /// </summary>
        private static JsonNode Number(JsonValue value)
        {
            using (var document = JsonDocument.Parse(value.ToJsonString()))
            {
                return JsonValue.Create(document.RootElement.Clone())!;
            }
        }
    }

    /// <summary>
    /// Validates the raw user-supplied options and exposes them through typed
    /// accessors.
    /// </summary>
    /// <remarks>
    /// Each accessor returns the user's input in a normalized form (always a
    /// list for options that accept either a scalar or an array, or
    /// <see langword="null"/> when the option is not set), so consumers —
    /// chiefly <see cref="Resolver"/> — never have to do their own
    /// normalization. Resolution against the style definition and the PRNG
    /// happens in <see cref="Resolver"/>; this class is purely about reading
    /// user input.
    /// </remarks>
    internal sealed class Options
    {
        private readonly JsonObject _data;

        private IReadOnlyList<TagFilterToken>? _tags;

        internal Options(JsonNode? data)
        {
            var input = data ?? new JsonObject();

            if (JsonSnapshot.ExceedsMaxDepth(input))
            {
                throw new OptionsValidationException(new[]
                {
                    new ValidationErrorDetail(message: JsonSnapshot.DepthMessage),
                });
            }

            try
            {
                OptionsValidator.Validate(input);
            }
            catch (JsonException exception)
            {
                // The validator reads the options through a serializer, which
                // turns some documents down on its own: one nested past its
                // limit, or a string that came in as JSON text carrying an
                // unpaired surrogate. Either way it leaves here as this port's
                // own error.
                throw new OptionsValidationException(new[]
                {
                    new ValidationErrorDetail(message: exception.Message),
                });
            }

            _data = JsonSnapshot.Of(input);
        }

        internal string? Seed() => JsonRead.Str(_data, "seed");

        internal double? Size() => JsonRead.Num(_data, "size");

        internal bool? IdRandomization() => JsonRead.Bool(_data, "idRandomization");

        internal string? Title() => JsonRead.Str(_data, "title");

        internal IReadOnlyList<string> Flip() => StringList(_data["flip"]);

        internal IReadOnlyList<string> FontFamily() => StringList(_data["fontFamily"]);

        internal IReadOnlyList<double> FontWeight() => NumberList(_data["fontWeight"]);

        internal NumberRange? Scale() => ToRange(_data["scale"]);

        internal NumberRange? BorderRadius() => ToRange(_data["borderRadius"]);

        internal NumberRange? Rotate() => ToRange(_data["rotate"]);

        internal NumberRange? TranslateX() => ToRange(_data["translateX"]);

        internal NumberRange? TranslateY() => ToRange(_data["translateY"]);

        /// <summary>
        /// Returns the animation switch as given for booleans, or a name
        /// selection normalized to a list (a bare name becomes a one-element
        /// list). Null when unset.
        /// </summary>
        internal object? Animation()
        {
            var node = _data["animation"];

            if (node is null)
            {
                return null;
            }

            if (JsonRead.Bool(node) is bool flag)
            {
                return flag;
            }

            return StringList(node);
        }

        internal NumberRange? AnimationSpeed() => ToRange(_data["animationSpeed"]);

        /// <summary>
        /// Returns the global <c>tags</c> filter as parsed tokens, or an empty
        /// list when unset.
        /// </summary>
        /// <remarks>
        /// Each raw token (<c>category</c> / <c>category:value</c>, optionally
        /// <c>!</c>-prefixed to disallow) is decoded into category, value and
        /// negated so the resolver composes the filter without parsing the
        /// grammar itself. An empty list means no tag filtering (classic
        /// behavior). Memoized, since the resolver reads it once per
        /// component.
        /// </remarks>
        internal IReadOnlyList<TagFilterToken> Tags()
        {
            if (_tags is not null)
            {
                return _tags;
            }

            var tokens = new List<TagFilterToken>();

            foreach (var raw in StringList(_data["tags"]))
            {
                var negated = raw.StartsWith("!", StringComparison.Ordinal);
                var body = negated ? raw.Substring(1) : raw;
                var separator = body.IndexOf(':');

                tokens.Add(separator == -1
                    ? new TagFilterToken(body, null, negated)
                    : new TagFilterToken(
                        body.Substring(0, separator),
                        body.Substring(separator + 1),
                        negated));
            }

            return _tags = tokens;
        }

        /// <summary>
        /// Returns the user-set variant constraint for <paramref name="name"/>
        /// as a weighted map, or <see langword="null"/> when
        /// <c>{name}Variant</c> is unset.
        /// </summary>
        /// <remarks>
        /// A bare string or string list is normalized to a map with each entry
        /// weighted <c>1</c>. The map keeps the option's own order, which is
        /// the order the resolver draws the pool in.
        /// </remarks>
        internal OrderedMap<double>? ComponentVariant(string name)
        {
            var raw = _data[name + "Variant"];

            if (raw is null)
            {
                return null;
            }

            var weights = new OrderedMap<double>();

            if (raw is JsonArray array)
            {
                foreach (var item in array)
                {
                    var value = JsonRead.Str(item);

                    if (value is not null)
                    {
                        weights.Set(value, 1.0);
                    }
                }

                return weights;
            }

            if (raw is JsonObject obj)
            {
                foreach (var entry in obj)
                {
                    weights.Set(entry.Key, JsonRead.Num(entry.Value) ?? 0.0);
                }

                return weights;
            }

            var single = JsonRead.Str(raw);

            if (single is not null)
            {
                weights.Set(single, 1.0);
            }

            return weights;
        }

        internal double? ComponentProbability(string name) => JsonRead.Num(_data, name + "Probability");

        /// <summary>
        /// Asymmetric on purpose: returns <see langword="null"/> (rather than
        /// an empty list) when <c>{name}Color</c> is unset, so the resolver can
        /// fall back to the style definition's color values.
        /// </summary>
        internal IReadOnlyList<string>? ColorNames(string name)
        {
            var raw = _data[name + "Color"];

            return raw is null ? null : StringList(raw);
        }

        internal IReadOnlyList<string> ColorFill(string name) => StringList(_data[name + "ColorFill"]);

        internal NumberRange? ColorAngle(string name) => ToRange(_data[name + "ColorAngle"]);

        internal NumberRange? ColorFillStops(string name) => ToRange(_data[name + "ColorFillStops"]);

        internal string? ColorOrder(string name) => JsonRead.Str(_data, name + "ColorOrder");

        /// <summary>
        /// Normalizes a scalar, list or absent value into a list of strings.
        /// </summary>
        private static IReadOnlyList<string> StringList(JsonNode? value)
        {
            if (value is null)
            {
                return Array.Empty<string>();
            }

            if (value is JsonArray array)
            {
                var result = new List<string>(array.Count);

                foreach (var item in array)
                {
                    var entry = JsonRead.Str(item);

                    if (entry is not null)
                    {
                        result.Add(entry);
                    }
                }

                return result;
            }

            var single = JsonRead.Str(value);

            return single is null ? Array.Empty<string>() : new[] { single };
        }

        /// <summary>
        /// Normalizes a scalar, list or absent value into a list of numbers.
        /// </summary>
        private static IReadOnlyList<double> NumberList(JsonNode? value)
        {
            if (value is null)
            {
                return Array.Empty<double>();
            }

            if (value is JsonArray array)
            {
                var result = new List<double>(array.Count);

                foreach (var item in array)
                {
                    var entry = JsonRead.Num(item);

                    if (entry.HasValue)
                    {
                        result.Add(entry.Value);
                    }
                }

                return result;
            }

            var single = JsonRead.Num(value);

            return single.HasValue ? new[] { single.Value } : Array.Empty<double>();
        }

        /// <summary>
        /// Normalizes a user-facing range option (bare number, <c>[n]</c>,
        /// <c>[min, max]</c>, or absent) into the internal
        /// <see cref="NumberRange"/>.
        /// </summary>
        /// <remarks>
        /// A bare number <c>n</c> — or a single-element list <c>[n]</c> —
        /// becomes a fixed value. A list's smaller and larger element are taken
        /// as min and max. An empty list is treated as unset so the resolver
        /// applies the option's default, rather than yielding NaN from a
        /// missing bound. Matches every other port.
        /// </remarks>
        private static NumberRange? ToRange(JsonNode? value)
        {
            if (value is null)
            {
                return null;
            }

            if (value is JsonArray)
            {
                var numbers = NumberList(value);

                if (numbers.Count == 0)
                {
                    return null;
                }

                var min = numbers[0];
                var max = numbers[0];

                foreach (var number in numbers)
                {
                    min = Math.Min(min, number);
                    max = Math.Max(max, number);
                }

                return new NumberRange(min, max);
            }

            var single = JsonRead.Num(value);

            return single.HasValue ? new NumberRange(single.Value, single.Value) : (NumberRange?)null;
        }
    }
}
