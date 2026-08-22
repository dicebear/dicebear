using System.Text.Json.Nodes;
using DiceBear.Internal;
using Xunit;

namespace DiceBear.Tests;

/// <summary>
/// Cross-language parity: the primitives must produce exactly the values in
/// the shared fixtures under <c>&lt;repo&gt;/tests/fixtures/parity/</c>, the
/// same ones every other port runs against.
/// </summary>
public class PrimitiveParityTests
{
    [Fact]
    public void Fnv1aMatchesFixtures()
    {
        foreach (var testCase in Cases(Fixtures.Load("fnv1a.json")))
        {
            var input = Text(testCase, "input");

            Assert.Equal(Value<uint>(testCase, "hash"), Fnv1a.Hash(input));
            Assert.Equal(Text(testCase, "hex"), Fnv1a.Hex(input));
        }
    }

    [Fact]
    public void Mulberry32MatchesFixtures()
    {
        foreach (var testCase in Cases(Fixtures.Load("mulberry32.json")))
        {
            var prng = new Mulberry32(Value<uint>(testCase, "seed"));

            foreach (var step in Cases(testCase["sequence"]!))
            {
                Assert.Equal(Value<double>(step, "float"), prng.NextDouble());
                Assert.Equal(Value<int>(step, "state"), prng.SignedState());
            }
        }
    }

    [Fact]
    public void GetValueMatchesFixtures()
    {
        foreach (var testCase in Section("getValue"))
        {
            Assert.Equal(
                Value<double>(testCase, "result"),
                MakePrng(testCase).GetValue(Text(testCase, "key")));
        }
    }

    [Fact]
    public void PickMatchesFixtures()
    {
        foreach (var testCase in Section("pick"))
        {
            var actual = MakePrng(testCase).Pick(Text(testCase, "key"), Strings(testCase["items"]));

            Assert.Equal(OptionalText(testCase["result"]), actual);
        }
    }

    [Fact]
    public void WeightedPickMatchesFixtures()
    {
        foreach (var testCase in Section("weightedPick"))
        {
            var weights = new OrderedMap<double>();

            foreach (var entry in testCase["weights"]!.AsObject())
            {
                weights.Set(entry.Key, entry.Value!.GetValue<double>());
            }

            var actual = MakePrng(testCase).WeightedPick(Text(testCase, "key"), weights);

            Assert.Equal(OptionalText(testCase["result"]), actual);
        }
    }

    [Fact]
    public void BoolMatchesFixtures()
    {
        foreach (var testCase in Section("bool"))
        {
            var actual = MakePrng(testCase).Bool(
                Text(testCase, "key"),
                Value<double>(testCase, "likelihood"));

            Assert.Equal(Value<bool>(testCase, "result"), actual);
        }
    }

    [Fact]
    public void FloatMatchesFixtures()
    {
        foreach (var testCase in Section("float"))
        {
            var actual = MakePrng(testCase).Float(Text(testCase, "key"), Range(testCase["range"]!));

            Assert.Equal(Value<double>(testCase, "result"), actual);
        }
    }

    [Fact]
    public void IntegerMatchesFixtures()
    {
        foreach (var testCase in Section("integer"))
        {
            var actual = MakePrng(testCase).Integer(Text(testCase, "key"), Range(testCase["range"]!));

            Assert.Equal(Value<int>(testCase, "result"), actual);
        }
    }

    [Fact]
    public void ShuffleMatchesFixtures()
    {
        foreach (var testCase in Section("shuffle"))
        {
            var actual = MakePrng(testCase).Shuffle(Text(testCase, "key"), Strings(testCase["items"]));

            Assert.Equal(Strings(testCase["result"]), actual);
        }
    }

    [Fact]
    public void NumberFormattingMatchesFixtures()
    {
        foreach (var testCase in Cases(Fixtures.Load("numbers.json")))
        {
            Assert.Equal(Text(testCase, "output"), Num.Format(Value<double>(testCase, "input")));
        }
    }

