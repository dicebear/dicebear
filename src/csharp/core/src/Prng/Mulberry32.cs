namespace DiceBear.Internal
{
    /// <summary>
    /// Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
    /// </summary>
    /// <remarks>
    /// <para>
    /// C original:
    /// <code>
    /// uint32_t z = (x += 0x6D2B79F5UL);
    /// z = (z ^ (z >> 15)) * (z | 1UL);
    /// z ^= z + (z ^ (z >> 7)) * (z | 61UL);
    /// return z ^ (z >> 14);
    /// </code>
    /// </para>
    /// <para>
    /// All arithmetic is unsigned 32-bit; unchecked <c>uint</c> operations and
    /// the logical right shift reproduce the reference's <c>Math.imul</c>,
    /// <c>&gt;&gt;&gt;</c> and <c>| 0</c> behavior exactly.
    /// </para>
    /// <para>
    /// See https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
    /// </para>
    /// </remarks>
    internal sealed class Mulberry32
    {
        /// <summary>
        /// 2^32, the divisor that maps a <c>uint</c> into [0, 1).
        /// </summary>
        private const double Uint32MaxPlus1 = 4294967296.0;

        private uint _state;

        internal Mulberry32(uint seed) => _state = seed;

        /// <summary>
        /// Advances the state and returns the next unsigned 32-bit value.
        /// </summary>
        internal uint Next()
        {
            unchecked
            {
                var z = _state + 0x6d2b79f5u;

                _state = z;

                var t = (z ^ (z >> 15)) * (z | 1u);

                t ^= t + ((t ^ (t >> 7)) * (t | 61u));

                return t ^ (t >> 14);
            }
        }

        /// <summary>
        /// Advances the state and returns the next value in [0, 1).
        /// </summary>
        internal double NextDouble() => Next() / Uint32MaxPlus1;

        /// <summary>
        /// Returns the current internal state as a signed 32-bit value,
        /// matching the reference, where the state is stored via <c>| 0</c>.
        /// Exercised by the parity tests.
        /// </summary>
        internal int SignedState()
        {
            unchecked
            {
                return (int)_state;
            }
        }
    }
}
