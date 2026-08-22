using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Lazily-constructed view over a style definition's <c>meta</c> block,
    /// exposing the license, creator and source descriptors.
    /// </summary>
    internal sealed class Meta
    {
        private readonly JsonObject _data;

        private MetaLicense? _license;
        private MetaCreator? _creator;
        private MetaSource? _source;

        internal Meta(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the license descriptor, defaulting to an empty object when
        /// the style definition omits the field.
        /// </summary>
        internal MetaLicense License() =>
            _license ??= new MetaLicense(JsonRead.Obj(_data, "license") ?? new JsonObject());

        /// <summary>
        /// Returns the creator descriptor, defaulting to an empty object when
        /// the style definition omits the field.
        /// </summary>
        internal MetaCreator Creator() =>
            _creator ??= new MetaCreator(JsonRead.Obj(_data, "creator") ?? new JsonObject());

        /// <summary>
        /// Returns the source descriptor, defaulting to an empty object when
        /// the style definition omits the field.
        /// </summary>
        internal MetaSource Source() =>
            _source ??= new MetaSource(JsonRead.Obj(_data, "source") ?? new JsonObject());
    }
}
