using System;
using System.Collections.Generic;
using System.Linq;

namespace DiceBear.Internal
{
    /// <summary>
    /// Key-based pseudorandom number generator.
    /// </summary>
    /// <remarks>
    /// Each method takes a key that, combined with the seed, produces a
    /// deterministic value. The same seed and key always yield the same
    /// result, regardless of call order.
    /// </remarks>
    internal sealed class Prng
    {
        private readonly string _seed;

        internal Prng(string seed) => _seed = seed;

        /// <summary>
        /// Returns a single value in [0, 1) derived from <c>seed:key</c>. The
        /// same seed and key pair always produces the same value.
        /// </summary>
        internal double GetValue(string key) =>
            new Mulberry32(Fnv1a.Hash(_seed + ":" + key)).NextDouble();

        /// <summary>
        /// Picks a single item from <paramref name="items"/> deterministically.
        /// Returns <see langword="null"/> for an empty list.
        /// </summary>
        /// <remarks>
        /// Duplicate values (by string representation) are collapsed before
        /// picking so that input order and duplication do not affect the
        /// result.
        /// </remarks>
        internal string? Pick(string key, IReadOnlyList<string> items) =>
            Pick(key, items, item => item);

        /// <summary>
        /// <see cref="Pick(string, IReadOnlyList{string})"/> for numeric
        /// options such as <c>fontWeight</c>, whose sort key is the
        /// JavaScript string form of the number.
        /// </summary>
        internal double? Pick(string key, IReadOnlyList<double> items) =>
            Pick(key, items, Num.JsString);

        /// <summary>
        /// Picks a key from <paramref name="weights"/> proportional to its
        /// weight. When all weights are zero, falls back to an unweighted
        /// <see cref="Pick(string, IReadOnlyList{string})"/>. Returns
        /// <see langword="null"/> for an empty map.
        /// </summary>
        internal string? WeightedPick(string key, OrderedMap<double> weights)
        {
            if (weights.Count == 0)
            {
                return null;
            }

            if (weights.Count == 1)
            {
                return weights.Keys[0];
            }

            var sorted = Sorted(weights.Keys, name => name);

            // Sum in sorted-key order to match the reference's reduce over the
            // sorted list: float addition is non-associative, so insertion
            // order would diverge.
            var totalWeight = 0.0;

            foreach (var name in sorted)
            {
                weights.TryGetValue(name, out var weight);
                totalWeight += weight;
            }

            if (totalWeight == 0.0)
            {
                return Pick(key, sorted);
            }

            var threshold = GetValue(key) * totalWeight;
            var cumulative = 0.0;

            foreach (var name in sorted)
            {
                weights.TryGetValue(name, out var weight);
                cumulative += weight;

                if (threshold < cumulative)
                {
                    return name;
                }
            }

            return sorted[sorted.Count - 1];
        }

        /// <summary>
        /// Returns <see langword="true"/> with the given probability (0–100,
        /// default 50).
        /// </summary>
        internal bool Bool(string key, double likelihood = 50.0) =>
            GetValue(key) * 100.0 < likelihood;

        /// <summary>
        /// Returns a deterministic value in <paramref name="range"/>, rounded
        /// to four decimal places.
        /// </summary>
        /// <remarks>
        /// With <c>range.Step &gt; 0</c>, the result is drawn uniformly from
        /// <c>{ min + i*step | 0 ≤ i ≤ floor((max - min) / step) }</c>, so both
        /// endpoints of an evenly-divisible range are equally likely. A
        /// non-positive or absent step means continuous. Min and max are
        /// sorted internally, so a reversed pair is tolerated.
        /// </remarks>
        internal double Float(string key, NumberRange range)
        {
            var min = Math.Min(range.Min, range.Max);
            var max = Math.Max(range.Min, range.Max);
            var step = range.Step ?? 0.0;
            double value;

            if (step > 0.0)
            {
                var buckets = Math.Floor((max - min) / step) + 1.0;
                var i = Math.Floor(GetValue(key) * buckets);

                value = min + (i * step);
            }
            else
            {
                value = min + (GetValue(key) * (max - min));
            }

            return Num.RoundHalfUp(value * 10000.0) / 10000.0;
        }

