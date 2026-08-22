using System;
using System.Collections.Generic;
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

            OptionsValidator.Validate(input);

            // The round-trip is both the deep clone the reference gets from
            // structuredClone and a normalization step: whether the caller
            // parsed JSON or built the object by hand, every leaf ends up
            // backed by a JsonElement, so a C# int and the JSON 128 behave the
            // same from here on.
            _data = JsonNode.Parse(input.ToJsonString()) as JsonObject ?? new JsonObject();
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
