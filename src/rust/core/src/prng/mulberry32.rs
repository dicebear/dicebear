/// 2^32, the divisor that maps a `u32` into the half-open interval `[0, 1)`.
const UINT32_MAX_PLUS_1: f64 = 4_294_967_296.0;

/// Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
///
/// C original:
/// ```c
/// uint32_t z = (x += 0x6D2B79F5UL);
/// z = (z ^ (z >> 15)) * (z | 1UL);
/// z ^= z + (z ^ (z >> 7)) * (z | 61UL);
/// return z ^ (z >> 14);
/// ```
///
/// All arithmetic is unsigned 32-bit; `wrapping_*` and the logical `>>` on
/// `u32` reproduce the JS `Math.imul` / `>>>` / `| 0` behavior exactly.
///
/// See <https://gist.github.com/tommyettinger/46a874533244883189143505d203312c>
pub struct Mulberry32 {
    state: u32,
}

impl Mulberry32 {
    pub fn new(seed: u32) -> Self {
        Self { state: seed }
    }

    /// Advances the state and returns the next unsigned 32-bit value.
    #[allow(clippy::should_implement_trait)]
    pub fn next(&mut self) -> u32 {
        let z = self.state.wrapping_add(0x6d2b_79f5);
        self.state = z;

        let mut t = (z ^ (z >> 15)).wrapping_mul(z | 1);
        t ^= t.wrapping_add((t ^ (t >> 7)).wrapping_mul(t | 61));

        t ^ (t >> 14)
    }

    /// Advances the state and returns the next value in `[0, 1)`.
    pub fn next_float(&mut self) -> f64 {
        f64::from(self.next()) / UINT32_MAX_PLUS_1
    }

    /// Returns the current internal state as a signed 32-bit value, matching
    /// the JS reference where the state is stored via `| 0`. Only exercised by
    /// the parity tests today, but kept as part of the faithful primitive.
    #[allow(dead_code)]
    pub fn state(&self) -> i32 {
        self.state as i32
    }
}
