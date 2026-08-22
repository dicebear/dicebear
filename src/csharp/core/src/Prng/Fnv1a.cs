using System.Globalization;

namespace DiceBear.Internal
{
    /// <summary>
    /// FNV-1a 32-bit hash. Offset basis: 0x811c9dc5, prime: 0x01000193.
    /// </summary>
    /// <remarks>
    /// See https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
    /// </remarks>
    internal static class Fnv1a
    {
        /// <summary>
        /// Returns the unsigned 32-bit FNV-1a hash of <paramref name="input"/>.
        /// </summary>
        /// <remarks>
        /// A .NET string is a sequence of UTF-16 code units, so iterating its
        /// chars is exactly what <c>charCodeAt</c> yields in the reference, and
        /// the hash is identical across the ports even for non-ASCII or non-BMP
        /// seeds. Unchecked <c>uint</c> arithmetic wraps on overflow,
        /// reproducing <c>Math.imul</c> and <c>&gt;&gt;&gt; 0</c>.
        /// </remarks>
        internal static uint Hash(string input)
        {
            var hash = 0x811c9dc5u;

            unchecked
            {
                foreach (var code in input)
                {
                    hash ^= code;
                    hash *= 0x01000193u;
                }
            }

            return hash;
        }

        /// <summary>
        /// Returns the FNV-1a hash of <paramref name="input"/> as an
        /// 8-character lowercase hex string.
        /// </summary>
        internal static string Hex(string input) =>
            Hash(input).ToString("x8", CultureInfo.InvariantCulture);
    }
}
