using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using DiceBear.Internal;
using Xunit;

namespace DiceBear.Tests;

/// <summary>
/// The public surface of the port: parsing, rendering, serialization and the
/// error contract. The behaviors mirror the other ports' suites, so a change in
/// one port is visible as a gap in the others.
/// </summary>
public class ApiTests
{
    private const string MinimalStyle = """{"canvas":{"width":100,"height":100,"elements":[]}}""";

    [Fact]
    public void ParsesJsonTextLikeTheNodeConstructor()
    {
        var fromText = Style.Parse(MinimalStyle);
        var fromNode = new Style(JsonNode.Parse(MinimalStyle));

        Assert.Equal(
            new Avatar(fromNode, Options(("seed", "x"))).ToSvg(),
            new Avatar(fromText, Options(("seed", "x"))).ToSvg());
    }

    [Fact]
    public void RejectsMalformedJson() =>
        Assert.Throws<StyleValidationException>(() => Style.Parse("{ not json"));

    [Fact]
    public void RejectsASchemaInvalidDefinition() =>
        Assert.Throws<StyleValidationException>(() => Style.Parse("""{"components":{}}"""));

    [Fact]
    public void RejectsADefinitionThatIsNotAnObject() =>
        Assert.Throws<StyleValidationException>(() => Style.Parse("[]"));

    [Fact]
    public void RejectsAnAliasPointingAtAnUnknownComponent()
    {
        var exception = Assert.Throws<StyleValidationException>(() => Style.Parse("""
            {
              "canvas": { "width": 100, "height": 100, "elements": [] },
              "components": { "mirror": { "extends": "missing" } }
            }
            """));

        Assert.Contains("missing", exception.Message, StringComparison.Ordinal);
    }

    [Fact]
    public void RejectsAnAliasChain() =>
        Assert.Throws<StyleValidationException>(() => Style.Parse("""
            {
              "canvas": { "width": 100, "height": 100, "elements": [] },
              "components": {
                "shape": { "width": 100, "height": 100, "variants": { "a": { "elements": [] } } },
                "first": { "extends": "shape" },
                "second": { "extends": "first" }
              }
            }
            """));

    [Fact]
    public void ToJsonExposesSvgAndResolvedOptions()
    {
        var avatar = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x")));
        var envelope = JsonNode.Parse(avatar.ToJson())!.AsObject();

        Assert.Equal(avatar.ToSvg(), envelope["svg"]!.GetValue<string>());
        Assert.Equal("none", envelope["options"]!["flip"]!.GetValue<string>());

        // The resolved options carry the picked values but never the raw seed.
        Assert.False(envelope["options"]!.AsObject().ContainsKey("seed"));
    }

    [Fact]
    public void ToJsonSerializesWholeNumberOptionsAsIntegers()
    {
        var avatar = new Avatar(
            Style.Parse(MinimalStyle),
            Options(("seed", "x"), ("size", 128), ("scale", 2)));

        Assert.Contains("\"size\":128", avatar.ToJson(), StringComparison.Ordinal);
        Assert.Contains("\"scale\":2", avatar.ToJson(), StringComparison.Ordinal);
    }

    [Fact]
    public void ToJsonEmitsOptionsInResolutionOrder()
    {
        var avatar = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x")));
        var options = JsonNode.Parse(avatar.ToJson())!["options"]!.AsObject();
        var keys = options.Select(entry => entry.Key).ToList();

        // The renderer resolves the background before anything else, and the
        // fill before the color list it belongs to.
        Assert.Equal("backgroundColorFill", keys[0]);
        Assert.Equal("backgroundColor", keys[1]);
    }

    [Fact]
    public void ToJsonDoesNotHtmlEscapeTheSvg()
    {
        // The reference emits the literal "<svg …>" in the JSON envelope; the
        // default .NET encoder would escape <, > and & to < and friends.
        var avatar = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x")));

        Assert.Contains("<svg ", avatar.ToJson(), StringComparison.Ordinal);
        Assert.DoesNotContain("\\u003C", avatar.ToJson(), StringComparison.Ordinal);
    }

    [Fact]
    public void ResolvedOptionsAreIsolatedCopies()
    {
        var avatar = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x")));
        var first = avatar.ResolvedOptions();

        first["flip"] = "horizontal";

        Assert.Equal("none", avatar.ResolvedOptions()["flip"]!.GetValue<string>());
    }

