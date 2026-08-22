using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over a component's <c>translate</c> block, providing the
    /// X and Y offset ranges.
    /// </summary>
    internal sealed class ComponentTranslate
    {
        private readonly JsonObject _data;

        internal ComponentTranslate(JsonObject data) => _data = data;

        internal NumberRange? X() => JsonRead.Range(_data, "x");

        internal NumberRange? Y() => JsonRead.Range(_data, "y");
    }
}
