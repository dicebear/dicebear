using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Walks a style's element tree and turns it into the final SVG markup.
    /// </summary>
    /// <remarks>
    /// The renderer is single-use: it accumulates <c>&lt;defs&gt;</c> entries
    /// and per-render caches across method calls, so a fresh instance is
    /// required per avatar.
    /// </remarks>
    internal sealed class Renderer
    {
        /// <summary>
        /// The reference matches <c>/\bid="([^"]+)"/g</c>, where JavaScript's
        /// <c>\b</c> counts only <c>[A-Za-z0-9_]</c> as a word character.
        /// .NET's <c>\b</c> is Unicode-aware, so it would find no boundary in
        /// something like <c>caféid="x"</c> and skip an id the reference
        /// rewrites. The lookbehind spells the ASCII set out instead.
        /// </summary>
        private static readonly Regex IdPattern =
            new Regex("(?<![A-Za-z0-9_])id=\"([^\"]+)\"", RegexOptions.CultureInvariant);

        private readonly Style _style;
        private readonly Resolver _resolver;

        /// <summary>
        /// The components the renderer is currently inside, innermost last.
        /// The set answers the membership test and the list keeps the order
        /// for the error message.
        /// </summary>
        /// <summary>
        /// The canonical track order, outermost wrapper to innermost. It
        /// mirrors the usual translate → rotate → scale transform composition;
        /// every port must wrap in this exact order for the outputs to stay
        /// byte-identical.
        /// </summary>
        private static readonly string[] TrackOrder =
        {
            "translateX",
            "translateY",
            "rotate",
            "scaleX",
            "scaleY",
            "opacity",
        };

        private readonly HashSet<string> _componentPath = new HashSet<string>(StringComparer.Ordinal);
        private readonly List<string> _componentChain = new List<string>();
        private readonly OrderedMap<string> _defs = new OrderedMap<string>();
        private readonly List<string> _keyframesCss = new List<string>();
        private readonly List<string> _animationCss = new List<string>();
        private readonly Dictionary<string, string> _keyframesByContent =
            new Dictionary<string, string>(StringComparer.Ordinal);

        private string? _cachedSeedHash;
        private string? _cachedInitials;
        private string? _cachedAnimationHash;
        private int _keyframesCounter;
        private int _animationClassCounter;

        internal Renderer(Style style, Resolver resolver)
        {
            _style = style;
            _resolver = resolver;
        }

        /// <summary>
        /// Builds the complete SVG document for the avatar.
        /// </summary>
        internal string Render()
        {
            var canvas = _style.CanvasBlock();
            var background = RenderBackground(canvas);
            var body = RenderElements(canvas.Elements());

            // Order matters: scale and flip around center, then rotate,
            // translate, and finally clip with border radius (outermost
            // wrapper).
            body = ApplyScale(body, canvas);
            body = ApplyFlip(body, canvas);
            body = ApplyRotate(body, canvas);
            body = ApplyTranslate(body, canvas);
            body = ApplyBorderRadius(background + body, canvas);

            RegisterAnimationStyle();

            var metadata = License.Xml(_style.MetaBlock());
            var defs = _defs.Count > 0
                ? "<defs>" + string.Concat(_defs.Values) + "</defs>"
                : string.Empty;
            var size = _resolver.Size();

            var title = _resolver.Title();
            var escapedTitle = title is null ? null : Xml.Escape(title);

            var attrs = new List<string>
            {
                "xmlns=\"http://www.w3.org/2000/svg\"",
                $"viewBox=\"0 0 {Num.Format(canvas.Width())} {Num.Format(canvas.Height())}\"",
            };

            var rootAttributes = RenderAttributes(_style.Attributes());

            if (rootAttributes.Length > 0)
            {
                attrs.Add(rootAttributes.TrimStart());
            }

            if (escapedTitle is not null)
            {
                attrs.Add("role=\"img\"");
                attrs.Add($"aria-label=\"{escapedTitle}\"");
            }
            else
            {
                attrs.Add("aria-hidden=\"true\"");
            }

            if (size.HasValue)
            {
                var sizeValue = Num.Format(size.Value);

                attrs.Add($"width=\"{sizeValue}\"");
                attrs.Add($"height=\"{sizeValue}\"");
            }

            var titleElement = escapedTitle is null ? string.Empty : $"<title>{escapedTitle}</title>";

            var svg = "<svg " + string.Join(" ", attrs) + ">"
                + "<!-- Generated by DiceBear (https://www.dicebear.com) -->"
                + metadata + defs + titleElement + body + "</svg>";

            if (_resolver.IdRandomization())
            {
                svg = RandomizeIds(svg);
            }

            return svg;
        }

        /// <summary>
        /// Wraps the body in a flip transform when <c>flip</c> is set to
        /// anything other than <c>none</c>.
        /// </summary>
        private string ApplyFlip(string body, Canvas canvas)
        {
            var flip = _resolver.Flip();

            if (flip == "none")
            {
                return body;
            }

            var w = Num.Format(canvas.Width());
            var h = Num.Format(canvas.Height());
            string transform;

            switch (flip)
            {
                case "horizontal":
                    transform = $"translate({w}, 0) scale(-1, 1)";
                    break;
                case "vertical":
                    transform = $"translate(0, {h}) scale(1, -1)";
                    break;
                case "both":
                    transform = $"translate({w}, {h}) scale(-1, -1)";
                    break;
                default:
                    return body;
            }

            return $"<g transform=\"{transform}\">{body}</g>";
        }

        /// <summary>
        /// Wraps the body in a uniform scale transform around the canvas center
        /// when the option differs from <c>1</c>.
        /// </summary>
        private string ApplyScale(string body, Canvas canvas)
        {
            var scale = _resolver.Scale();

            if (scale == 1.0)
            {
                return body;
            }

            var cx = canvas.Width() / 2.0;
            var cy = canvas.Height() / 2.0;

            return "<g transform=\""
                + $"translate({Num.Format(cx)}, {Num.Format(cy)}) "
                + $"scale({Num.Format(scale)}) "
                + $"translate({Num.Format(-cx)}, {Num.Format(-cy)})"
                + $"\">{body}</g>";
        }

        /// <summary>
        /// Clips the body to the canvas rectangle (rounded when
        /// <c>borderRadius</c> is non-zero) and registers the corresponding
        /// <c>clipPath</c> in <c>&lt;defs&gt;</c>.
        /// </summary>
        /// <remarks>
        /// The clip is always applied so transformed content cannot bleed past
        /// the canvas bounds, regardless of the consumer's <c>overflow</c>
        /// setting.
        /// </remarks>
        private string ApplyBorderRadius(string body, Canvas canvas)
        {
            var radius = _resolver.BorderRadius();
            var id = "clip-" + HashSeed();

            var rx = Num.Format(radius / 100.0 * canvas.Width());
            var ry = Num.Format(radius / 100.0 * canvas.Height());

            _defs.Set(
                id,
                $"<clipPath id=\"{id}\">"
                + $"<rect width=\"{Num.Format(canvas.Width())}\" height=\"{Num.Format(canvas.Height())}\""
                + $" rx=\"{rx}\" ry=\"{ry}\"/></clipPath>");

            return $"<g clip-path=\"url(#{id})\">{body}</g>";
        }

        /// <summary>
        /// Wraps the body in a rotation around the canvas center when
        /// <c>rotate</c> is non-zero.
        /// </summary>
        private string ApplyRotate(string body, Canvas canvas)
        {
            var rotate = _resolver.Rotate();

            if (rotate == 0.0)
            {
                return body;
            }

            var cx = canvas.Width() / 2.0;
            var cy = canvas.Height() / 2.0;

            return $"<g transform=\"rotate({Num.Format(rotate)}, {Num.Format(cx)}, {Num.Format(cy)})\">{body}</g>";
        }

        /// <summary>
        /// Wraps the body in a translate transform when either
        /// <c>translateX</c> or <c>translateY</c> is non-zero. Offsets are
        /// interpreted as percentages of the canvas dimensions.
        /// </summary>
        private string ApplyTranslate(string body, Canvas canvas)
        {
            var tx = _resolver.TranslateX();
            var ty = _resolver.TranslateY();

            if (tx == 0.0 && ty == 0.0)
            {
                return body;
            }

            var x = Num.Format(tx / 100.0 * canvas.Width());
            var y = Num.Format(ty / 100.0 * canvas.Height());

            return $"<g transform=\"translate({x}, {y})\">{body}</g>";
        }

        /// <summary>
        /// Returns a <c>&lt;rect&gt;</c> filling the canvas with the resolved
        /// background color, or an empty string when no background colors are
        /// configured.
        /// </summary>
        private string RenderBackground(Canvas canvas)
        {
            var colors = _resolver.Color("background");

            if (colors.Count == 0)
            {
                return string.Empty;
            }

            return $"<rect width=\"{Num.Format(canvas.Width())}\" height=\"{Num.Format(canvas.Height())}\""
                + $" fill=\"{Xml.Escape(ResolveColorReference("background"))}\"/>";
        }

        /// <summary>
        /// Suffixes every <c>id</c> declaration and reference with a random hex
        /// string so that multiple instances of the same avatar do not collide
        /// in a shared document.
        /// </summary>
        /// <remarks>
        /// Uses a general-purpose random source intentionally — a PRNG-derived
        /// suffix would produce the same ID for the same seed.
        /// </remarks>
        private static string RandomizeIds(string svg)
        {
            var suffix = NextRandom(0xffffff).ToString("x", CultureInfo.InvariantCulture).PadLeft(6, '0');
            var ids = new List<string>();
            var seen = new HashSet<string>(StringComparer.Ordinal);

            foreach (Match match in IdPattern.Matches(svg))
            {
                var id = match.Groups[1].Value;

                if (seen.Add(id))
                {
                    ids.Add(id);
                }
            }

            if (ids.Count == 0)
            {
                return svg;
            }

            var escaped = ids.Select(EscapeForPattern);
            var pattern = new Regex(
                "(id=\"|url\\(#|href=\"#)(" + string.Join("|", escaped) + ")(\"|\\))",
                RegexOptions.CultureInvariant);

            return pattern.Replace(
                svg,
                match => match.Groups[1].Value + match.Groups[2].Value + "-" + suffix + match.Groups[3].Value);
        }

        /// <summary>
        /// Escapes the regular expression metacharacters the reference escapes.
        /// </summary>
        /// <remarks>
        /// <c>Regex.Escape</c> covers a wider set (whitespace and <c>#</c>
        /// among others), which would change what the pattern matches for IDs
        /// containing those characters.
        /// </remarks>
        private static string EscapeForPattern(string id)
        {
            const string Metacharacters = ".*+?^${}()|[]\\";
            var builder = new StringBuilder(id.Length);

            foreach (var ch in id)
            {
                if (Metacharacters.IndexOf(ch) >= 0)
                {
                    builder.Append('\\');
                }

                builder.Append(ch);
            }

            return builder.ToString();
        }

#if NET8_0_OR_GREATER
        private static int NextRandom(int max) => Random.Shared.Next(max);
#else
        private static readonly Random Fallback = new Random();

        private static int NextRandom(int max)
        {
            lock (Fallback)
            {
                return Fallback.Next(max);
            }
        }
#endif

        /// <summary>
        /// Renders a list of elements and concatenates their markup.
        /// </summary>
        private string RenderElements(IReadOnlyList<Element> elements) =>
            string.Concat(elements.Select(RenderElement));

        /// <summary>
        /// Dispatches a single element to the renderer for its type.
        /// </summary>
        private string RenderElement(Element element)
        {
            switch (element.Type())
            {
                case "element":
                    return RenderSvgElement(element);
                case "text":
                    return RenderTextElement(element);
                case "component":
                    return RenderComponentElement(element);
                default:
                    return string.Empty;
            }
        }

        /// <summary>
        /// Renders an SVG element. The special <c>defs</c> name diverts
        /// children into the shared <c>&lt;defs&gt;</c> block.
        /// </summary>
        /// <remarks>
        /// Element names and attribute names are not escaped here — they are
        /// validated by the style validator against a strict allowlist schema
        /// (no <c>script</c>, no event handlers). Values are escaped via
        /// <see cref="Xml.Escape"/>.
        /// </remarks>
        private string RenderSvgElement(Element element)
        {
            var name = element.Name();

            if (string.IsNullOrEmpty(name))
            {
                return string.Empty;
            }

            if (name == "defs")
            {
                foreach (var child in element.Children())
                {
                    var rendered = RenderElement(child);

                    if (rendered.Length > 0)
                    {
                        var id = JsonRead.Str(child.Attributes(), "id");
                        var key = id ?? "_" + _defs.Count;

                        _defs.Set(key, rendered);
                    }
                }

                return string.Empty;
            }

            var attrs = RenderAttributes(element.Attributes());
            var children = RenderElements(element.Children());

            if (children.Length == 0)
            {
                // A wrapper whose children all rendered to nothing, because an
                // optional component came up empty, has no content left to
                // group. It draws nothing either way, but a masked group
                // without content has an empty bounding box, and strict SVG
                // parsers reject the whole document over it. Wrappers that
                // carry an id stay, so references keep resolving.
                if (element.Children().Count > 0 && element.Attributes()?["id"] is null)
                {
                    return string.Empty;
                }

                return ApplyAnimations($"<{name}{attrs}/>", element);
            }

            return ApplyAnimations($"<{name}{attrs}>{children}</{name}>", element);
        }

        /// <summary>
        /// Renders a text element by escaping its resolved value.
        /// </summary>
        private string RenderTextElement(Element element)
        {
            var value = element.Value();

            return value is null ? string.Empty : Xml.Escape(ResolveValue(value));
        }

        /// <summary>
        /// Resolves a component reference to a chosen variant and emits a
        /// <c>&lt;use&gt;</c> pointing at a <c>&lt;defs&gt;</c> entry that holds
        /// the variant body.
        /// </summary>
        /// <remarks>
        /// Aliases of the same source component sharing a variant — and
        /// identical components referenced more than once — therefore produce a
        /// single <c>&lt;defs&gt;</c> entry referenced by every
        /// <c>&lt;use&gt;</c>, never duplicated SVG markup. Any
        /// <c>attributes</c> on the component reference are written to the
        /// emitted <c>&lt;use&gt;</c> tag. A user-supplied <c>transform</c> is
        /// prepended to the per-component transforms so it acts as the outer
        /// (placement) transform, with the style's translate, rotate and scale
        /// applied inside it.
        /// </remarks>
        private string RenderComponentElement(Element element)
        {
            var componentName = element.Name();

            if (componentName is null)
            {
                return string.Empty;
            }

            var variantName = _resolver.Variant(componentName);

            if (string.IsNullOrEmpty(variantName))
            {
                return string.Empty;
            }

            if (!_style.Components().TryGetValue(componentName, out var component))
            {
                return string.Empty;
            }

            if (!component.Variants().TryGetValue(variantName!, out var variant))
            {
                return string.Empty;
            }

            var id = $"{component.SourceName()}-{variantName}-{HashSeed()}";

            if (!_defs.ContainsKey(id))
            {
                if (!_componentPath.Add(componentName))
                {
                    _componentChain.Add(componentName);

                    throw new CircularComponentReferenceException(_componentChain.ToArray());
                }

                _componentChain.Add(componentName);

                // The entry only lands in _defs once the body is complete, so
                // a component that reaches itself would recurse forever. The
                // path set breaks the cycle before the stack runs out.
                var body = RenderElements(variant.Elements());

                _componentChain.RemoveAt(_componentChain.Count - 1);
                _componentPath.Remove(componentName);

                _defs.Set(id, $"<g id=\"{id}\">{body}</g>");
            }

            var transforms = BuildTransforms(component);
            var userAttributes = element.Attributes();
            IEnumerable<KeyValuePair<string, JsonNode?>>? mergedAttributes = userAttributes;

            if (transforms.Count > 0)
            {
                var merged = new OrderedMap<JsonNode?>();

                if (userAttributes is not null)
                {
                    foreach (var entry in userAttributes)
                    {
                        merged.Set(entry.Key, entry.Value);
                    }
                }

                var userTransform = JsonRead.Str(userAttributes, "transform");
                var transform = string.Join(" ", transforms);

                if (!string.IsNullOrEmpty(userTransform))
                {
                    transform = userTransform + " " + transform;
                }

                merged.Set("transform", JsonValue.Create(transform));
                mergedAttributes = merged;
            }

            return ApplyAnimations($"<use{RenderAttributes(mergedAttributes)} href=\"#{id}\"/>", element);
        }

        /// <summary>
        /// Returns the per-component SVG <c>transform</c> fragments derived
        /// from the component's translate, rotate and scale options.
        /// </summary>
        /// <remarks>
        /// Translate values are percentages of the component canvas dimensions,
        /// matching the semantics of the user-facing <c>translateX</c> and
        /// <c>translateY</c> options. The fragments are ordered so that, when
        /// joined into a single <c>transform</c> attribute, the scale is the
        /// rightmost (innermost) transform — applied first to a point, followed
        /// by rotate, then translate.
        /// </remarks>
        private List<string> BuildTransforms(Component component)
        {
            var transform = _resolver.Transform(component.Name());
            var transforms = new List<string>();

            if (transform.TranslateX == 0.0
                && transform.TranslateY == 0.0
                && transform.Rotate == 0.0
                && transform.Scale == 1.0)
            {
                return transforms;
            }

            var cx = component.Width() / 2.0;
            var cy = component.Height() / 2.0;
            var cxValue = Num.Format(cx);
            var cyValue = Num.Format(cy);

            if (transform.TranslateX != 0.0 || transform.TranslateY != 0.0)
            {
                var x = Num.Format(transform.TranslateX / 100.0 * component.Width());
                var y = Num.Format(transform.TranslateY / 100.0 * component.Height());

                transforms.Add($"translate({x}, {y})");
            }

            if (transform.Rotate != 0.0)
            {
                transforms.Add($"rotate({Num.Format(transform.Rotate)}, {cxValue}, {cyValue})");
            }

            if (transform.Scale != 1.0)
            {
                transforms.Add(
                    $"translate({cxValue}, {cyValue}) scale({Num.Format(transform.Scale)})"
                    + $" translate({Num.Format(-cx)}, {Num.Format(-cy)})");
            }

            return transforms;
        }

        /// <summary>
        /// Serializes an attribute map to a leading space-prefixed string
        /// suitable for inlining into a tag. Returns an empty string when there
        /// are no attributes to render.
        /// </summary>
        private string RenderAttributes(IEnumerable<KeyValuePair<string, JsonNode?>>? attributes)
        {
            if (attributes is null)
            {
                return string.Empty;
            }

            var parts = new List<string>();

            foreach (var entry in attributes)
            {
                if (entry.Value is null)
                {
                    continue;
                }

                parts.Add($"{entry.Key}=\"{Xml.Escape(ResolveAttributeValue(entry.Value))}\"");
            }

            if (parts.Count == 0)
            {
                return string.Empty;
            }

            return " " + string.Join(" ", parts);
        }

        /// <summary>
        /// Resolves a single attribute value: literal strings pass through,
        /// color and variable references are dereferenced through the option
        /// resolver.
        /// </summary>
        private string ResolveAttributeValue(JsonNode value)
        {
            var literal = JsonRead.Str(value);

            if (literal is not null)
            {
                return literal;
            }

            var name = JsonRead.Str(value, "name") ?? string.Empty;

            return JsonRead.Str(value, "type") == "color"
                ? ResolveColorReference(name)
                : ResolveVariable(name);
        }

        /// <summary>
        /// Resolves a named color into either a hex string (solid fill or a
        /// single color) or a <c>url(#…)</c> gradient reference, registering the
        /// gradient in <c>&lt;defs&gt;</c> as a side effect.
        /// </summary>
        private string ResolveColorReference(string name)
        {
            var colors = _resolver.Color(name);
            var fill = _resolver.ColorFill(name);

            if (fill == "solid" || colors.Count <= 1)
            {
                return colors.Count > 0 ? colors[0] : "none";
            }

            return BuildGradientDef(name, colors, fill);
        }

        /// <summary>
        /// Builds the <c>linearGradient</c> or <c>radialGradient</c> for the
        /// given color definition, registers it in <c>&lt;defs&gt;</c>, and
        /// returns its <c>url(#…)</c> reference.
        /// </summary>
        private string BuildGradientDef(string name, IReadOnlyList<string> colors, string fill)
        {
            var rotation = _resolver.ColorAngle(name);
            var id = $"{name}-color-{HashSeed()}";
            var tag = fill == "linear" ? "linearGradient" : "radialGradient";
            var rotateAttr = rotation != 0.0
                ? $" gradientTransform=\"rotate({Num.Format(rotation)}, 0.5, 0.5)\""
                : string.Empty;
            var stops = new StringBuilder();

            for (var i = 0; i < colors.Count; i++)
            {
                var offset = Num.Format((double)i / (colors.Count - 1) * 100.0);

                stops.Append($"<stop offset=\"{offset}%\" stop-color=\"{Xml.Escape(colors[i])}\"/>");
            }

            _defs.Set(id, $"<{tag} id=\"{id}\"{rotateAttr}>{stops}</{tag}>");

            return $"url(#{id})";
        }

        /// <summary>
        /// Resolves an element value to its final string form. Literal strings
        /// pass through; variable references are dereferenced.
        /// </summary>
        private string ResolveValue(JsonNode value)
        {
            var literal = JsonRead.Str(value);

            if (literal is not null)
            {
                return literal;
            }

            if (JsonRead.Str(value, "type") == "variable")
            {
                return ResolveVariable(JsonRead.Str(value, "name") ?? string.Empty);
            }

            return string.Empty;
        }

        /// <summary>
        /// Resolves a built-in variable reference to its current value.
        /// </summary>
        private string ResolveVariable(string name)
        {
            switch (name)
            {
                case "initial":
                    {
                        // Taking the first char would return a lone surrogate
                        // (ill-formed XML) for supplementary-plane initials;
                        // take the full first code point instead, like the
                        // other ports.
                        var initials = InitialsValue();

                        if (initials.Length == 0)
                        {
                            return string.Empty;
                        }

                        return char.ConvertFromUtf32(
                            char.IsSurrogatePair(initials, 0)
                                ? char.ConvertToUtf32(initials, 0)
                                : initials[0]);
                    }

                case "initials":
                    return InitialsValue();
                case "fontWeight":
                    return Num.Format(_resolver.FontWeight());
                case "fontFamily":
                    return _resolver.FontFamily();
                default:
                    return string.Empty;
            }
        }

        /// <summary>
        /// Wraps an element's rendered markup in one <c>&lt;g class="…"&gt;</c>
        /// per animation track and queues the matching CSS. A no-op when the
        /// <c>animation</c> option is off, the element carries no animations,
        /// or its markup rendered to nothing (the empty-wrapper pruning then
        /// also prunes the animation).
        /// </summary>
        /// <remarks>
        /// Wrapper nesting is block 0 outermost, and within a block the
        /// canonical track order (translate before rotate before scale,
        /// opacity innermost) — the composition contract the Figma plugin maps
        /// onto node transforms.
        /// </remarks>
        private string ApplyAnimations(string markup, Element element)
        {
            if (markup.Length == 0)
            {
                return markup;
            }

            var animations = element.Animations();

            // The element check comes first: only styles that carry
            // declarative animations may touch the `animation` option, so the
            // resolved-options snapshot of every other avatar stays free of it.
            if (animations is null || animations.Count == 0)
            {
                return markup;
            }

            var selection = _resolver.Animation();

            if (selection.Off)
            {
                return markup;
            }

            var classes = new List<string>();

            foreach (var node in animations)
            {
                if (node is not JsonObject animation
                    || JsonRead.Obj(animation, "tracks") is not JsonObject tracks)
                {
                    continue;
                }

                // `true` plays every timeline. A name selection plays only
                // the timelines carrying one of those names, so unnamed
                // timelines stay static then.
                if (!selection.Matches(JsonRead.Str(animation, "name")))
                {
                    continue;
                }

                foreach (var track in TrackOrder)
                {
                    if (tracks[track] is JsonObject trackData
                        && trackData["keyframes"] is JsonArray keyframes)
                    {
                        classes.Add(BuildAnimationCss(animation, track, keyframes));
                    }
                }
            }

            var result = markup;

            for (var i = classes.Count - 1; i >= 0; i--)
            {
                result = $"<g class=\"{classes[i]}\">{result}</g>";
            }

            return result;
        }

        /// <summary>
        /// Generates the <c>@keyframes</c> block (deduplicated by content, so
        /// identical tracks on many elements share one block) and the class
        /// rule for a single track, and returns the class name.
        /// </summary>
        private string BuildAnimationCss(JsonObject animation, string track, JsonArray keyframes)
        {
            var defaultEasing = animation["easing"];
            var body = KeyframesBody(track, keyframes, defaultEasing);

            if (!_keyframesByContent.TryGetValue(body, out var keyframesName))
            {
                keyframesName = $"dbk-{AnimationHash()}-{_keyframesCounter++}";

                _keyframesByContent[body] = keyframesName;
                _keyframesCss.Add($"@keyframes {keyframesName}{{{body}}}");
            }

            var speed = _resolver.AnimationSpeed();
            var duration = Num.Format((JsonRead.Num(animation, "duration") ?? 0.0) / speed);
            var delay = Num.Format((JsonRead.Num(animation, "delay") ?? 0.0) / speed);
            var iterationsNum = JsonRead.Num(animation, "iterations");
            var iterations = iterationsNum.HasValue ? Num.Format(iterationsNum.Value) : "infinite";
            var direction = DirectionCss(JsonRead.Str(animation, "direction"));
            var fill = JsonRead.Str(animation, "fill") ?? "none";

            // Only rotate and scale pivot around a point; translation and
            // opacity need no origin, so their rules skip the transform-box
            // prefix.
            var needsOrigin = track == "rotate" || track == "scaleX" || track == "scaleY";
            var originCss = string.Empty;

            if (needsOrigin)
            {
                var origin = JsonRead.Obj(animation, "origin");
                var x = origin is null ? 50.0 : JsonRead.Num(origin, "x") ?? 50.0;
                var y = origin is null ? 50.0 : JsonRead.Num(origin, "y") ?? 50.0;

                originCss = $"transform-box:fill-box;transform-origin:{Num.Format(x)}% {Num.Format(y)}%;";
            }

            var className = $"dba-{AnimationHash()}-{_animationClassCounter++}";

            // The name comes last in the shorthand so it can never be mistaken
            // for a keyword; all seven tokens are always emitted so every port
            // serializes the same string.
            _animationCss.Add(
                $".{className}{{{originCss}animation:{duration}s {EasingCss(defaultEasing)} {delay}s"
                + $" {iterations} {direction} {fill} {keyframesName}}}");

            return className;
        }

        /// <summary>
        /// Serializes a track's keyframes to a <c>@keyframes</c> body.
        /// Endpoints are padded with copies of the nearest keyframe so the
        /// resting value holds outside the keyframed span, matching Figma's
        /// hold semantics. A keyframe's easing shapes the segment to the next
        /// keyframe and is emitted only when it differs from the block default
        /// (the rule's timing function covers the rest); the last keyframe has
        /// no following segment, so its easing is never emitted.
        /// </summary>
        private string KeyframesBody(string track, JsonArray keyframes, JsonNode? defaultEasing)
        {
            var list = new List<(double At, double Value, JsonNode? Easing)>();

            foreach (var node in keyframes)
            {
                if (node is JsonObject keyframe)
                {
                    list.Add((
                        JsonRead.Num(keyframe, "at") ?? 0.0,
                        JsonRead.Num(keyframe, "value") ?? 0.0,
                        keyframe["easing"]));
                }
            }

            if (list.Count == 0)
            {
                return string.Empty;
            }

            if (list[0].At > 0)
            {
                list.Insert(0, (0.0, list[0].Value, null));
            }

            var last = list[list.Count - 1];

            if (last.At < 100)
            {
                list.Add((100.0, last.Value, null));
            }

            var defaultCss = EasingCss(defaultEasing);
            var body = new StringBuilder();

            for (var i = 0; i < list.Count; i++)
            {
                var (at, value, easing) = list[i];
                var easingCss = easing is not null && i < list.Count - 1
                    ? EasingCss(easing)
                    : defaultCss;
                var timing = easingCss != defaultCss
                    ? ";animation-timing-function:" + easingCss
                    : string.Empty;

                body.Append(Num.Format(at)).Append("%{")
                    .Append(TrackDeclaration(track, value)).Append(timing).Append('}');
            }

            return body.ToString();
        }

        /// <summary>
        /// Returns the CSS declaration animating one track at one keyframe
        /// value.
        /// </summary>
        private static string TrackDeclaration(string track, double value)
        {
            var v = Num.Format(value);

            switch (track)
            {
                case "translateX":
                    return $"transform:translateX({v}px)";
                case "translateY":
                    return $"transform:translateY({v}px)";
                case "rotate":
                    return $"transform:rotate({v}deg)";
                case "scaleX":
                    return $"transform:scaleX({v})";
                case "scaleY":
                    return $"transform:scaleY({v})";
                default:
                    return $"opacity:{v}";
            }
        }

        /// <summary>
        /// Serializes an easing to its CSS form. <c>hold</c> renders as
        /// <c>step-end</c>; <see langword="null"/> is the <c>linear</c>
        /// default.
        /// </summary>
        private static string EasingCss(JsonNode? easing)
        {
            var keyword = easing is null ? null : JsonRead.Str(easing);

            if (keyword is not null)
            {
                switch (keyword)
                {
                    case "ease":
                        return "ease";
                    case "easeIn":
                        return "ease-in";
                    case "easeOut":
                        return "ease-out";
                    case "easeInOut":
                        return "ease-in-out";
                    case "hold":
                        return "step-end";
                    default:
                        return "linear";
                }
            }

            if (easing is JsonObject bezier)
            {
                return "cubic-bezier("
                    + Num.Format(JsonRead.Num(bezier, "x1") ?? 0.0) + ", "
                    + Num.Format(JsonRead.Num(bezier, "y1") ?? 0.0) + ", "
                    + Num.Format(JsonRead.Num(bezier, "x2") ?? 0.0) + ", "
                    + Num.Format(JsonRead.Num(bezier, "y2") ?? 0.0) + ")";
            }

            return "linear";
        }

        private static string DirectionCss(string? direction)
        {
            switch (direction)
            {
                case "reverse":
                    return "reverse";
                case "alternate":
                    return "alternate";
                case "alternateReverse":
                    return "alternate-reverse";
                default:
                    return "normal";
            }
        }

        /// <summary>
        /// Registers the accumulated animation CSS as a single
        /// <c>&lt;style&gt;</c> entry in the shared <c>&lt;defs&gt;</c> block,
        /// wrapped in a reduced-motion media query so users who prefer reduced
        /// motion get the static avatar. A no-op when no animation CSS was
        /// produced.
        /// </summary>
        private void RegisterAnimationStyle()
        {
            if (_keyframesCss.Count == 0)
            {
                return;
            }

            _defs.Set(
                "animation-style",
                "<style>@media (prefers-reduced-motion:no-preference){"
                + string.Concat(_keyframesCss) + string.Concat(_animationCss) + "}</style>");
        }

        /// <summary>
        /// Returns the FNV-1a hex hash namespacing the animation class and
        /// keyframe names, cached after the first call.
        /// </summary>
        /// <remarks>
        /// Extends the <see cref="HashSeed"/> input with the animation speed
        /// and, for a by-name selection, the sorted names: two renders of the
        /// same avatar with different speeds or selections inlined on one page
        /// must not select each other's rules, while identical renders sharing
        /// identical rules is harmless deduplication. <c>true</c> adds no name
        /// suffix, so enabling all animations hashes as before.
        /// </remarks>
        private string AnimationHash()
        {
            var names = _resolver.Animation().Names;
            var suffix = names is null
                ? string.Empty
                : ":" + string.Join(
                    ",",
                    names.Distinct().OrderBy(name => name, StringComparer.Ordinal));

            return _cachedAnimationHash ??= Fnv1a.Hex(
                (_style.MetaBlock().Source().Name() ?? string.Empty) + ":" + _resolver.Seed()
                + ":" + Num.Format(_resolver.AnimationSpeed()) + suffix);
        }

        /// <summary>
        /// Returns the seed-derived initials, cached after the first call.
        /// </summary>
        private string InitialsValue() => _cachedInitials ??= Initials.FromSeed(_resolver.Seed());

        /// <summary>
        /// Returns the FNV-1a hex hash of the style source name and the seed,
        /// cached after the first call.
        /// </summary>
        /// <remarks>
        /// The value derives stable but unique IDs for <c>&lt;defs&gt;</c>
        /// entries. The style name is part of the hash because styles share
        /// component and variant names (<c>body</c>, <c>animation</c>,
        /// <c>eyes</c>, …): two avatars of different styles with the same seed
        /// would otherwise produce identical IDs and steal each other's
        /// <c>&lt;defs&gt;</c> when inlined on one page.
        /// </remarks>
        private string HashSeed() => _cachedSeedHash ??= Fnv1a.Hex(
            (_style.MetaBlock().Source().Name() ?? string.Empty) + ":" + _resolver.Seed());
    }
}
