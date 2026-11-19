package text

import (
	"encoding/hex"
	"encoding/json"
	"reflect"
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

type named string

type marshals struct{}

func (marshals) MarshalJSON() ([]byte, error) { return []byte(`"kept"`), nil }

func TestWellFormedValueWalksKeysValuesAndItems(t *testing.T) {
	bad := "a\xffb"
	ptr := bad

	got := WellFormedValue(map[string]any{
		"k\xff":  []string{bad},
		"nested": map[string]any{"x": []any{bad, 1.5, true, nil}},
		"named":  named(bad),
		"ptr":    &ptr,
		"number": json.Number("12"),
		"bytes":  []byte{0xff},
		"custom": marshals{},
	})

	want := map[string]any{
		"k�":     []any{"a�b"},
		"nested": map[string]any{"x": []any{"a�b", 1.5, true, nil}},
		"named":  "a�b",
		"ptr":    "a�b",
		"number": json.Number("12"),
		"bytes":  []byte{0xff},
		"custom": marshals{},
	}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("WellFormedValue = %#v\nwant %#v", got, want)
	}
}

func TestWellFormedValueLeavesTheInputUntouched(t *testing.T) {
	list := []string{"a\xff"}
	input := map[string]any{"list": list}

	WellFormedValue(input)

	if list[0] != "a\xff" {
		t.Errorf("input changed: %q", list[0])
	}
}