        /// <summary>
        /// Returns a deterministic integer in <paramref name="range"/>. Min and
        /// max are sorted internally, so a reversed pair is tolerated.
        /// <c>range.Step</c> is accepted for symmetry with
        /// <see cref="Float"/> but ignored — integers already step by 1.
        /// </summary>
        internal int Integer(string key, NumberRange range)
        {
            var min = Math.Min(range.Min, range.Max);
            var max = Math.Max(range.Min, range.Max);

            return (int)(Math.Floor(GetValue(key) * (max - min + 1.0)) + min);
        }

        /// <summary>
        /// Fisher-Yates shuffle with chained Mulberry32 state.
        /// </summary>
        /// <remarks>
        /// Duplicate values are collapsed before shuffling, so a caller's slice
        /// off the front cannot accidentally produce a repeated value.
        /// </remarks>
        internal IReadOnlyList<string> Shuffle(string key, IReadOnlyList<string> items)
        {
            if (items.Count <= 1)
            {
                return items.ToList();
            }

            var result = Sorted(UniqueByCodePoint(items, item => item), item => item).ToList();
            var prng = new Mulberry32(Fnv1a.Hash(_seed + ":" + key));

            for (var i = result.Count - 1; i > 0; i--)
            {
                var j = (int)Math.Floor(prng.NextDouble() * (i + 1));
                var temp = result[i];

                result[i] = result[j];
                result[j] = temp;
            }

            return result;
        }

        private T? Pick<T>(string key, IReadOnlyList<T> items, Func<T, string> toStr)
            where T : struct
        {
            var picked = PickCore(items, key, toStr);

            return picked.Length == 0 ? (T?)null : picked[0];
        }

        private string? Pick(string key, IReadOnlyList<string> items, Func<string, string> toStr)
        {
            var picked = PickCore(items, key, toStr);

            return picked.Length == 0 ? null : picked[0];
        }

        /// <summary>
        /// The body both <c>Pick</c> overloads share, returning either an empty
        /// array (no item) or a single-element one.
        /// </summary>
        private T[] PickCore<T>(IReadOnlyList<T> items, string key, Func<T, string> toStr)
        {
            if (items.Count == 0)
            {
                return Array.Empty<T>();
            }

            if (items.Count == 1)
            {
                return new[] { items[0] };
            }

            var unique = UniqueByCodePoint(items, toStr);

            if (unique.Count == 1)
            {
                return new[] { unique[0] };
            }

            var sorted = Sorted(unique, toStr);
            var index = (int)Math.Floor(GetValue(key) * sorted.Count);

            return new[] { sorted[index] };
        }

        /// <summary>
        /// Cross-language deterministic sort: compare by the UTF-16 code units
        /// of the string representation, which is what the reference's
        /// <c>&lt;</c> comparison on strings does.
        /// </summary>
        /// <remarks>
        /// <see cref="Enumerable.OrderBy{TSource, TKey}(IEnumerable{TSource},
        /// Func{TSource, TKey}, IComparer{TKey})"/> is a stable sort, like
        /// <c>Array.prototype.sort</c>. The input is deduplicated by the same
        /// key first, so the two agree either way, but a stable sort keeps that
        /// true if the deduplication ever changes.
        /// </remarks>
        private static IReadOnlyList<T> Sorted<T>(IReadOnlyList<T> items, Func<T, string> toStr) =>
            items.OrderBy(toStr, StringComparer.Ordinal).ToList();

        /// <summary>
        /// Deduplicates by string representation, keeping the first
        /// occurrence, so that every port collapses the same set of inputs.
        /// </summary>
        private static IReadOnlyList<T> UniqueByCodePoint<T>(
            IReadOnlyList<T> items,
            Func<T, string> toStr)
        {
            var seen = new HashSet<string>(StringComparer.Ordinal);
            var result = new List<T>(items.Count);

            foreach (var item in items)
            {
                if (seen.Add(toStr(item)))
                {
                    result.Add(item);
                }
            }

            return result;
        }
    }
}
