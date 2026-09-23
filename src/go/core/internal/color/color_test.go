package color

import (
	"math"
	"reflect"
	"testing"
)

func TestNormalizesHex(t *testing.T) {
	cases := []struct{ in, want string }{
		{"#ABC", "#aabbcc"},
		{"abcd", "#aabbccdd"},
		{"#A1B2C3", "#a1b2c3"},
	}
	for _, c := range cases {
		if got := ToHex(c.in); got != c.want {
			t.Errorf("ToHex(%q) = %q, want %q", c.in, got, c.want)
		}
	}
	if got := ToRGBHex("#aabbccdd"); got != "#aabbcc" {
		t.Errorf("ToRGBHex(#aabbccdd) = %q, want #aabbcc", got)
	}
}

func TestParsesChannels(t *testing.T) {
	if r, g, b := ParseHex("#ff8000"); r != 255 || g != 128 || b != 0 {
		t.Errorf("ParseHex(#ff8000) = %d,%d,%d", r, g, b)
	}
	if r, g, b := ParseHex("#fff"); r != 255 || g != 255 || b != 255 {
		t.Errorf("ParseHex(#fff) = %d,%d,%d", r, g, b)
	}
}

func TestLuminanceEndpoints(t *testing.T) {
	if got := Luminance("#000000"); got != 0.0 {
		t.Errorf("Luminance(#000000) = %v, want 0", got)
	}
	if got := Luminance("#ffffff"); math.Abs(got-1.0) > 1e-9 {
		t.Errorf("Luminance(#ffffff) = %v, want ~1", got)
	}
}

func TestSortsByContrastDescending(t *testing.T) {
	got := SortByContrast([]string{"#808080", "#ffffff", "#000000"}, "#000000")
	want := []string{"#ffffff", "#808080", "#000000"}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("SortByContrast = %v, want %v", got, want)
	}
}

func TestFiltersExcludedAndFallsBack(t *testing.T) {
	candidates := []string{"#ff0000", "#00ff00"}

	if got := FilterNotEqualTo(candidates, []string{"#ff0000"}); !reflect.DeepEqual(got, []string{"#00ff00"}) {
		t.Errorf("FilterNotEqualTo = %v, want [#00ff00]", got)
	}
	// Excluding everything falls back to the original candidates.
	if got := FilterNotEqualTo(candidates, []string{"#ff0000", "#00ff00"}); !reflect.DeepEqual(got, candidates) {
		t.Errorf("FilterNotEqualTo (all excluded) = %v, want %v", got, candidates)
	}
}