    [Fact]
    public void DescribesComponentsAndColors()
    {
        var style = Style.Parse("""
            {
              "canvas": { "width": 100, "height": 100, "elements": [] },
              "components": {
                "shape": {
                  "width": 100,
                  "height": 100,
                  "variants": { "b": { "elements": [] }, "a": { "elements": [] } }
                },
                "mirror": { "extends": "shape" }
              },
              "colors": {
                "ink": { "values": ["#000000"], "contrastTo": "paper" },
                "paper": { "values": ["#ffffff"], "notEqualTo": ["ink"] }
              }
            }
            """);

        var descriptor = new OptionsDescriptor(style).ToJson();

        // Variant values are sorted, and an alias contributes no own keys.
        Assert.Equal(
            new[] { "a", "b" },
            descriptor["shapeVariant"]!["values"]!.AsArray().Select(v => v!.GetValue<string>()));
        Assert.False(descriptor.ContainsKey("mirrorVariant"));

        Assert.Equal("paper", descriptor["inkColor"]!["contrastTo"]!.GetValue<string>());
        Assert.Equal(
            new[] { "ink" },
            descriptor["paperColor"]!["notEqualTo"]!.AsArray().Select(v => v!.GetValue<string>()));

        // Every style gets the implicit background color, tags only when used.
        Assert.True(descriptor.ContainsKey("backgroundColor"));
        Assert.False(descriptor.ContainsKey("tags"));
    }

    [Fact]
    public void ReportsACircularColorReference()
    {
        var style = Style.Parse("""
            {
              "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                  { "type": "element", "name": "rect", "attributes": { "fill": { "type": "color", "name": "a" } } }
                ]
              },
              "colors": {
                "a": { "values": ["#000000"], "contrastTo": "b" },
                "b": { "values": ["#ffffff"], "contrastTo": "a" }
              }
            }
            """);

        var exception = Assert.Throws<CircularColorReferenceException>(
            () => new Avatar(style, Options(("seed", "x"))));

        Assert.Equal(new[] { "a", "b", "a" }, exception.Chain);
    }

    [Fact]
    public void ResolvesDeeplyNestedColorsWithoutBlowup()
    {
        // Each color references the next via both contrastTo and notEqualTo,
        // which without memoization fans out to 2^depth color resolutions: a
        // schema-valid hang. With the resolver's memo it is linear.
        const int Depth = 40;

        var colors = new StringBuilder();

        for (var i = 0; i < Depth; i++)
        {
            colors.Append($"\"c{i}\":{{\"values\":[\"#000000\"],\"contrastTo\":\"c{i + 1}\",\"notEqualTo\":[\"c{i + 1}\"]}},");
        }

        colors.Append($"\"c{Depth}\":{{\"values\":[\"#ffffff\"]}}");

        var style = Style.Parse(
            "{\"canvas\":{\"width\":100,\"height\":100,\"elements\":"
            + "[{\"type\":\"element\",\"name\":\"rect\",\"attributes\":{\"fill\":{\"type\":\"color\",\"name\":\"c0\"}}}]},"
            + "\"colors\":{" + colors + "}}");

        Assert.Null(Record.Exception(() => new Avatar(style, Options(("seed", "x")))));
    }

    [Fact]
    public void KeepsTheStopOrderOfAFixedColorOrder()
    {
        var style = Style.Parse("""
            {
              "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                  { "type": "element", "name": "rect", "attributes": { "fill": { "type": "color", "name": "bg" } } }
                ]
              },
              "colors": { "bg": { "values": ["#ff0000", "#0000ff"] } }
            }
            """);

        var options = new JsonObject
        {
            ["seed"] = "test",
            ["bgColor"] = new JsonArray("#0055a4", "#ffffff", "#ef4135"),
            ["bgColorFill"] = "linear",
            ["bgColorOrder"] = "fixed",
        };

        var expected = "<stop offset=\"0%\" stop-color=\"#0055a4\"/>"
            + "<stop offset=\"50%\" stop-color=\"#ffffff\"/>"
            + "<stop offset=\"100%\" stop-color=\"#ef4135\"/>";

        Assert.Contains(expected, new Avatar(style, options).ToSvg(), StringComparison.Ordinal);
    }

