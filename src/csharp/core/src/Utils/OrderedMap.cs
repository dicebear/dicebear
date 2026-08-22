using System;
using System.Collections;
using System.Collections.Generic;

namespace DiceBear.Internal
{
    /// <summary>
    /// An insertion-ordered string-keyed map, the equivalent of the JavaScript
    /// <c>Map</c> the reference builds its component, variant, color and
    /// <c>&lt;defs&gt;</c> collections from.
    /// </summary>
    /// <remarks>
    /// Order is part of the contract: components and variants are rendered in
    /// definition order, and <c>&lt;defs&gt;</c> entries are emitted in the
    /// order they were registered. Re-setting an existing key overwrites the
    /// value and keeps the original position, matching <c>Map.set</c>.
    /// </remarks>
    internal sealed class OrderedMap<TValue> : IEnumerable<KeyValuePair<string, TValue>>
    {
        private readonly List<string> _keys = new List<string>();
        private readonly Dictionary<string, TValue> _values =
            new Dictionary<string, TValue>(StringComparer.Ordinal);

        internal int Count => _keys.Count;

        internal IReadOnlyList<string> Keys => _keys;

        internal IEnumerable<TValue> Values
        {
            get
            {
                foreach (var key in _keys)
                {
                    yield return _values[key];
                }
            }
        }

        internal bool ContainsKey(string key) => _values.ContainsKey(key);

        internal bool TryGetValue(string key, out TValue value) => _values.TryGetValue(key, out value!);

        internal void Set(string key, TValue value)
        {
            if (!_values.ContainsKey(key))
            {
                _keys.Add(key);
            }

            _values[key] = value;
        }

        public IEnumerator<KeyValuePair<string, TValue>> GetEnumerator()
        {
            foreach (var key in _keys)
            {
                yield return new KeyValuePair<string, TValue>(key, _values[key]);
            }
        }

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}
