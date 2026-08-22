// Package num holds the numeric helpers shared by the PRNG and the renderer:
// SVG number formatting and the JavaScript-compatible half-up rounding the rest
// of the engine depends on for cross-language parity.
package num

import (
	"math"
	"strconv"
	"strings"
)

// Format formats a number for SVG output, rounded to at most 5 decimal places.
//
// Rounding to a fixed precision keeps the output bounded and identical across
// every port: every value becomes a multiple of 1e-5, which has no exponential
// form, so the result is built from integer arithmetic with no locale- or
// language-specific float stringifying.
func Format(value float64) string {
	if math.IsNaN(value) {
		return "NaN"
	}
	if math.IsInf(value, 1) {
		return "Infinity"
	}
	if math.IsInf(value, -1) {
		return "-Infinity"
	}

	scaled := int64(RoundHalfUp(value * 100000.0))
	sign := ""
	if scaled < 0 {
		sign = "-"
		scaled = -scaled
	}

	integerPart := scaled / 100000
	fraction := strings.TrimRight(pad5(scaled%100000), "0")

	if fraction == "" {
		return sign + strconv.FormatInt(integerPart, 10)
	}

	return sign + strconv.FormatInt(integerPart, 10) + "." + fraction
}

// RoundHalfUp rounds half toward +∞, matching JavaScript's Math.round. Go's
// math.Round rounds half away from zero, and the naive math.Floor(x + 0.5)
// over-rounds the largest double below 0.5; comparing the fractional part
// against 0.5 reproduces Math.round exactly.
//
// go:noinline is load-bearing for parity: the Go spec lets the compiler fuse a
// multiply in the caller (e.g. value*100000.0) with the subtraction below into
// a single FMA, computing the product at extended precision. That makes an
// exact half such as 1.999995*100000 == 199999.5 never materialize, diverging
// from JS/Rust which round per operation. Forbidding inlining forces the
// argument to be rounded to float64 at the call boundary.
//
//go:noinline
func RoundHalfUp(value float64) float64 {
	floor := math.Floor(value)

	if value-floor < 0.5 {
		return floor
	}

	return floor + 1.0
}

// pad5 left-pads a non-negative integer with zeros to five digits.
func pad5(n int64) string {
	s := strconv.FormatInt(n, 10)
	if len(s) < 5 {
		s = strings.Repeat("0", 5-len(s)) + s
	}
	return s
}