    /// <summary>
    /// A style with a plain palette, one filtered against it and one sorted
    /// for contrast against it, so the fixed order has every rule to skip or
    /// keep.
    /// </summary>
    private const string StyleWithColors = """
        {
          "canvas": { "width": 100, "height": 100, "elements": [] },
          "colors": {
            "skin": { "values": ["#f0c8a0", "#d4a574", "#8d5524"] },
            "hair": { "values": ["#2c1b18", "#b55239", "#d6b370"], "notEqualTo": ["skin"] },
            "background": { "values": ["#ffffff", "#000000", "#cccccc"], "contrastTo": "skin" }
          }
        }
        """;

    [Fact]
    public void KeepsAStylePaletteInDefinitionOrderWhenFixed()
    {
        // Without user-supplied colors, fixed uses the palette as the style
        // lists it, for every seed.
        for (var i = 0; i < 5; i++)
        {
            var resolver = new Resolver(
                Style.Parse(StyleWithColors),
                new Options(Options(
                    ("seed", "order-style-" + i),
                    ("skinColorFill", "linear"),
                    ("skinColorFillStops", 3),
                    ("skinColorOrder", "fixed"))));

            Assert.Equal(new[] { "#f0c8a0", "#d4a574", "#8d5524" }, resolver.Color("skin"));
        }
    }

    [Fact]
    public void SkipsContrastSortingForAStylePaletteWhenFixed()
    {
        // background.contrastTo = skin: the contrast sort would put black
        // first against a white skin, the fixed order keeps white first.
        var resolver = new Resolver(
            Style.Parse(StyleWithColors),
            new Options(Options(
                ("seed", "order-style-contrast"),
                ("skinColor", new[] { "#ffffff" }),
                ("backgroundColorOrder", "fixed"))));

        Assert.Equal(new[] { "#ffffff" }, resolver.Color("background"));
    }

    [Fact]
    public void DefaultsTheStopCountToThePaletteSizeWhenFixed()
    {
        var resolver = new Resolver(
            Style.Parse(StyleWithColors),
            new Options(Options(
                ("seed", "order-style-stops"),
                ("skinColorFill", "linear"),
                ("skinColorOrder", "fixed"))));

        Assert.Equal(new[] { "#f0c8a0", "#d4a574", "#8d5524" }, resolver.Color("skin"));
    }

    [Fact]
    public void RendersATitleAsRoleAndAriaLabel()
    {
        var svg = new Avatar(
            Style.Parse(MinimalStyle),
            Options(("seed", "x"), ("title", "Avatar of \"Ada\" & co"))).ToSvg();

        Assert.Contains("role=\"img\"", svg, StringComparison.Ordinal);
        Assert.Contains(
            "aria-label=\"Avatar of &quot;Ada&quot; &amp; co\"",
            svg,
            StringComparison.Ordinal);
        Assert.Contains(
            "<title>Avatar of &quot;Ada&quot; &amp; co</title>",
            svg,
            StringComparison.Ordinal);
    }

