using System;
using System.Collections.Generic;
using System.Linq;

namespace DiceBear.Internal
{
    /// <summary>
    /// Bundles the three inputs needed to derive any deterministic value for an
    /// avatar — the <see cref="Style"/>, the validated user
    /// <see cref="Options"/>, and a seeded <see cref="Prng"/> — and exposes
    /// them as named accessors.
    /// </summary>
    /// <remarks>
    /// Each accessor memoizes its result so that repeated calls cannot drift.
    /// The memo also serves as the informational snapshot returned by
    /// <see cref="Resolved"/>: every value the resolver picks during one
    /// resolution lands there, except for the raw seed.
    /// </remarks>
    internal sealed class Resolver
    {
        internal const string ColorOrderRandom = "random";
        internal const string ColorOrderFixed = "fixed";

        private readonly Style _style;
        private readonly Options _options;
        private readonly Prng _prng;
        private readonly List<string> _colorResolving = new List<string>();
        private readonly OrderedMap<object?> _result = new OrderedMap<object?>();

        private TagFilter? _tagFilterCache;

        internal Resolver(Style style, Options options)
        {
            _style = style;
            _options = options;
            _prng = new Prng(Seed());
        }

        /// <summary>
        /// The avatar's seed. Deliberately not memoized — it is the only input
        /// kept out of the <see cref="Resolved"/> snapshot, so a serialized
        /// avatar never leaks it.
        /// </summary>
        internal string Seed() => _options.Seed() ?? string.Empty;

        internal double? Size() => Memo<double?>("size", () => _options.Size());

        internal bool IdRandomization() =>
            Memo("idRandomization", () => _options.IdRandomization() ?? false);

        internal string? Title() => Memo<string?>("title", () => _options.Title());

        internal string Flip() =>
            Memo("flip", () => _prng.Pick("flip", _options.Flip()) ?? "none");

        internal string FontFamily() =>
            Memo("fontFamily", () => _prng.Pick("fontFamily", _options.FontFamily()) ?? "system-ui");

        internal double FontWeight() =>
            Memo("fontWeight", () => _prng.Pick("fontWeight", _options.FontWeight()) ?? 400.0);

        internal double Scale() => MemoFloat("scale", _options.Scale(), 1.0);

        internal double BorderRadius() => MemoFloat("borderRadius", _options.BorderRadius(), 0.0);

        internal double Rotate() => MemoFloat("rotate", _options.Rotate(), 0.0);

        internal double TranslateX() => MemoFloat("translateX", _options.TranslateX(), 0.0);

        internal double TranslateY() => MemoFloat("translateY", _options.TranslateY(), 0.0);

        /// <summary>
        /// Selects a variant for the given component.
        /// </summary>
        /// <remarks>
        /// The pool the PRNG draws from is built from the per-component
        /// <c>{name}Variant</c> option and the global <c>tags</c> filter (see
        /// <see cref="VariantWeights"/>). Only variants that exist in the style
        /// definition are considered.
        /// </remarks>
        internal string? Variant(string name) => Memo<string?>(name + "Variant", () =>
        {
            if (!_style.Components().TryGetValue(name, out var component) || !IsVisible(name, component))
            {
                return null;
            }

            return _prng.WeightedPick(name + "Variant", VariantWeights(component));
        });

        internal IReadOnlyList<string> Color(string name) =>
            Memo(name + "Color", () => ResolveColor(name));

        internal string ColorFill(string name) =>
            Memo(name + "ColorFill", () =>
                _prng.Pick(name + "ColorFill", _options.ColorFill(name)) ?? "solid");

        internal double ColorAngle(string name) =>
            MemoFloat(name + "ColorAngle", _options.ColorAngle(name), 0.0);

        /// <summary>
        /// Deliberately not memoized: unlike <see cref="ColorFill"/> this is no
        /// PRNG pick, so it stays out of the <see cref="Resolved"/> snapshot.
        /// </summary>
        internal string ColorOrder(string name) => _options.ColorOrder(name) ?? ColorOrderRandom;

        /// <summary>
        /// Picks the rotate, translateX, translateY and scale values for a
        /// single component.
        /// </summary>
        /// <remarks>
        /// Memoized per name, so the four values land in
        /// <see cref="Resolved"/> as <c>{name}Rotate</c>,
        /// <c>{name}TranslateX</c>, <c>{name}TranslateY</c> and
        /// <c>{name}Scale</c> for downstream introspection.
        /// </remarks>
        internal ComponentTransform Transform(string name)
        {
            _style.Components().TryGetValue(name, out var component);

            return new ComponentTransform(
                rotate: MemoFloat(name + "Rotate", component?.Rotate(), 0.0),
                translateX: MemoFloat(name + "TranslateX", component?.Translate().X(), 0.0),
                translateY: MemoFloat(name + "TranslateY", component?.Translate().Y(), 0.0),
                scale: MemoFloat(name + "Scale", component?.Scale(), 1.0));
        }

