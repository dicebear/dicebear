using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using DiceBear.Internal;
using Xunit;

namespace DiceBear.Tests;

/// <summary>
/// The animation options: the global <c>animation</c> switch,
/// <c>animationSpeed</c> factor and <c>animationDelay</c> offset, and the
/// <c>{name}Animation</c>, <c>{name}AnimationSpeed</c> and
/// <c>{name}AnimationDelay</c> triple every animation name gets. The resolver
/// cases pin the PRNG keys and what lands in the snapshot, the avatar cases pin
/// what reaches the markup and the JSON envelope. The behaviors mirror the
/// reference suite.
/// </summary>
public class AnimationOptionsTests
{
    private const string MinimalStyle = """{"canvas":{"width":100,"height":100,"elements":[]}}""";

    // A named timeline next to an unnamed one on the same element, so the
    // per-name option has one to scale and one to leave as authored.
    private const string PacedStyle = """
        {
          "canvas": {
            "width": 100,
            "height": 100,
            "elements": [
              {
                "type": "element",
                "name": "rect",
                "animations": [
                  {
                    "name": "sway",
                    "duration": 4,
                    "delay": 1,
                    "tracks": {
                      "rotate": { "keyframes": [{ "at": 0, "value": 0 }, { "at": 100, "value": 4 }] }
                    }
                  },
                  {
                    "duration": 3,
                    "tracks": {
                      "opacity": { "keyframes": [{ "at": 0, "value": 1 }, { "at": 50, "value": 0.5 }] }
                    }
                  }
                ]
              }
            ]
          }
        }
        """;

    // One named block per element plus an unnamed one, so every switch has
    // something to include and something to skip.
    private const string NamedStyle = """
        {
          "canvas": {
            "width": 100,
            "height": 100,
            "elements": [
              {
                "type": "element",
                "name": "rect",
                "animations": [
                  {
                    "name": "sway",
                    "duration": 1,
                    "tracks": {
                      "rotate": { "keyframes": [{ "at": 0, "value": 0 }, { "at": 100, "value": 4 }] }
                    }
                  }
                ]
              },
              {
                "type": "element",
                "name": "circle",
                "animations": [
                  {
                    "name": "blink",
                    "duration": 2,
                    "tracks": {
                      "scaleY": { "keyframes": [{ "at": 0, "value": 1 }, { "at": 50, "value": 0.1 }] }
                    }
                  },
                  {
                    "duration": 3,
                    "tracks": {
                      "opacity": { "keyframes": [{ "at": 0, "value": 1 }, { "at": 50, "value": 0.5 }] }
                    }
                  }
                ]
              }
            ]
          }
        }
        """;

    [Theory]
    [InlineData("""{"animation":"blink"}""")]
    [InlineData("""{"animation":["blink"]}""")]
    [InlineData("""{"blinkAnimation":"yes"}""")]
    [InlineData("""{"BlinkAnimation":true}""")]
    [InlineData("""{"blinkAnimationSpeed":0}""")]
    [InlineData("""{"blinkAnimationSpeed":[0.5,2,4]}""")]
    [InlineData("""{"BlinkAnimationSpeed":2}""")]
    [InlineData("""{"blinkAnimationSpeed":"fast"}""")]
    [InlineData("""{"animationDelay":3601}""")]
    [InlineData("""{"blinkAnimationDelay":[0,1,2]}""")]
    [InlineData("""{"blinkAnimationDelay":"late"}""")]
    public void RejectsInvalidValuesAtValidation(string json) =>
        Assert.Throws<OptionsValidationException>(() => new Options(JsonNode.Parse(json)));

