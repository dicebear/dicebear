using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over the <c>meta.license</c> block of a style
    /// definition.
    /// </summary>
    internal sealed class MetaLicense
    {
        private readonly JsonObject _data;

        internal MetaLicense(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the license name (e.g. <c>"CC BY 4.0"</c>), or
        /// <see langword="null"/> when not set.
        /// </summary>
        internal string? Name() => JsonRead.Str(_data, "name");

        /// <summary>
        /// Returns the license URL, or <see langword="null"/> when not set.
        /// </summary>
        internal string? Url() => JsonRead.Str(_data, "url");

        /// <summary>
        /// Returns the full license text, or <see langword="null"/> when not
        /// set.
        /// </summary>
        internal string? Text() => JsonRead.Str(_data, "text");
    }
}
