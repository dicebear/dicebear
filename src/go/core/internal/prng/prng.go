// Package prng is the key-based pseudorandom number generator and its
// primitives (FNV-1a, Mulberry32). Each method takes a key that, combined with
// the seed, produces a deterministic value: the same seed + key always yields
// the same result, regardless of call order.
package prng

import (
	"math"
	"sort"
	"strconv"
	"unicode/utf16"

	"github.com/dicebear/dicebear-go/v10/internal/num"
)

// Range is a closed numeric range. Min == Max is a fixed value. Step quantizes
// the range to multiples of Step starting at Min; a nil or non-positive step
// means continuous. It mirrors the Range type every port shares.
type Range struct {
	Min  float64  `json:"min"`
	Max  float64  `json:"max"`
	Step *float64 `json:"step"`
}

// Prng is a key-based pseudorandom number generator.
type Prng struct {
	seed string
}

func New(seed string) *Prng {
	return &Prng{seed: seed}
}

// GetValue returns a single float in [0, 1) derived from "seed:key".
func (p *Prng) GetValue(key string) float64 {
	return NewMulberry32(Hash(p.seed + ":" + key)).NextFloat()
}

// Pick picks a single item from items deterministically. ok is false for an
// empty slice. Duplicate values (by toStr) are collapsed before picking, so
// input order and duplication do not affect the result.
func Pick[T any](p *Prng, key string, items []T, toStr func(T) string) (T, bool) {
	var zero T

	if len(items) == 0 {
		return zero, false
	}
	if len(items) == 1 {
		return items[0], true
	}

	unique := uniqueBy(items, toStr)
	if len(unique) == 1 {
		return unique[0], true
	}

	sort.SliceStable(unique, func(i, j int) bool {
		return cmpUTF16(toStr(unique[i]), toStr(unique[j])) < 0
	})

	index := int(math.Floor(p.GetValue(key) * float64(len(unique))))
	return unique[index], true
}

// WeightedPick picks a key from weights proportional to its weight. When all
// weights are zero, it falls back to an unweighted pick. ok is false for an
// empty map.
func (p *Prng) WeightedPick(key string, weights map[string]float64) (string, bool) {
	if len(weights) == 0 {
		return "", false
	}
	if len(weights) == 1 {
		for k := range weights {
			return k, true
		}
	}

	keys := make([]string, 0, len(weights))
	for k := range weights {
		keys = append(keys, k)
	}
	sort.SliceStable(keys, func(i, j int) bool {
		return cmpUTF16(keys[i], keys[j]) < 0
	})

	// Sum in sorted-key order to match the JS reduce-over-sorted parity: float
	// addition is non-associative, so insertion order would diverge.
	totalWeight := 0.0
	for _, k := range keys {
		totalWeight += weights[k]
	}

	if totalWeight == 0.0 {
		return Pick(p, key, keys, identity)
	}

	threshold := p.GetValue(key) * totalWeight
	cumulative := 0.0

	for _, k := range keys {
		cumulative += weights[k]
		if threshold < cumulative {
			return k, true
		}
	}

	return keys[len(keys)-1], true
}

// Bool returns true with the given probability (0–100).
func (p *Prng) Bool(key string, likelihood float64) bool {
	return p.GetValue(key)*100.0 < likelihood
}

// Float returns a deterministic float in range, rounded to four decimal places.
// With Step > 0 the result is drawn uniformly from the quantized buckets; a
// non-positive or absent step means continuous. Min/Max are sorted internally.
func (p *Prng) Float(key string, r *Range) float64 {
	min := math.Min(r.Min, r.Max)
	max := math.Max(r.Min, r.Max)
	step := 0.0
	if r.Step != nil {
		step = *r.Step
	}

	var value float64
	if step > 0 {
		buckets := math.Floor((max-min)/step) + 1
		i := math.Floor(p.GetValue(key) * buckets)
		value = min + i*step
	} else {
		value = min + p.GetValue(key)*(max-min)
	}

	return num.RoundHalfUp(value*10000.0) / 10000.0
}

// Integer returns a deterministic integer in range. Range.Step is ignored —
// integers already step by 1. Min/Max are sorted internally.
func (p *Prng) Integer(key string, r *Range) int {
	min := math.Min(r.Min, r.Max)
	max := math.Max(r.Min, r.Max)

	return int(math.Floor(p.GetValue(key)*(max-min+1)) + min)
}

// Shuffle is a Fisher-Yates shuffle with chained Mulberry32 state. Duplicate
// values are collapsed before shuffling.
func (p *Prng) Shuffle(key string, items []string) []string {
	if len(items) <= 1 {
		return append([]string(nil), items...)
	}

	unique := uniqueBy(items, identity)
	sort.SliceStable(unique, func(i, j int) bool {
		return cmpUTF16(unique[i], unique[j]) < 0
	})
	result := append([]string(nil), unique...)

	m := NewMulberry32(Hash(p.seed + ":" + key))

	for i := len(result) - 1; i > 0; i-- {
		j := int(math.Floor(m.NextFloat() * float64(i+1)))
		result[i], result[j] = result[j], result[i]
	}

	return result
}

// NumString stringifies a number the way JS String() does for the values that
// reach Pick here (component weights are integers): a whole number has no
// decimal point. Exported so callers can pass it as the Pick key function.
func NumString(f float64) string {
	// 'f' (not int64(f)) renders whole numbers as a full decimal without an
	// exponent and without overflowing int64 for values in [2^63, 1e21) — JS
	// String(1e20) is "100000000000000000000", not "9223372036854775807".
	if !math.IsInf(f, 0) && f == math.Trunc(f) && math.Abs(f) < 1e21 {
		return strconv.FormatFloat(f, 'f', -1, 64)
	}
	return strconv.FormatFloat(f, 'g', -1, 64)
}

// cmpUTF16 compares two strings by their UTF-16 code units, matching the JS
// reference's compareByCodePoint (JS string `<` compares code units). It agrees
// with Go's byte ordering for all BMP text and differs only for
// supplementary-plane characters, where UTF-16 and code-point order disagree.
func cmpUTF16(a, b string) int {
	ua := utf16.Encode([]rune(a))
	ub := utf16.Encode([]rune(b))

	n := len(ua)
	if len(ub) < n {
		n = len(ub)
	}
	for i := 0; i < n; i++ {
		if ua[i] != ub[i] {
			if ua[i] < ub[i] {
				return -1
			}
			return 1
		}
	}

	switch {
	case len(ua) < len(ub):
		return -1
	case len(ua) > len(ub):
		return 1
	default:
		return 0
	}
}

// uniqueBy deduplicates by string representation, keeping the first occurrence.
func uniqueBy[T any](items []T, toStr func(T) string) []T {
	seen := make(map[string]struct{}, len(items))
	out := make([]T, 0, len(items))

	for _, it := range items {
		k := toStr(it)
		if _, ok := seen[k]; !ok {
			seen[k] = struct{}{}
			out = append(out, it)
		}
	}

	return out
}

// identity is the toStr for string slices.
func identity(s string) string { return s }
