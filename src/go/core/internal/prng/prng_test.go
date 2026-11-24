package prng

import (
	"math"
	"testing"
)

// int() of a float past the int range is undefined in Go. A stop count of
// 1e19 used to come back as MinInt64 and drop the whole gradient.
func TestIntegerClampsABoundPastTheIntRange(t *testing.T) {
	p := New("test")

	if got := p.Integer("key", &Range{Min: 1e19, Max: 1e19}); got != math.MaxInt32 {
		t.Fatalf("Integer(1e19, 1e19) = %d, want %d", got, math.MaxInt32)
	}

	if got := p.Integer("key", &Range{Min: 2, Max: 1e300}); got < 2 {
		t.Fatalf("Integer(2, 1e300) = %d, want at least 2", got)
	}
}
