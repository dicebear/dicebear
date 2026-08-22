using System.Text.Json;
using System.Text.Json.Nodes;

namespace DiceBear.Tests;

/// <summary>
/// Loads the cross-language parity fixtures under
/// <c>&lt;repo&gt;/tests/fixtures/parity/</c>, the same files every other port
/// runs against.
/// </summary>
internal static class Fixtures
{
    private static readonly string Root = FindRoot();

    /// <summary>
    /// Reads one fixture file and parses it as a JSON node.
    /// </summary>
    internal static JsonNode Load(params string[] segments)
    {
        var path = Path.Combine(new[] { Root }.Concat(segments).ToArray());

        return JsonNode.Parse(File.ReadAllText(path))
            ?? throw new InvalidOperationException($"Fixture is empty: {path}");
    }

    /// <summary>
    /// Reads one fixture file as text.
    /// </summary>
    internal static string LoadText(params string[] segments) =>
        File.ReadAllText(Path.Combine(new[] { Root }.Concat(segments).ToArray()));

    /// <summary>
    /// Enumerates the parity style fixtures instead of repeating a
    /// hand-maintained list, so a fixture added to
    /// <c>tests/fixtures/parity/styles</c> is picked up here the way the PHP,
    /// Python and Go suites already pick it up. Names are returned sorted, so
    /// the test order stays stable.
    /// </summary>
    internal static IReadOnlyList<string> StyleNames()
    {
        var names = Directory
            .EnumerateFiles(Path.Combine(Root, "styles"), "*.json")
            .Select(Path.GetFileNameWithoutExtension)
            .Where(name => !string.IsNullOrEmpty(name))
            .Select(name => name!)
            .OrderBy(name => name, StringComparer.Ordinal)
            .ToList();

        if (names.Count == 0)
        {
            throw new InvalidOperationException("No style fixtures found");
        }

        return names;
    }

    /// <summary>
    /// Compares two JSON documents for deep equality, treating a whole number
    /// written as an integer and the same value written as a float as
    /// different. That pins whole-number options as JSON integers, the same
    /// guarantee the Go and Rust suites make.
    /// </summary>
    internal static bool DeepEquals(JsonNode? left, JsonNode? right) =>
        Canonical(left) == Canonical(right);

    /// <summary>
    /// Renders a node as a stable, key-sorted string so the comparison ignores
    /// property order but not values or number formatting.
    /// </summary>
    internal static string Canonical(JsonNode? node)
    {
        switch (node)
        {
            case null:
                return "null";
            case JsonArray array:
                return "[" + string.Join(",", array.Select(Canonical)) + "]";
            case JsonObject obj:
                return "{" + string.Join(
                    ",",
                    obj.OrderBy(entry => entry.Key, StringComparer.Ordinal)
                        .Select(entry => JsonSerializer.Serialize(entry.Key) + ":" + Canonical(entry.Value)))
                    + "}";
            default:
                return node.ToJsonString();
        }
    }

    /// <summary>
    /// Walks up from the test assembly until the shared fixture directory
    /// turns up, so the suite does not depend on the working directory.
    /// </summary>
    private static string FindRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);

        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, "tests", "fixtures", "parity");

            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            directory = directory.Parent;
        }

        throw new InvalidOperationException(
            "Parity fixtures not found: expected tests/fixtures/parity in a parent directory of "
            + AppContext.BaseDirectory);
    }
}
