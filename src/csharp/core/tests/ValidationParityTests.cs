using System.Text.Json.Nodes;
using Xunit;

namespace DiceBear.Tests;

/// <summary>
/// Cross-language validation parity: every port must accept and reject the same
/// inputs. Error message text is language-specific and not compared. The
/// circular color reference cases additionally pin the reported chain.
/// </summary>
public class ValidationParityTests
{
    [Fact]
    public void AcceptsAndRejectsTheSameStyles()
    {
        foreach (var testCase in Fixture()["styles"]!.AsArray())
        {
            var id = testCase!["id"]!.GetValue<string>();
            var valid = testCase["valid"]!.GetValue<bool>();
            var definition = testCase["definition"]!.DeepClone();

            if (valid)
            {
                var exception = Record.Exception(() => new Style(definition));

                Assert.True(exception is null, $"style {id}: expected valid, got {exception}");
            }
            else
            {
                Assert.True(
                    Record.Exception(() => new Style(definition)) is StyleValidationException,
                    $"style {id}: expected a StyleValidationException");
            }
        }
    }

    [Fact]
    public void AcceptsAndRejectsTheSameOptions()
    {
        var minimal = MinimalStyle();

        foreach (var testCase in Fixture()["options"]!.AsArray())
        {
            var id = testCase!["id"]!.GetValue<string>();
            var valid = testCase["valid"]!.GetValue<bool>();
            var options = testCase["options"]!.DeepClone().AsObject();

            if (valid)
            {
                var exception = Record.Exception(() => new Avatar(minimal, options));

                Assert.True(exception is null, $"options {id}: expected valid, got {exception}");
            }
            else
            {
                Assert.True(
                    Record.Exception(() => new Avatar(minimal, options)) is OptionsValidationException,
                    $"options {id}: expected an OptionsValidationException");
            }
        }
    }

    [Fact]
    public void ReportsTheCircularColorChain()
    {
        foreach (var testCase in Fixture()["circularColors"]!.AsArray())
        {
            var id = testCase!["id"]!.GetValue<string>();
            var style = new Style(testCase["style"]!.DeepClone());
            var options = testCase["options"]!.DeepClone().AsObject();

            var exception = Assert.Throws<CircularColorReferenceException>(
                () => new Avatar(style, options));
            var expected = testCase["chain"]!.AsArray().Select(item => item!.GetValue<string>()).ToList();

            Assert.True(
                expected.SequenceEqual(exception.Chain),
                $"circular {id}: chain differs, got [{string.Join(", ", exception.Chain)}]");
        }
    }

    /// <summary>
    /// The <c>minimal</c> style fixture is the canvas every options case is
    /// rendered against.
    /// </summary>
    private static Style MinimalStyle()
    {
        foreach (var testCase in Fixture()["styles"]!.AsArray())
        {
            if (testCase!["id"]!.GetValue<string>() == "minimal")
            {
                return new Style(testCase["definition"]!.DeepClone());
            }
        }

        throw new InvalidOperationException("The minimal style fixture is missing");
    }

    private static JsonObject Fixture() => Fixtures.Load("validation.json").AsObject();
}