    [Fact]
    public void LetsANamedSwitchWinOverTheGlobalOne()
    {
        var on = Resolver(Options(("animation", false), ("blinkAnimation", true)));

        Assert.True(on.AnimationPlays("blink"));
        Assert.False(on.AnimationPlays("sway"));
        Assert.False(on.AnimationPlays(null));

        // Only the switch that was asked for and set lands in the snapshot.
        Assert.True(on.Resolved().TryGetValue("blinkAnimation", out var recorded));
        Assert.Equal(true, recorded);
        Assert.False(on.Resolved().ContainsKey("swayAnimation"));

        var off = Resolver(Options(("animation", true), ("blinkAnimation", false)));

        Assert.False(off.AnimationPlays("blink"));
        Assert.True(off.AnimationPlays("sway"));
        Assert.True(off.AnimationPlays(null));
    }

    [Fact]
    public void LetsTheSpecificSpeedWinOverTheGlobalOne()
    {
        var resolver = Resolver(Options(("animationSpeed", 0.5), ("blinkAnimationSpeed", 2)));

        Assert.Equal(2.0, resolver.AnimationSpeedFor("blink"));
        Assert.Equal(0.5, resolver.AnimationSpeedFor("sway"));
        Assert.Equal(0.5, resolver.AnimationSpeedFor(null));

        // Only the option that was asked for and set lands in the snapshot.
        Assert.True(resolver.Resolved().TryGetValue("blinkAnimationSpeed", out var recorded));
        Assert.Equal(2.0, recorded);
        Assert.False(resolver.Resolved().ContainsKey("swayAnimationSpeed"));
    }

    [Fact]
    public void DrawsASpecificRangeUnderItsOwnKey()
    {
        var options = Options(
            ("seed", "x"),
            ("blinkAnimationSpeed", new[] { 0.5, 2 }),
            ("swayAnimationSpeed", new[] { 0.5, 2 }));
        var resolver = Resolver(options);
        var blink = resolver.AnimationSpeedFor("blink");

        Assert.InRange(blink, 0.5, 2.0);

        // Each name has a key of its own, and none of them is the plain
        // `animationSpeed` key the global option draws under.
        Assert.NotEqual(blink, resolver.AnimationSpeedFor("sway"));
        Assert.NotEqual(
            blink,
            Resolver(Options(("seed", "x"), ("animationSpeed", new[] { 0.5, 2 }))).AnimationSpeed());
        Assert.Equal(blink, Resolver(options).AnimationSpeedFor("blink"));
    }

    [Fact]
    public void LetsANamedDelayWinOverTheGlobalOne()
    {
        var resolver = Resolver(Options(("animationDelay", 1), ("blinkAnimationDelay", -2)));

        Assert.Equal(1.0, resolver.AnimationDelay());
        Assert.Equal(-2.0, resolver.AnimationDelayFor("blink"));
        Assert.Equal(1.0, resolver.AnimationDelayFor("sway"));
        Assert.Equal(1.0, resolver.AnimationDelayFor(null));
        Assert.Equal(0.0, Resolver(Options()).AnimationDelayFor("blink"));
    }

    [Fact]
    public void DrawsADelayRangeUnderItsOwnKeySeeded()
    {
        var options = Options(
            ("seed", "x"),
            ("animationDelay", new[] { 0, 3 }),
            ("blinkAnimationDelay", new[] { 0, 3 }));
        var resolver = Resolver(options);
        var global = resolver.AnimationDelay();
        var blink = resolver.AnimationDelayFor("blink");

        Assert.InRange(global, 0.0, 3.0);
        Assert.InRange(blink, 0.0, 3.0);
        Assert.NotEqual(global, blink);
        Assert.Equal(blink, Resolver(options).AnimationDelayFor("blink"));
    }

    [Fact]
    public void PlaysOnlyATimelineSwitchedOnByName()
    {
        var svg = new Avatar(Style.Parse(NamedStyle), Options(("blinkAnimation", true))).ToSvg();

        Assert.Single(Regex.Matches(svg, "animation:"));
        Assert.Contains("scaleY", svg, StringComparison.Ordinal);
        Assert.DoesNotContain("rotate(", svg, StringComparison.Ordinal);
        Assert.DoesNotContain("opacity:", svg, StringComparison.Ordinal);
        Assert.Single(Regex.Matches(svg, "<g class=\"dba-"));
    }

