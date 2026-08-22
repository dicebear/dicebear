using System.Runtime.CompilerServices;

// The parity suites exercise the primitives the shared fixtures pin (FNV-1a,
// Mulberry32, the keyed PRNG, number formatting, initials), which are
// implementation details rather than public API. The other ports reach them the
// same way: Go through package-internal tests, Rust through `pub(crate)`.
[assembly: InternalsVisibleTo("DiceBear.Core.Tests")]
