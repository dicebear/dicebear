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

type pointerMarshals struct{ V string }

func (*pointerMarshals) MarshalJSON() ([]byte, error) { return []byte(`"kept"`), nil }

type pointerText string

func (*pointerText) MarshalText() ([]byte, error) { return []byte("kept"), nil }

type holder struct {
	Inner pointerMarshals
	Name  string
}

// encoding/json calls a marshaler declared on the pointer only for a value it
// can take the address of. The walk must not change which values those are.
func TestWellFormedValueEncodesWellFormedInputAsBefore(t *testing.T) {
	array := [2]pointerMarshals{{"a"}, {"b"}}
	value := pointerMarshals{"v"}

	inputs := map[string]any{
		"slice":           []pointerMarshals{{"x"}},
		"pointerToSlice":  &[]pointerMarshals{{"x"}},
		"pointerToArray":  &array,
		"array":           array,
		"textSlice":       []pointerText{"x"},
		"structSlice":     []holder{{Name: "n"}},
		"pointerToStruct": &holder{Name: "n"},
		"nestedSlices":    [][]pointerMarshals{{{"x"}}},
		"sliceOfArrays":   [][1]pointerMarshals{{{"x"}}},
		"value":           value,
		"mapValue":        map[string]pointerMarshals{"k": {"x"}},
		"interfaceItems":  []any{value, pointerText("x"), holder{Name: "n"}},
		"plain":           map[string]any{"a": []string{"x"}, "b": []float64{1.5}, "c": []*string{nil}},
	}

	for name, input := range inputs {
		want, err := json.Marshal(input)
		if err != nil {
			t.Fatal(err)
		}

		got, err := json.Marshal(WellFormedValue(input))
		if err != nil {
			t.Fatal(err)
		}

		if string(got) != string(want) {
			t.Errorf("%s: got %s, want %s", name, got, want)
		}
	}
}

// A value that refers to itself more than once must not multiply the walk;
// json.Marshal still reports the cycle.
func TestWellFormedValueStopsAtACycle(t *testing.T) {
	m := map[string]any{"seed": "a\xff"}
	m["a"] = m
	m["b"] = m

	list := make([]any, 2)
	list[0] = list
	list[1] = list

	for name, input := range map[string]any{"map": m, "slice": list} {
		got := WellFormedValue(input)

		if _, err := json.Marshal(got); err == nil {
			t.Errorf("%s: json.Marshal reported no cycle", name)
		}
	}

	if got := WellFormedValue(m).(map[string]any)["seed"]; got != "a�" {
		t.Errorf("seed = %q", got)
	}
}

// The same map or slice in two places is not a cycle and is walked both times.
func TestWellFormedValueWalksASharedValueTwice(t *testing.T) {
	shared := []string{"a\xff"}

	got := WellFormedValue(map[string]any{"x": shared, "y": shared})
	want := map[string]any{"x": []any{"a�"}, "y": []any{"a�"}}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("WellFormedValue = %#v", got)
	}
}