    [Fact]
    public void FallsBackToAriaHiddenWithoutATitle()
    {
        var svg = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x"))).ToSvg();

        Assert.Contains("aria-hidden=\"true\"", svg, StringComparison.Ordinal);
        Assert.DoesNotContain("role=\"img\"", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void RandomizesIdsOnlyWhenEnabled()
    {
        var style = Style.Parse(MinimalStyle);
        var plain = new Avatar(style, Options(("seed", "x"))).ToSvg();
        var randomized = new Avatar(
            style,
            Options(("seed", "x"), ("idRandomization", true))).ToSvg();

        Assert.Contains("id=\"clip-", plain, StringComparison.Ordinal);
        Assert.NotEqual(plain, randomized);

        // The suffix comes from process randomness, not the seeded PRNG, so two
        // avatars of the same seed still differ.
        var second = new Avatar(
            style,
            Options(("seed", "x"), ("idRandomization", true))).ToSvg();

        Assert.NotEqual(randomized, second);

        // Both the declaration and the reference are suffixed, so the clip path
        // still resolves.
        var id = randomized.Split("clipPath id=\"")[1].Split('"')[0];

        Assert.Contains($"clip-path=\"url(#{id})\"", randomized, StringComparison.Ordinal);
    }

    [Fact]
    public void EncodesUriComponentsLikeJavaScript()
    {
        // The expected values are exactly what JavaScript's
        // encodeURIComponent returns.
        Assert.Equal("%3Csvg%3E", Num.EncodeUriComponent("<svg>"));
        Assert.Equal("a%20b%26c", Num.EncodeUriComponent("a b&c"));
        Assert.Equal("-_.!~*'()", Num.EncodeUriComponent("-_.!~*'()"));
        Assert.Equal("%C3%A9", Num.EncodeUriComponent("é"));
        Assert.Equal("%22%23%2F", Num.EncodeUriComponent("\"#/"));
    }

    [Fact]
    public void ToDataUriEncodesTheSvg()
    {
        var avatar = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x")));

        Assert.Equal(
            "data:image/svg+xml;charset=utf-8," + Num.EncodeUriComponent(avatar.ToSvg()),
            avatar.ToDataUri());
        Assert.StartsWith(
            "data:image/svg+xml;charset=utf-8,%3Csvg",
            avatar.ToDataUri(),
            StringComparison.Ordinal);
    }

    [Fact]
    public void ValidationErrorsDoNotLeakAFilesystemPath()
    {
        // The schema is compiled from an embedded string, so no path can end up
        // in the message. A schema loaded by relative file name would resolve
        // against the working directory and leak it.
        var styleError = Assert.Throws<StyleValidationException>(
            () => Style.Parse("""{"components":{}}"""));
        var optionsError = Assert.Throws<OptionsValidationException>(
            () => new Avatar(Style.Parse(MinimalStyle), Options(("seed", 123))));

        Assert.DoesNotContain("file:", styleError.Message, StringComparison.Ordinal);
        Assert.DoesNotContain("file:", optionsError.Message, StringComparison.Ordinal);
    }

    [Fact]
    public void ValidationErrorsCarryTheFailingField()
    {
        var exception = Assert.Throws<OptionsValidationException>(
            () => new Avatar(Style.Parse(MinimalStyle), Options(("size", 0))));

        Assert.Contains(exception.Details, detail => detail.InstancePath == "/size");
    }

    [Fact]
    public void RejectsNonFiniteNumbersInOptions()
    {
        var options = new JsonObject { ["scale"] = JsonValue.Create(double.NaN) };

        Assert.Throws<OptionsValidationException>(
            () => new Avatar(Style.Parse(MinimalStyle), options));
    }

    [Fact]
    public void RejectsNonFiniteNumbersInDefinitions()
    {
        var definition = new JsonObject
        {
            ["canvas"] = new JsonObject
            {
                ["width"] = JsonValue.Create(double.PositiveInfinity),
                ["height"] = 100,
                ["elements"] = new JsonArray(),
            },
        };

        Assert.Throws<StyleValidationException>(() => new Style(definition));
    }

    [Fact]
    public void RendersTheSameSvgForTheSameSeed()
    {
        var style = Style.Parse(MinimalStyle);

        Assert.Equal(
            new Avatar(style, Options(("seed", "John"))).ToSvg(),
            new Avatar(style, Options(("seed", "John"))).ToSvg());
        Assert.NotEqual(
            new Avatar(style, Options(("seed", "John"))).ToSvg(),
            new Avatar(style, Options(("seed", "Jane"))).ToSvg());
    }

    [Fact]
    public void FromJsonReadsOptionsAsText()
    {
        var style = Style.Parse(MinimalStyle);

        Assert.Equal(
            new Avatar(style, Options(("seed", "x"))).ToSvg(),
            Avatar.FromJson(style, """{"seed":"x"}""").ToSvg());
        Assert.Throws<OptionsValidationException>(() => Avatar.FromJson(style, "{ not json"));
    }

    /// <summary>
    /// The reference reads strings as UTF-16 code units, so an unpaired
    /// surrogate in a seed is a seed like any other and picks its own avatar.
    /// Anything that encodes the options to UTF-8 on the way in replaces the
    /// surrogate with U+FFFD, which is a different seed and a different
    /// avatar. The options here are built by hand for the same reason:
    /// <see cref="JsonSerializer"/> would encode the surrogate away before the
    /// port ever saw it.
    /// </summary>
    [Fact]
    public void KeepsAnUnpairedSurrogateInTheSeed()
    {
        var style = Style.Parse(MinimalStyle);

        var lone = new Avatar(style, new JsonObject { ["seed"] = "a\uD800b" }).ToSvg();
        var replaced = new Avatar(style, new JsonObject { ["seed"] = "a�b" }).ToSvg();

        Assert.NotEqual(replaced, lone);
    }

    [Fact]
    public void KeepsAnUnpairedSurrogateInTheTitle()
    {
        var svg = new Avatar(
            Style.Parse(MinimalStyle),
            new JsonObject { ["seed"] = "x", ["title"] = "broken \uD800 title" }).ToSvg();

        // The reference renders the code unit the caller passed in.
        Assert.Contains("<title>broken \uD800 title</title>", svg, StringComparison.Ordinal);
        Assert.DoesNotContain("�", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void KeepsAnUnpairedSurrogateInTheDefinition()
    {
        var definition = JsonNode.Parse(MinimalStyle)!.AsObject();

        definition["meta"] = new JsonObject
        {
            ["license"] = new JsonObject
            {
                ["name"] = "CC \uD800 BY",
                ["url"] = "https://example.com",
            },
        };

        var svg = new Avatar(new Style(definition), Options(("seed", "x"))).ToSvg();

        Assert.Contains("CC \uD800 BY", svg, StringComparison.Ordinal);
    }

    /// <summary>
    /// The reference reads a lone surrogate written as an escape in JSON text
    /// and renders it. The .NET reader refuses to hand that string over at
    /// all, so the port cannot take the text either. What it must not do is
    /// let the reader's own exception out in place of its own.
    /// </summary>
    [Fact]
    public void RejectsJsonTextCarryingAnUnpairedSurrogate()
    {
        Assert.Throws<OptionsValidationException>(
            () => Avatar.FromJson(Style.Parse(MinimalStyle), """{"seed":"a\ud800b"}"""));

        Assert.Throws<StyleValidationException>(() => Style.Parse("""
            {
              "canvas": { "width": 100, "height": 100, "elements": [] },
              "meta": { "license": { "name": "CC \ud800 BY", "url": "https://example.com" } }
            }
            """));
    }

    /// <summary>
    /// A hand-built <c>128</c> reaches the port as a C# <c>int</c>, which does
    /// not read back as a <c>double</c> on its own. It has to end up as the
    /// same number, and the same JSON integer, as the <c>128</c> a caller
    /// parsed from text.
    /// </summary>
    [Fact]
    public void ReadsHandBuiltNumbersLikeParsedOnes()
    {
        var style = Style.Parse(MinimalStyle);

        var handBuilt = new Avatar(
            style,
            new JsonObject { ["seed"] = "x", ["size"] = 128, ["scale"] = 2 });
        var parsed = new Avatar(
            style,
            JsonNode.Parse("""{"seed":"x","size":128,"scale":2}""")!.AsObject());

        Assert.Equal(parsed.ToSvg(), handBuilt.ToSvg());
        Assert.Equal(parsed.ToJson(), handBuilt.ToJson());
        Assert.Contains("\"size\":128", handBuilt.ToJson(), StringComparison.Ordinal);
        Assert.Contains("\"scale\":2", handBuilt.ToJson(), StringComparison.Ordinal);
    }

    /// <summary>
    /// The deepest definition the port reads, and the first one it turns down.
    /// One nested element costs two levels, an object and its
    /// <c>children</c> array, on top of the three the canvas already spends.
    /// </summary>
    [Fact]
    public void ReadsADefinitionUpToTheNestingLimit()
    {
        var text = NestedElements((JsonSnapshot.MaxDepth - 3) / 2);

        Assert.Null(Record.Exception(() => new Avatar(Style.Parse(text), Options(("seed", "x")))));
        Assert.Null(Record.Exception(() => new Avatar(new Style(Parse(text)), Options(("seed", "x")))));
    }

    [Fact]
    public void RejectsADefinitionPastTheNestingLimit()
    {
        var text = NestedElements(((JsonSnapshot.MaxDepth - 3) / 2) + 1);

        // A caller who reads the text with a limit of their own hands in a node
        // the port still has to turn down as one of its own errors, rather than
        // as whatever the JSON reader throws.
        var exception = Assert.Throws<StyleValidationException>(() => new Style(Parse(text)));

        Assert.Contains("nesting", exception.Message, StringComparison.Ordinal);
        Assert.DoesNotContain("schema", exception.Message, StringComparison.Ordinal);
        Assert.Throws<StyleValidationException>(() => Style.Parse(text));
    }

    [Fact]
    public void RejectsOptionsPastTheNestingLimit()
    {
        var options = new JsonObject();
        JsonObject leaf = options;

        for (var i = 0; i < JsonSnapshot.MaxDepth; i++)
        {
            var next = new JsonObject();
            leaf["nested"] = next;
            leaf = next;
        }

        Assert.Throws<OptionsValidationException>(
            () => new Avatar(Style.Parse(MinimalStyle), options));
    }

    /// <summary>
    /// A definition whose canvas draws <paramref name="count"/> groups nested
    /// inside one another.
    /// </summary>
    private static string NestedElements(int count)
    {
        var text = new StringBuilder("""{"canvas":{"width":100,"height":100,"elements":[""");

        for (var i = 0; i < count; i++)
        {
            text.Append("""{"type":"element","name":"g","children":[""");
        }

        for (var i = 0; i < count; i++)
        {
            text.Append("]}");
        }

        return text.Append("]}}").ToString();
    }

    /// <summary>
    /// Reads JSON text the way a caller who raised the reader's nesting limit
    /// would, so the port's own check is what a test sees.
    /// </summary>
    private static JsonNode Parse(string json) => JsonNode.Parse(
        json,
        documentOptions: new JsonDocumentOptions { MaxDepth = JsonSnapshot.MaxDepth * 4 })!;

    /// <summary>
    /// Most patterns in the two schemas end on <c>$</c>, which ECMA-262 pins to
    /// the end of the input. The .NET regex engine reads it more loosely, so
    /// this is where the port could start taking values the other ports turn
    /// away. A trailing newline has to be as invalid as a trailing space.
    /// </summary>
    [Theory]
    [InlineData("#ff0000\n")]
    [InlineData("#ff0000\r\n")]
    [InlineData("#ff0000\n\n")]
    [InlineData("#ff0000 ")]
    public void RejectsABackgroundColorWithTrailingWhitespace(string color) =>
        Assert.Throws<OptionsValidationException>(() => new Avatar(
            Style.Parse(MinimalStyle),
            Options(("backgroundColor", new[] { color }))));

    [Fact]
    public void RejectsAFontFamilyWithATrailingNewline() =>
        Assert.Throws<OptionsValidationException>(() => new Avatar(
            Style.Parse(MinimalStyle),
            Options(("fontFamily", new[] { "Arial\n" }))));

    /// <summary>
    /// The option name itself is matched against <c>patternProperties</c>. A
    /// name that misses every pattern falls through to
    /// <c>additionalProperties: false</c>, so a trailing newline must not buy
    /// it a match.
    /// </summary>
    [Fact]
    public void RejectsAnOptionNameWithATrailingNewline() =>
        Assert.Throws<OptionsValidationException>(() => new Avatar(
            Style.Parse(MinimalStyle),
            new JsonObject { ["backgroundColor\n"] = new JsonArray("#ff0000") }));

    [Fact]
    public void RejectsAColorValueWithATrailingNewline()
    {
        var definition = new JsonObject
        {
            ["canvas"] = new JsonObject
            {
                ["width"] = 100,
                ["height"] = 100,
                ["elements"] = new JsonArray(),
            },
            ["colors"] = new JsonObject
            {
                ["brand"] = new JsonObject { ["values"] = new JsonArray("#00ff00\n") },
            },
        };

        Assert.Throws<StyleValidationException>(() => new Style(definition));
    }

    [Fact]
    public void RejectsAComponentNameWithATrailingNewline()
    {
        var definition = new JsonObject
        {
            ["canvas"] = new JsonObject
            {
                ["width"] = 100,
                ["height"] = 100,
                ["elements"] = new JsonArray(),
            },
            ["components"] = new JsonObject
            {
                ["eyes\n"] = new JsonObject
                {
                    ["width"] = 100,
                    ["height"] = 100,
                    ["variants"] = new JsonObject
                    {
                        ["a"] = new JsonObject { ["elements"] = new JsonArray() },
                    },
                },
            },
        };

        Assert.Throws<StyleValidationException>(() => new Style(definition));
    }

    [Fact]
    public void RejectsAnHrefWithATrailingNewline() =>
        Assert.Throws<StyleValidationException>(
            () => new Style(StyleWithAttribute("href", "#a\n")));

    [Fact]
    public void AcceptsAnHrefWithoutOne() =>
        Assert.Null(Record.Exception(() => new Style(StyleWithAttribute("href", "#a"))));

    /// <summary>
    /// <c>definition.json</c> keeps <c>javascript:</c> out of attribute values
    /// with a whitespace class in front of the colon, and that class holds the
    /// five ASCII whitespace characters and nothing else. Every one of them has
    /// to close the filter here too, or the payload reaches the rendered SVG.
    /// </summary>
    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("\t")]
    [InlineData("\n")]
    [InlineData("\f")]
    [InlineData("\r")]
    public void RejectsAScriptUrlBehindAsciiWhitespace(string separator) =>
        Assert.Throws<StyleValidationException>(() => new Style(
            StyleWithAttribute("fill", "javascript" + separator + ":alert(1)")));

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("\t")]
    [InlineData("\n")]
    [InlineData("\f")]
    [InlineData("\r")]
    public void RejectsARemoteUrlBehindAsciiWhitespace(string separator) =>
        Assert.Throws<StyleValidationException>(() => new Style(
            StyleWithAttribute("fill", "url" + separator + "(" + separator + "https://evil")));

    /// <summary>
    /// Every other code point reads as part of the token, so the filter finds
    /// no match and the value stays valid. The JS reference takes the same
    /// input.
    /// </summary>
    [Theory]
    [InlineData("\u000b")]
    [InlineData("\u0085")]
    [InlineData("\u00a0")]
    [InlineData("\u1680")]
    [InlineData("\u2000")]
    [InlineData("\u2028")]
    [InlineData("\u202f")]
    [InlineData("\u3000")]
    [InlineData("\ufeff")]
    [InlineData("\u200b")]
    public void AcceptsAScriptUrlSplitByWhatTheFilterDoesNotRead(string separator) =>
        Assert.Null(Record.Exception(() => new Style(
            StyleWithAttribute("fill", "javascript" + separator + ":alert(1)"))));

    /// <summary>
    /// Behind <c>url(</c> those same code points are not skipped either, and
    /// there it costs the value its exemption: what follows the parenthesis is
    /// no longer the <c>#</c> of a local reference, so the filter matches.
    /// </summary>
    [Theory]
    [InlineData("\u000b")]
    [InlineData("\u0085")]
    [InlineData("\u00a0")]
    [InlineData("\u3000")]
    [InlineData("\ufeff")]
    public void RejectsALocalReferenceBehindWhatTheFilterDoesNotRead(string separator) =>
        Assert.Throws<StyleValidationException>(() => new Style(
            StyleWithAttribute("fill", "url(" + separator + "#local)")));

    /// <summary>
    /// The same filter has to keep letting local paint server references
    /// through, whitespace and all.
    /// </summary>
    [Theory]
    [InlineData("url(#local)")]
    [InlineData("url( #local)")]
    [InlineData("url ( #local)")]
    public void AcceptsALocalPaintServerReference(string fill) =>
        Assert.Null(Record.Exception(() => new Style(StyleWithAttribute("fill", fill))));

    [Theory]
    [InlineData("#ff0000")]
    [InlineData("ff0000")]
    public void AcceptsAWellFormedBackgroundColor(string color) =>
        Assert.Null(Record.Exception(() => new Avatar(
            Style.Parse(MinimalStyle),
            Options(("backgroundColor", new[] { color })))));

    [Fact]
    public void AcceptsAFontFamilyListAndAPatternNamedOption() =>
        Assert.Null(Record.Exception(() => new Avatar(
            Style.Parse(MinimalStyle),
            Options(
                ("fontFamily", new[] { "Foo Bar, Baz" }),
                ("eyesColor", new[] { "#ff0000" })))));

    /// <summary>
    /// A definition whose canvas draws a single element carrying one
    /// attribute, which is the shape the attribute filter cases need.
    /// </summary>
    private static JsonObject StyleWithAttribute(string name, string value) => new JsonObject
    {
        ["canvas"] = new JsonObject
        {
            ["width"] = 100,
            ["height"] = 100,
            ["elements"] = new JsonArray(
                new JsonObject
                {
                    ["type"] = "element",
                    ["name"] = "rect",
                    ["attributes"] = new JsonObject { [name] = value },
                }),
        },
    };

    [Theory]
    [InlineData("[]")]
    [InlineData("5")]
    [InlineData("\"x\"")]
    [InlineData("null")]
    [InlineData("true")]
    public void RejectsOptionsJsonThatIsNotAnObject(string json) =>
        Assert.Throws<OptionsValidationException>(() => Avatar.FromJson(Style.Parse(MinimalStyle), json));

    [Fact]
    public void KeepsSupplementaryPlaneCharactersLiteralInTheJsonEnvelope()
    {
        // The reference's JSON.stringify writes them as they stand, so a
        // seed or title carrying an emoji has to come out the same here.
        var avatar = new Avatar(Style.Parse(MinimalStyle), Options(("seed", "x"), ("title", "hi \U0001F600")));

        Assert.Contains("\"title\":\"hi \U0001F600\"", avatar.ToJson(), StringComparison.Ordinal);
        Assert.DoesNotContain("\\ud83d", avatar.ToJson(), StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void EscapesAnUnpairedSurrogateInTheJsonEnvelope()
    {
        var options = new JsonObject { ["seed"] = "x", ["title"] = "broken \ud800 title" };
        var avatar = new Avatar(Style.Parse(MinimalStyle), options);

        Assert.Contains("\"title\":\"broken \\ud800 title\"", avatar.ToJson(), StringComparison.Ordinal);
    }

    [Fact]
    public void RejectsADataUriForMarkupWithAnUnpairedSurrogate()
    {
        // encodeURIComponent throws URIError on this in the reference. Every
        // port refuses it rather than substituting a replacement character.
        var options = new JsonObject { ["seed"] = "x", ["title"] = "broken \ud800 title" };
        var avatar = new Avatar(Style.Parse(MinimalStyle), options);

        Assert.Throws<ArgumentException>(() => avatar.ToDataUri());
    }

    [Fact]
    public void RejectsAComponentThatReferencesItself()
    {
        var style = Style.Parse("""
            {
              "canvas": {
                "width": 100,
                "height": 100,
                "elements": [{ "type": "component", "name": "face" }]
              },
              "components": {
                "face": {
                  "width": 100,
                  "height": 100,
                  "variants": {
                    "v0": { "elements": [{ "type": "component", "name": "face" }] }
                  }
                }
              }
            }
            """);

        var exception = Assert.Throws<CircularComponentReferenceException>(
            () => new Avatar(style, Options(("seed", "x"))));

        Assert.Equal(new[] { "face", "face" }, exception.Chain);
    }

    [Theory]
    [InlineData("#f")]
    [InlineData("")]
    [InlineData("#zzzzzz")]
    public void ReadsAMalformedColorAsBlackInsteadOfThrowing(string color)
    {
        // The reference yields NaN here rather than raising, so the helpers
        // stay total. 0 is the fallback the other typed ports take.
        Assert.Equal(0.0, Color.Luminance(color));
        Assert.Equal(new[] { "#000", color }, Color.SortByContrast(new[] { "#000", color }, "#fff"));
    }

    [Fact]
    public void FormatsANumberTooLargeToScaleWithoutASecondSign()
    {
        // The scaled integer saturates well before this, and negating the
        // minimum would leave the sign on both halves of the output.
        Assert.DoesNotContain("--", Num.Format(-1e19), StringComparison.Ordinal);
        Assert.DoesNotContain(".-", Num.Format(-1e19), StringComparison.Ordinal);
    }

    /// <summary>
    /// Builds an options object from key and value pairs, so the tests read
    /// like the documented usage.
    /// </summary>
    private static JsonObject Options(params (string Key, object Value)[] entries)
    {
        var options = new JsonObject();

        foreach (var (key, value) in entries)
        {
            options[key] = JsonSerializer.SerializeToNode(value);
        }

        return options;
    }
}