    [Fact]
    public void CombinesSeveralSwitches()
    {
        var svg = new Avatar(
            Style.Parse(NamedStyle),
            Options(("swayAnimation", true), ("blinkAnimation", true))).ToSvg();

        Assert.Equal(2, Regex.Matches(svg, "animation:").Count);
        Assert.Contains("rotate(", svg, StringComparison.Ordinal);
        Assert.Contains("scaleY", svg, StringComparison.Ordinal);
        Assert.DoesNotContain("opacity:", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void PlaysUnnamedTimelinesOnlyThroughTheGlobalSwitch()
    {
        var svg = new Avatar(Style.Parse(NamedStyle), Options(("animation", true))).ToSvg();

        Assert.Equal(3, Regex.Matches(svg, "animation:").Count);
        Assert.Contains("opacity:", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void SwitchesATimelineOffWhileTheRestPlay()
    {
        var svg = new Avatar(
            Style.Parse(NamedStyle),
            Options(("animation", true), ("blinkAnimation", false))).ToSvg();

        Assert.Equal(2, Regex.Matches(svg, "animation:").Count);
        Assert.DoesNotContain("scaleY", svg, StringComparison.Ordinal);
        Assert.Contains("rotate(", svg, StringComparison.Ordinal);
        Assert.Contains("opacity:", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void StaysStaticForANameTheStyleDoesNotCarry()
    {
        var style = Style.Parse(NamedStyle);
        var switched = new Avatar(style, Options(("bounceAnimation", true)));

        Assert.Equal(new Avatar(style, Options()).ToSvg(), switched.ToSvg());
        Assert.False(switched.ResolvedOptions().ContainsKey("bounceAnimation"));
    }

    [Fact]
    public void RecordsTheSwitchesInTheResolvedOptions()
    {
        var options = new Avatar(Style.Parse(NamedStyle), Options(("blinkAnimation", true))).ResolvedOptions();

        Assert.False(options["animation"]!.GetValue<bool>());
        Assert.True(options["blinkAnimation"]!.GetValue<bool>());
        Assert.False(options.ContainsKey("swayAnimation"));
    }

    [Fact]
    public void IncludesTheSwitchesInTheClassNamespace()
    {
        var style = Style.Parse(NamedStyle);
        var all = new Avatar(style, Options(("animation", true))).ToSvg();
        var one = new Avatar(style, Options(("blinkAnimation", true))).ToSvg();
        var allButOne = new Avatar(style, Options(("animation", true), ("blinkAnimation", false))).ToSvg();

        Assert.NotEqual(HashOf(all), HashOf(one));
        Assert.NotEqual(HashOf(all), HashOf(allButOne));
        Assert.NotEqual(HashOf(one), HashOf(allButOne));
    }

    [Fact]
    public void ScalesOnlyTheNamedTimeline()
    {
        var svg = new Avatar(
            Style.Parse(PacedStyle),
            Options(("animation", true), ("swayAnimationSpeed", 2))).ToSvg();

        Assert.Contains("animation:2s linear 0.5s infinite", svg, StringComparison.Ordinal);
        Assert.Contains("animation:3s linear 0s infinite", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void LetsTheSpecificSpeedWinOverTheGlobalOneWhenRendering()
    {
        var svg = new Avatar(
            Style.Parse(PacedStyle),
            Options(("animation", true), ("animationSpeed", 0.5), ("swayAnimationSpeed", 2))).ToSvg();

        Assert.Contains("animation:2s linear 0.5s infinite", svg, StringComparison.Ordinal);
        Assert.Contains("animation:6s linear 0s infinite", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void IgnoresASpeedForANameTheStyleDoesNotCarry()
    {
        var style = Style.Parse(PacedStyle);
        var listed = new Avatar(style, Options(("animation", true), ("bounceAnimationSpeed", 2)));
        var plain = new Avatar(style, Options(("animation", true)));

        Assert.Equal(plain.ToSvg(), listed.ToSvg());
        Assert.False(listed.ResolvedOptions().ContainsKey("bounceAnimationSpeed"));
    }

    [Fact]
    public void LeavesATimelineThatDoesNotPlayUntouched()
    {
        var style = Style.Parse(PacedStyle);
        var off = new Avatar(style, Options(("animation", false), ("swayAnimationSpeed", 2)));

        Assert.Equal(new Avatar(style, Options()).ToSvg(), off.ToSvg());
        Assert.False(off.ResolvedOptions().ContainsKey("swayAnimationSpeed"));
    }

    [Fact]
    public void DoesNotDrawASpeedForASwitchedOffName()
    {
        // The class namespace asks every named timeline for its state, and a
        // switched-off name contributes `off` without a factor.
        var avatar = new Avatar(
            Style.Parse(NamedStyle),
            Options(("blinkAnimation", true), ("swayAnimationSpeed", 2)));

        Assert.True(avatar.ResolvedOptions()["blinkAnimation"]!.GetValue<bool>());
        Assert.False(avatar.ResolvedOptions().ContainsKey("swayAnimationSpeed"));
        Assert.DoesNotContain("rotate(", avatar.ToSvg(), StringComparison.Ordinal);
    }

    [Fact]
    public void IncludesTheNamedFactorInTheClassNamespace()
    {
        var style = Style.Parse(PacedStyle);
        var named = new Avatar(style, Options(("animation", true), ("swayAnimationSpeed", 2))).ToSvg();
        var global = new Avatar(style, Options(("animation", true), ("animationSpeed", 2))).ToSvg();

        Assert.NotEqual(HashOf(named), HashOf(global));
    }

    [Fact]
    public void RecordsTheDrawnFactorInTheResolvedOptions()
    {
        var options = new Avatar(
            Style.Parse(PacedStyle),
            Options(("animation", true), ("swayAnimationSpeed", new[] { 2, 2 }))).ResolvedOptions();

        Assert.Equal(2.0, options["swayAnimationSpeed"]!.GetValue<double>());
        Assert.Equal(1.0, options["animationSpeed"]!.GetValue<double>());
    }

    [Fact]
    public void AddsTheDelayAfterTheSpeedHasScaledTheAuthoredOne()
    {
        var svg = new Avatar(
            Style.Parse(PacedStyle),
            Options(("animation", true), ("animationSpeed", 2), ("animationDelay", 3))).ToSvg();

        Assert.Contains("animation:2s linear 3.5s infinite", svg, StringComparison.Ordinal);
        Assert.Contains("animation:1.5s linear 3s infinite", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void LetsANamedDelayWinOverTheGlobalOneWhenRendering()
    {
        var svg = new Avatar(
            Style.Parse(PacedStyle),
            Options(("animation", true), ("animationDelay", 1), ("swayAnimationDelay", -2))).ToSvg();

        Assert.Contains("animation:4s linear -1s infinite", svg, StringComparison.Ordinal);
        Assert.Contains("animation:3s linear 1s infinite", svg, StringComparison.Ordinal);
    }

    [Fact]
    public void IncludesTheDelaysInTheClassNamespace()
    {
        var style = Style.Parse(PacedStyle);
        var plain = new Avatar(style, Options(("animation", true))).ToSvg();
        var shifted = new Avatar(style, Options(("animation", true), ("animationDelay", 1))).ToSvg();
        var named = new Avatar(style, Options(("animation", true), ("swayAnimationDelay", 1))).ToSvg();

        Assert.NotEqual(HashOf(plain), HashOf(shifted));
        Assert.NotEqual(HashOf(shifted), HashOf(named));
    }

    [Fact]
    public void RecordsTheDelaysInTheResolvedOptions()
    {
        var style = Style.Parse(PacedStyle);
        var options = new Avatar(
            style,
            Options(("animation", true), ("animationDelay", 1), ("swayAnimationDelay", new[] { -2, -2 }))).ResolvedOptions();

        Assert.Equal(1.0, options["animationDelay"]!.GetValue<double>());
        Assert.Equal(-2.0, options["swayAnimationDelay"]!.GetValue<double>());
        Assert.False(new Avatar(style, Options()).ResolvedOptions().ContainsKey("animationDelay"));
    }

    [Fact]
    public void RejectsAnimationsInsideDefs()
    {
        Assert.Throws<StyleValidationException>(() => Style.Parse("""
            {
              "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                  {
                    "type": "element",
                    "name": "defs",
                    "children": [
                      {
                        "type": "element",
                        "name": "circle",
                        "attributes": { "id": "dot", "r": "10" },
                        "animations": [
                          { "duration": 1, "tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }] } } }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
            """));
    }

    [Fact]
    public void RejectsAnimationsBelowAClipPath()
    {
        Assert.Throws<StyleValidationException>(() => Style.Parse("""
            {
              "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                  {
                    "type": "element",
                    "name": "clipPath",
                    "attributes": { "id": "clip" },
                    "children": [
                      {
                        "type": "element",
                        "name": "g",
                        "children": [
                          {
                            "type": "element",
                            "name": "circle",
                            "attributes": { "r": "10" },
                            "animations": [
                              { "duration": 1, "tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }] } } }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
            """));
    }

    [Fact]
    public void AcceptsAnimationsInsideAMask()
    {
        var style = Style.Parse("""
            {
              "canvas": {
                "width": 100,
                "height": 100,
                "elements": [
                  {
                    "type": "element",
                    "name": "mask",
                    "attributes": { "id": "fade" },
                    "children": [
                      {
                        "type": "element",
                        "name": "circle",
                        "attributes": { "r": "10", "fill": "#fff" },
                        "animations": [
                          { "duration": 1, "tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }] } } }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
            """);

        Assert.True(style.HasAnimations());
    }

    [Fact]
    public void AdvertisesASwitchASpeedAndADelayPerAnimationName()
    {
        var descriptor = new OptionsDescriptor(Style.Parse(NamedStyle)).ToJson();
        var keys = descriptor.Select(entry => entry.Key).ToList();

        Assert.Equal("boolean", descriptor["animation"]!["type"]!.GetValue<string>());
        Assert.Equal(
            new[]
            {
                "animation", "animationSpeed", "animationDelay",
                "blinkAnimation", "blinkAnimationSpeed", "blinkAnimationDelay",
                "swayAnimation", "swayAnimationSpeed", "swayAnimationDelay",
            },
            keys.Skip(keys.IndexOf("animation")).Take(9));
        Assert.Equal("boolean", descriptor["blinkAnimation"]!["type"]!.GetValue<string>());
        Assert.Equal("range", descriptor["blinkAnimationSpeed"]!["type"]!.GetValue<string>());
        Assert.Equal("0.1", descriptor["blinkAnimationSpeed"]!["min"]!.ToJsonString());
        Assert.Equal("10", descriptor["blinkAnimationSpeed"]!["max"]!.ToJsonString());
        Assert.Equal("range", descriptor["blinkAnimationDelay"]!["type"]!.GetValue<string>());
        Assert.Equal("-3600", descriptor["blinkAnimationDelay"]!["min"]!.ToJsonString());
        Assert.Equal("3600", descriptor["blinkAnimationDelay"]!["max"]!.ToJsonString());
    }

    /// <summary>
    /// Extracts the animation class namespace from the rendered markup.
    /// </summary>
    private static string HashOf(string svg)
    {
        var match = Regex.Match(svg, "dba-([0-9a-f]+)-[0-9]+");

        Assert.True(match.Success, "expected an animation class in the output");

        return match.Groups[1].Value;
    }

    private static Resolver Resolver(JsonObject options) =>
        new Resolver(Style.Parse(MinimalStyle), new Options(options));

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