        /// <summary>
        /// Returns an informational snapshot of every value the resolver
        /// picked, in resolution order.
        /// </summary>
        /// <remarks>
        /// <para>
        /// Includes the top-level options (scale, rotate, translate, …), the
        /// per-component variants and colors, and the per-component transform
        /// picks. The raw seed is deliberately excluded, and an option the user
        /// left unset is stored as <see langword="null"/>, which the JSON
        /// envelope drops the way <c>JSON.stringify</c> drops an
        /// <c>undefined</c>.
        /// </para>
        /// <para>
        /// The snapshot is not a round-trippable options object: extra keys
        /// like <c>{name}Rotate</c> are not render options, and feeding the
        /// snapshot back into a new avatar is not supported. Callers that need
        /// to reproduce an avatar should pass the original seed and
        /// user-supplied options.
        /// </para>
        /// </remarks>
        internal OrderedMap<object?> Resolved() => _result;

        /// <summary>
        /// Returns the visibility probability (0–100) for the given component.
        /// Aliases read the source component's user-set probability, so a
        /// single <c>{source}Probability</c> option propagates to every alias
        /// of the source.
        /// </summary>
        private double Probability(Component component) =>
            _options.ComponentProbability(component.SourceName()) ?? component.Probability();

        private bool IsVisible(string name, Component component) =>
            _prng.Bool(name + "Probability", Probability(component));

        /// <summary>
        /// Builds the name to weight map the PRNG draws a variant from.
        /// </summary>
        /// <remarks>
        /// The per-component <c>{name}Variant</c> option is more specific than
        /// the global <c>tags</c> filter, so it takes precedence: when set, it
        /// fully governs the component's pool (its named variants, weighted by
        /// the option) and the tags filter is ignored for that component. The
        /// tags filter applies only where the user gave no explicit
        /// <c>{name}Variant</c> (see <see cref="TagFilteredNames"/>), and falls
        /// back to every variant when neither is set. Names the style does not
        /// define are dropped, and an empty <c>{name}Variant</c> (or an empty
        /// tag result) yields no variant.
        /// </remarks>
        private OrderedMap<double> VariantWeights(Component component)
        {
            var variants = component.Variants();
            var named = _options.ComponentVariant(component.SourceName());
            var weights = new OrderedMap<double>();

            IReadOnlyList<string> names;

            if (named is not null)
            {
                names = named.Keys;
            }
            else if (_options.Tags().Count > 0)
            {
                names = TagFilteredNames(variants);
            }
            else
            {
                names = variants.Keys;
            }

            foreach (var name in names)
            {
                if (!variants.TryGetValue(name, out var variant))
                {
                    continue;
                }

                if (named is not null)
                {
                    named.TryGetValue(name, out var weight);
                    weights.Set(name, weight);
                }
                else
                {
                    weights.Set(name, variant.Weight());
                }
            }

            return weights;
        }

        /// <summary>
        /// Classifies the parsed <see cref="Options.Tags"/> tokens into the
        /// allow groups, bare requirements and disallows the filter is composed
        /// from. The result depends only on the options, never on a component,
        /// so it is computed once per avatar rather than rebuilt for each of a
        /// style's components.
        /// </summary>
        private TagFilter BuildTagFilter()
        {
            if (_tagFilterCache is not null)
            {
                return _tagFilterCache;
            }

            var allows = new OrderedMap<List<string>>();
            var bares = new List<string>();
            var disallows = new List<TagFilterToken>();
            var bareDisallows = new HashSet<string>(StringComparer.Ordinal);

            foreach (var token in _options.Tags())
            {
                if (token.Negated)
                {
                    disallows.Add(token);

                    if (token.Value is null)
                    {
                        bareDisallows.Add(token.Category);
                    }
                }
                else if (token.Value is not null)
                {
                    if (!allows.TryGetValue(token.Category, out var values))
                    {
                        values = new List<string>();
                        allows.Set(token.Category, values);
                    }

                    values.Add(token.Value);
                }
                else if (!bares.Contains(token.Category))
                {
                    bares.Add(token.Category);
                }
            }

            return _tagFilterCache = new TagFilter(allows, bares, disallows, bareDisallows);
        }

