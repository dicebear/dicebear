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
