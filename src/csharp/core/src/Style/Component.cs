using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over an entry in a style definition's <c>components</c>
    /// block.
    /// </summary>
    /// <remarks>
    /// An entry is either a base component with its own dimensions and
    /// variants or an alias declared via <c>extends</c>. Aliases are pure
    /// references — they inherit dimensions, variants and all transforms from
    /// the source.
    /// </remarks>
    internal sealed class Component
    {
        private readonly JsonObject _data;
        private readonly string _name;
        private readonly Component? _source;

        private ComponentTranslate? _translate;
        private OrderedMap<ComponentVariant>? _variants;

        internal Component(string name, JsonObject data, Component? source = null)
        {
            _name = name;
            _data = data;
            _source = source;
        }

        /// <summary>
        /// Returns the entry's own name as declared in the style definition.
        /// For aliases this is the alias key, not the source component's name
        /// (use <see cref="SourceName"/> for the canonical user-option key
        /// prefix).
        /// </summary>
        internal string Name() => _name;

        /// <summary>
        /// Returns the source component name when this entry is an alias, or
        /// <see langword="null"/> for a base component.
        /// </summary>
        internal string? ExtendsName() => JsonRead.Str(_data, "extends");

        /// <summary>
        /// Returns the canonical user-option key prefix: the source
        /// component's name when this entry is an alias, otherwise the entry's
        /// own name.
        /// </summary>
        internal string SourceName() => ExtendsName() ?? _name;

        /// <summary>
        /// Returns the component's intrinsic width in canvas coordinates. For
        /// aliases the source component's width is returned.
        /// </summary>
        internal double Width() => _source is not null ? _source.Width() : JsonRead.Num(_data, "width") ?? 0.0;

        /// <summary>
        /// Returns the component's intrinsic height in canvas coordinates. For
        /// aliases the source component's height is returned.
        /// </summary>
        internal double Height() => _source is not null ? _source.Height() : JsonRead.Num(_data, "height") ?? 0.0;

        /// <summary>
        /// Returns the probability (0–100) that this component is rendered.
        /// Aliases delegate to the source; defaults to 100 (always visible).
        /// </summary>
        internal double Probability() =>
            _source is not null ? _source.Probability() : JsonRead.Num(_data, "probability") ?? 100.0;

        /// <summary>
        /// Returns the rotation range, or <see langword="null"/> when unset.
        /// Aliases delegate to the source.
        /// </summary>
        internal NumberRange? Rotate() => _source is not null ? _source.Rotate() : JsonRead.Range(_data, "rotate");

        /// <summary>
        /// Returns the scale range, or <see langword="null"/> when unset.
        /// Aliases delegate to the source.
        /// </summary>
        internal NumberRange? Scale() => _source is not null ? _source.Scale() : JsonRead.Range(_data, "scale");

        /// <summary>
        /// Returns the translate descriptor. Aliases delegate to the source.
        /// </summary>
        internal ComponentTranslate Translate()
        {
            if (_source is not null)
            {
                return _source.Translate();
            }

            return _translate ??= new ComponentTranslate(
                JsonRead.Obj(_data, "translate") ?? new JsonObject());
        }

        /// <summary>
        /// Returns a name to <see cref="ComponentVariant"/> map for all defined
        /// variants, in definition order. Aliases delegate to the source
        /// component's variants.
        /// </summary>
        internal OrderedMap<ComponentVariant> Variants()
        {
            if (_source is not null)
            {
                return _source.Variants();
            }

            if (_variants is not null)
            {
                return _variants;
            }

            var map = new OrderedMap<ComponentVariant>();
            var variants = JsonRead.Obj(_data, "variants");

            if (variants is not null)
            {
                foreach (var entry in variants)
                {
                    if (entry.Value is JsonObject obj)
                    {
                        map.Set(entry.Key, new ComponentVariant(obj));
                    }
                }
            }

            return _variants = map;
        }
    }
}