        /// <summary>
        /// Narrows a component's variants to the names satisfying the global
        /// <c>tags</c> filter, applying the parsed
        /// <see cref="Options.Tags"/> tokens in one pass over the pool.
        /// </summary>
        /// <remarks>
        /// <para>
        /// A positive <c>cat:value</c> token is an axis-scoped allow. Within
        /// each category some allow mentions, a variant is kept only if it
        /// carries no tag in that category (untouched) or matches one of the
        /// allowed values (OR within the category). Distinct allowed categories
        /// combine with AND, and a category no allow mentions is left
        /// unconstrained.
        /// </para>
        /// <para>
        /// A bare positive <c>cat</c> token requires the category: it drops
        /// variants that carry no tag in <c>cat</c>. It only binds where the
        /// category is in use — a component with no <c>cat</c> tag on any
        /// variant is left untouched, so <c>animation</c> turns on a style's
        /// opt-in animation without erasing the components that know nothing
        /// about it.
        /// </para>
        /// <para>
        /// A negative <c>!cat</c> or <c>!cat:value</c> token disallows,
        /// dropping every variant carrying any tag in <c>cat</c> (bare) or the
        /// exact <c>cat:value</c> tag. Disallows are checked alongside allows
        /// but always win.
        /// </para>
        /// <para>
        /// Returns the surviving variant names in definition order.
        /// </para>
        /// </remarks>
        private IReadOnlyList<string> TagFilteredNames(OrderedMap<ComponentVariant> variants)
        {
            var filter = BuildTagFilter();

            // A bare token only binds where its category is in use, so this
            // narrowing — unlike the classification above — is genuinely
            // per-component.
            var required = new List<string>();

            foreach (var category in filter.Bares)
            {
                if (filter.BareDisallows.Contains(category))
                {
                    continue;
                }

                foreach (var variant in variants.Values)
                {
                    if (variant.HasTag(category))
                    {
                        required.Add(category);
                        break;
                    }
                }
            }

            var names = new List<string>();

            foreach (var entry in variants)
            {
                var variant = entry.Value;
                var allowed =
                    filter.AllowGroups.All(group =>
                        !variant.HasTag(group.Key)
                        || group.Value.Any(value => variant.HasTag(group.Key, value)))
                    && required.All(category => variant.HasTag(category));
                var disallowed = filter.Disallows.Any(token => variant.HasTag(token.Category, token.Value));

                if (allowed && !disallowed)
                {
                    names.Add(entry.Key);
                }
            }

            return names;
        }

        /// <summary>
        /// Resolves a named color to its final stop list, applying contrast
        /// sorting and <c>notEqualTo</c> filtering from the style definition.
        /// Detects circular references between colors and throws
        /// <see cref="CircularColorReferenceException"/>.
        /// </summary>
        /// <remarks>
        /// A user-set <c>{name}ColorOrder: "fixed"</c> pins user-supplied
        /// colors to their verbatim order: the shuffle and the contrast sort
        /// are skipped (<c>notEqualTo</c> filtering still applies), and the
        /// gradient stop count defaults to the number of supplied colors
        /// instead of 2. A style palette carries no order contract, so with
        /// <c>fixed</c> it is still deduplicated, code-point sorted and
        /// contrast sorted; only the shuffle is skipped.
        /// </remarks>
        private IReadOnlyList<string> ResolveColor(string name)
        {
            var userColors = _options.ColorNames(name);
            var hasStyleColor = _style.Colors().TryGetValue(name, out var styleColor);
            var source = userColors ?? (hasStyleColor ? styleColor.Values() : Array.Empty<string>());

            var candidates = source.Select(DiceBear.Internal.Color.ToHex).ToList();
            var isFixed = ColorOrder(name) == ColorOrderFixed;
            var verbatim = userColors is not null && isFixed;
            var fill = ColorFill(name);
            var stops = fill == "solid"
                ? 1
                : ColorFillStops(name, verbatim ? candidates.Count : 2);

            if (!hasStyleColor)
            {
                return Take(Order(name, candidates, isFixed, verbatim), stops);
            }

            // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a)
            if (_colorResolving.Contains(name))
            {
                var chain = new List<string>(_colorResolving) { name };

                throw new CircularColorReferenceException(chain);
            }

            _colorResolving.Add(name);

            var contrastTo = styleColor.ContrastTo();
            var notEqualTo = styleColor.NotEqualTo();

            try
            {
                if (!string.IsNullOrEmpty(contrastTo) && !verbatim)
                {
                    var reference = Color(contrastTo!);

                    if (reference.Count > 0)
                    {
                        candidates = DiceBear.Internal.Color.SortByContrast(candidates, reference[0]).ToList();
                    }
                }

                if (notEqualTo.Count > 0)
                {
                    var excluded = new List<string>();

                    foreach (var reference in notEqualTo)
                    {
                        excluded.AddRange(Color(reference));
                    }

                    candidates = DiceBear.Internal.Color.FilterNotEqualTo(candidates, excluded).ToList();
                }
            }
            finally
            {
                _colorResolving.RemoveAt(_colorResolving.Count - 1);
            }

            // Skip the shuffle when sorted by contrast, to preserve the ordering
            var ordered = !string.IsNullOrEmpty(contrastTo)
                ? candidates
                : Order(name, candidates, isFixed, verbatim);

            return Take(ordered, stops);
        }

