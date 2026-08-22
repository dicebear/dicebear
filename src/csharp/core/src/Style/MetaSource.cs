using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over the <c>meta.source</c> block of a style definition.
    /// </summary>
    internal sealed class MetaSource
    {
        private readonly JsonObject _data;

        internal MetaSource(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the source name (e.g. the original work title), or
        /// <see langword="null"/> when not set.
        /// </summary>
        internal string? Name() => JsonRead.Str(_data, "name");

        /// <summary>
        /// Returns the URL of the source, or <see langword="null"/> when not
        /// set.
        /// </summary>
        internal string? Url() => JsonRead.Str(_data, "url");
    }
}
