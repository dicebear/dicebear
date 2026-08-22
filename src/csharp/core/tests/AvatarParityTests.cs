using System.Text.Json.Nodes;
using Xunit;

namespace DiceBear.Tests;

/// <summary>
/// Cross-language avatar parity: every shared fixture case is rendered here and
/// the SVG must match the committed output byte for byte, the same fixtures
/// every other port renders against.
/// </summary>
public class AvatarParityTests
{
    public static TheoryData<string> StyleNames()
    {
        var data = new TheoryData<string>();

        foreach (var name in Fixtures.StyleNames())
        {
            data.Add(name);
        }

        return data;
    }

    [Theory]
    [MemberData(nameof(StyleNames))]
    public void RendersTheFixtureAvatars(string styleName)
    {
        var style = Style.Parse(Fixtures.LoadText("styles", styleName + ".json"));

        foreach (var testCase in Fixtures.Load("avatars", styleName + ".json").AsArray())
        {
            var id = testCase!["id"]!.GetValue<string>();
            var avatar = new Avatar(style, testCase["options"]?.DeepClone().AsObject());

            var expectedSvg = testCase["svg"]!.GetValue<string>();

            Assert.True(
                expectedSvg == avatar.ToSvg(),
                $"{styleName}/{id}: SVG differs at byte {FirstDifference(expectedSvg, avatar.ToSvg())}");

            // Only select cases carry a dataUri — it pins the percent-encoding
            // contract (JavaScript's encodeURIComponent) without bloating every
            // fixture.
            var dataUri = testCase["dataUri"];

            if (dataUri is not null)
            {
                Assert.Equal(dataUri.GetValue<string>(), avatar.ToDataUri());
            }

            // Compared without regard to key order, like the other ports'
            // suites, but number formatting counts: a whole number has to
            // serialize as a JSON integer.
            var expected = testCase["resolvedOptions"];
            var actual = avatar.ResolvedOptions();

            Assert.True(
                Fixtures.DeepEquals(expected, actual),
                $"{styleName}/{id}: resolved options differ\n"
                + $" got: {Fixtures.Canonical(actual)}\n"
                + $"want: {Fixtures.Canonical(expected)}");
        }
    }

    /// <summary>
    /// Cross-language descriptor parity: the field map derived from a style
    /// (types, ranges, sorted variant lists, per-color fields) must deep-equal
    /// the fixture the JS reference generated.
    /// </summary>
    [Theory]
    [MemberData(nameof(StyleNames))]
    public void BuildsTheFixtureDescriptor(string styleName)
    {
        var style = Style.Parse(Fixtures.LoadText("styles", styleName + ".json"));
        var expected = Fixtures.Load("descriptors", styleName + ".json");
        var actual = new OptionsDescriptor(style).ToJson();

        Assert.True(
            Fixtures.DeepEquals(expected, actual),
            $"{styleName}: descriptor differs\n"
            + $" got: {Fixtures.Canonical(actual)}\n"
            + $"want: {Fixtures.Canonical(expected)}");
    }

    /// <summary>
    /// Returns the index of the first character where the two strings differ,
    /// or the length of the shorter one when it is a prefix of the other.
    /// </summary>
    private static int FirstDifference(string left, string right)
    {
        var length = Math.Min(left.Length, right.Length);

        for (var i = 0; i < length; i++)
        {
            if (left[i] != right[i])
            {
                return i;
            }
        }

        return length;
    }
}
