package prng

// uint32MaxPlus1 is 2^32, the divisor that maps a uint32 into [0, 1).
const uint32MaxPlus1 = 4294967296.0

// Mulberry32 is a stateful PRNG matching the C reference by Tommy Ettinger.
//
// C original:
//
//	uint32_t z = (x += 0x6D2B79F5UL);
//	z = (z ^ (z >> 15)) * (z | 1UL);
//	z ^= z + (z ^ (z >> 7)) * (z | 61UL);
//	return z ^ (z >> 14);
//
// All arithmetic is unsigned 32-bit; Go's wrapping uint32 ops and logical >>
// reproduce the JS Math.imul / >>> / | 0 behavior exactly.
//
// See https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
type Mulberry32 struct {
	state uint32
}

func NewMulberry32(seed uint32) *Mulberry32 {
	return &Mulberry32{state: seed}
}

// Next advances the state and returns the next unsigned 32-bit value.
func (m *Mulberry32) Next() uint32 {
	z := m.state + 0x6d2b79f5
	m.state = z

	t := (z ^ (z >> 15)) * (z | 1)
	t ^= t + (t^(t>>7))*(t|61)

	return t ^ (t >> 14)
}

// NextFloat advances the state and returns the next value in [0, 1).
func (m *Mulberry32) NextFloat() float64 {
	return float64(m.Next()) / uint32MaxPlus1
}

// SignedState returns the current internal state as a signed 32-bit value,
// matching the JS reference where the state is stored via | 0. Exercised by the
// parity tests.
func (m *Mulberry32) SignedState() int32 {
	return int32(m.state)
}
