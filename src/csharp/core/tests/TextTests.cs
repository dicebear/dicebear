using DiceBear.Internal;
using Xunit;

namespace DiceBear.Tests;

/// <summary>
/// Making user text well-formed: every lone surrogate becomes U+FFFD, the same
/// as JavaScript's <c>String.prototype.toWellFormed()</c>.
/// </summary>
public class TextTests
{
    private const string High = "\uD83D";
    private const string Low = "\uDE00";
    private const string Emoji = High + Low;

    [Theory]
    [InlineData("")]
    [InlineData("abc")]
    [InlineData("Zoë")]
    [InlineData(Emoji)]
    [InlineData("a" + Emoji + "b")]
    public void LeavesWellFormedTextAsItIs(string value) =>
        Assert.Same(value, Text.WellFormed(value));

    /// <remarks>
    /// These cases are plain facts because xUnit stores the data of an
    /// <c>[InlineData]</c> theory as UTF-8 and would turn the lone surrogates
    /// into U+FFFD before the test sees them.
    /// </remarks>
    [Fact]
    public void ReplacesLoneSurrogates()
    {
        var cases = new (string Value, string Expected)[]
        {
            (High, "\uFFFD"),
            (Low, "\uFFFD"),
            ("Jo" + High, "Jo\uFFFD"),
            (Low + "Ann", "\uFFFDAnn"),
            (Low + High, "\uFFFD\uFFFD"),
            (High + Emoji, "\uFFFD" + Emoji),
            (Emoji + Low, Emoji + "\uFFFD"),
        };

        foreach (var (value, expected) in cases)
        {
            Assert.Equal(expected, Text.WellFormed(value));
        }
    }
}