        /// <summary>
        /// Applies <c>{name}ColorOrder</c> to the candidate list.
        /// </summary>
        /// <remarks>
        /// <c>random</c> shuffles via the PRNG. <c>fixed</c> skips the shuffle:
        /// user-supplied colors (<paramref name="verbatim"/>) keep exactly the
        /// given order, while a style palette is still deduplicated and sorted
        /// by UTF-16 code units, matching the canonicalization the shuffle
        /// applies before drawing.
        /// </remarks>
        private IReadOnlyList<string> Order(
            string name,
            IReadOnlyList<string> candidates,
            bool isFixed,
            bool verbatim)
        {
            if (!isFixed)
            {
                return _prng.Shuffle(name + "Color", candidates);
            }

            if (verbatim)
            {
                return candidates;
            }

            // Deprecated: DiceBear 11 will take the palette in its definition
            // order here, the same verbatim rule as user-supplied colors, and
            // drop this sort (see CHANGELOG.md, "Deprecated").
            return candidates.Distinct(StringComparer.Ordinal).OrderBy(c => c, StringComparer.Ordinal).ToList();
        }

        private int ColorFillStops(string name, int fallback)
        {
            var range = _options.ColorFillStops(name);

            if (!range.HasValue)
            {
                return fallback;
            }

            var stops = _prng.Integer(name + "ColorFillStops", range.Value);

            // The count only ever feeds Take, which cannot hand back more
            // entries than the palette holds, so clamping to int range says
            // the same thing as the reference's unbounded number.
            return stops > int.MaxValue ? int.MaxValue : stops < 0 ? 0 : (int)stops;
        }

        private static IReadOnlyList<string> Take(IReadOnlyList<string> values, int count) =>
            values.Take(Math.Max(count, 0)).ToList();

        private double MemoFloat(string key, NumberRange? range, double fallback) =>
            Memo(key, () => range.HasValue ? _prng.Float(key, range.Value) : fallback);

        private T Memo<T>(string key, Func<T> compute)
        {
            if (_result.TryGetValue(key, out var existing))
            {
                return (T)existing!;
            }

            var value = compute();

            _result.Set(key, value);

            return value;
        }

        /// <summary>
        /// The four transform values a component's placement is built from.
        /// </summary>
        internal readonly struct ComponentTransform
        {
            internal ComponentTransform(double rotate, double translateX, double translateY, double scale)
            {
                Rotate = rotate;
                TranslateX = translateX;
                TranslateY = translateY;
                Scale = scale;
            }

            internal double Rotate { get; }

            internal double TranslateX { get; }

            internal double TranslateY { get; }

            internal double Scale { get; }
        }

        /// <summary>
        /// The <c>tags</c> filter tokens grouped by role, as the resolver
        /// composes them. <see cref="BareDisallows"/> is the subset of
        /// <see cref="Disallows"/> carrying no value, kept apart so the
        /// per-component narrowing can cancel the matching bare requirements.
        /// </summary>
        private sealed class TagFilter
        {
            internal TagFilter(
                OrderedMap<List<string>> allowGroups,
                IReadOnlyList<string> bares,
                IReadOnlyList<TagFilterToken> disallows,
                HashSet<string> bareDisallows)
            {
                AllowGroups = allowGroups;
                Bares = bares;
                Disallows = disallows;
                BareDisallows = bareDisallows;
            }

            internal OrderedMap<List<string>> AllowGroups { get; }

            internal IReadOnlyList<string> Bares { get; }

            internal IReadOnlyList<TagFilterToken> Disallows { get; }

            internal HashSet<string> BareDisallows { get; }
        }
    }
}
