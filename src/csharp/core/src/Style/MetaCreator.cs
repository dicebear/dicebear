using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over the <c>meta.creator</c> block of a style
    /// definition.
    /// </summary>
    internal sealed class MetaCreator
    {
        private readonly JsonObject _data;

        internal MetaCreator(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the creator's display name, or <see langword="null"/> when
        /// not set.
        /// </summary>
        internal string? Name() => JsonRead.Str(_data, "name");

        /// <summary>
        /// Returns the creator's homepage URL, or <see langword="null"/> when
        /// not set.
        /// </summary>
        internal string? Url() => JsonRead.Str(_data, "url");
    }
}
