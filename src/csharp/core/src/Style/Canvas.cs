using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;

namespace DiceBear.Internal
{
    /// <summary>
    /// Read-only view over a style definition's <c>canvas</c> block, exposing
    /// the drawing area dimensions and the top-level element list.
    /// </summary>
    internal sealed class Canvas
    {
        private readonly JsonObject _data;

        private IReadOnlyList<Element>? _elements;

        internal Canvas(JsonObject data) => _data = data;

        /// <summary>
        /// Returns the canvas width — the <c>width</c> value of the SVG
        /// <c>viewBox</c>.
        /// </summary>
        internal double Width() => JsonRead.Num(_data, "width") ?? 0.0;

        /// <summary>
        /// Returns the canvas height — the <c>height</c> value of the SVG
        /// <c>viewBox</c>.
        /// </summary>
        internal double Height() => JsonRead.Num(_data, "height") ?? 0.0;

        /// <summary>
        /// Returns the top-level elements rendered onto the canvas, lazily
        /// wrapped as <see cref="Element"/> instances on first access.
        /// </summary>
        internal IReadOnlyList<Element> Elements()
        {
            if (_elements is not null)
            {
                return _elements;
            }

            var array = JsonRead.Arr(_data, "elements");

            if (array is null)
            {
                return _elements = Array.Empty<Element>();
            }

            var result = new List<Element>(array.Count);

            foreach (var element in array)
            {
                if (element is JsonObject obj)
                {
                    result.Add(new Element(obj));
                }
            }

            return _elements = result;
        }
    }
}
