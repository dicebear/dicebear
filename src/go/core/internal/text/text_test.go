package text

import (
	"encoding/hex"
	"testing"
)

func TestWellFormedLeavesValidUTF8AsItIs(t *testing.T) {
	for _, s := range []string{"", "abc", "Zoë", "日本語", "\U0001F600", "a�b"} {
		if got := WellFormed(s); got != s {
			t.Errorf("WellFormed(%q) = %q", s, got)
		}
	}
}

// One U+FFFD per maximal subpart, as the Unicode Standard recommends and
// TextDecoder does. The expectations were taken from TextDecoder.
func TestWellFormedReplacesMaximalSubparts(t *testing.T) {
	cases := []struct {
		hex  string
		want string
	}{
		{"e28241", "�A"},
		{"eda0bd", "���"},
		{"c0af", "��"},
		{"f4908080", "����"},
		{"f09f98", "�"},
		{"80", "�"},
		{"ff", "�"},
		{"e228a1", "�(�"},
		{"f0808080", "����"},
		{"61eda0bd62", "a���b"},
		{"e0a0", "�"},
		{"e080", "��"},
		{"f48f", "�"},
		{"c2", "�"},
		{"f09f986141", "�aA"},
	}

	for _, c := range cases {
		raw, err := hex.DecodeString(c.hex)
		if err != nil {
			t.Fatal(err)
		}

		if got := WellFormed(string(raw)); got != c.want {
			t.Errorf("WellFormed(%s) = %q, want %q", c.hex, got, c.want)
		}
	}
}