    [Fact]
    public void InitialsMatchFixtures()
    {
        foreach (var testCase in Cases(Fixtures.Load("initials.json")))
        {
            Assert.Equal(Text(testCase, "result"), Initials.FromSeed(Text(testCase, "seed")));
        }
    }

    [Fact]
    public void ColorHelpersMatchFixtures()
    {
        var fixture = Fixtures.Load("colors.json").AsObject();

        foreach (var testCase in Cases(fixture["toHex"]!))
        {
            Assert.Equal(Text(testCase, "result"), Color.ToHex(Text(testCase, "input")));
        }

        foreach (var testCase in Cases(fixture["toRgbHex"]!))
        {
            Assert.Equal(Text(testCase, "result"), Color.ToRgbHex(Text(testCase, "input")));
        }

        foreach (var testCase in Cases(fixture["parseHex"]!))
        {
            var expected = testCase["result"]!.AsArray();
            var (red, green, blue) = Color.ParseHex(Text(testCase, "input"));

            Assert.Equal(expected[0]!.GetValue<int>(), red);
            Assert.Equal(expected[1]!.GetValue<int>(), green);
            Assert.Equal(expected[2]!.GetValue<int>(), blue);
        }

        foreach (var testCase in Cases(fixture["luminance"]!))
        {
            Assert.Equal(Value<double>(testCase, "result"), Color.Luminance(Text(testCase, "input")));
        }

        foreach (var testCase in Cases(fixture["sortByContrast"]!))
        {
            var actual = Color.SortByContrast(
                Strings(testCase["candidates"]),
                Text(testCase, "refColor"));

            Assert.Equal(Strings(testCase["result"]), actual);
        }

        foreach (var testCase in Cases(fixture["filterNotEqualTo"]!))
        {
            var actual = Color.FilterNotEqualTo(
                Strings(testCase["candidates"]),
                Strings(testCase["excluded"]));

            Assert.Equal(Strings(testCase["result"]), actual);
        }
    }

    /// <summary>
    /// The whole-number branch of the JavaScript <c>String()</c> conversion is
    /// what the PRNG sorts numeric options by, and it is the one place the
    /// round-trip format would disagree with the reference.
    /// </summary>
    [Theory]
    [InlineData(400.0, "400")]
    [InlineData(0.0, "0")]
    [InlineData(-7.0, "-7")]
    [InlineData(1e20, "100000000000000000000")]
    [InlineData(0.5, "0.5")]
    public void JsStringMatchesJavaScript(double value, string expected) =>
        Assert.Equal(expected, Num.JsString(value));

    /// <summary>
    /// JavaScript prints negative zero as "0"; the fixed-point format would
    /// keep the sign.
    /// </summary>
    [Fact]
    public void JsStringDropsTheSignOfNegativeZero() =>
        Assert.Equal("0", Num.JsString(-0.0));

    private static IEnumerable<JsonNode> Section(string name) =>
        Cases(Fixtures.Load("prng.json").AsObject()[name]!);

    private static IEnumerable<JsonNode> Cases(JsonNode node) =>
        node.AsArray().Select(item => item!);

    private static Prng MakePrng(JsonNode testCase) => new Prng(Text(testCase, "seed"));

    private static NumberRange Range(JsonNode range)
    {
        var step = range["step"];

        return new NumberRange(
            range["min"]!.GetValue<double>(),
            range["max"]!.GetValue<double>(),
            step?.GetValue<double>());
    }

    private static T Value<T>(JsonNode testCase, string key) => testCase[key]!.GetValue<T>();

    private static string Text(JsonNode testCase, string key) => testCase[key]!.GetValue<string>();

    private static string? OptionalText(JsonNode? node) => node?.GetValue<string>();

    private static IReadOnlyList<string> Strings(JsonNode? node) =>
        node is null
            ? Array.Empty<string>()
            : node.AsArray().Select(item => item!.GetValue<string>()).ToList();
}
