package render

import (
	"reflect"
	"testing"
)

func TestWellFormedTextReplacesTheSeedAndTheTitle(t *testing.T) {
	got := wellFormedText(map[string]any{"seed": "Jo\xf0\x9f\x98", "title": "a\xffb", "size": 64})
	want := map[string]any{"seed": "Jo\ufffd", "title": "a\ufffdb", "size": 64}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("wellFormedText = %#v, want %#v", got, want)
	}
}

func TestWellFormedTextLeavesTheCallersMapAsItIs(t *testing.T) {
	input := map[string]any{"seed": "a\xff"}

	wellFormedText(input)

	if input["seed"] != "a\xff" {
		t.Errorf("input changed: %q", input["seed"])
	}
}

// wellFormedText returns the caller's own map when there is nothing to replace.
func TestWellFormedTextHandsBackWellFormedOptions(t *testing.T) {
	input := map[string]any{"seed": "Zoë", "title": "\U0001F600"}
	got := wellFormedText(input)

	if reflect.ValueOf(got).Pointer() != reflect.ValueOf(input).Pointer() {
		t.Error("well-formed options were copied")
	}
}

// Only a value of type string is replaced. Anything else is left to
// json.Marshal and the validator, and a nil map comes back as an empty one.
func TestWellFormedTextLeavesOtherValuesAlone(t *testing.T) {
	input := map[string]any{"seed": 5, "title": []string{"a\xff"}}

	if got := wellFormedText(input); !reflect.DeepEqual(got, input) {
		t.Errorf("wellFormedText = %#v", got)
	}

	if got := wellFormedText(nil); got == nil || len(got) != 0 {
		t.Errorf("wellFormedText(nil) = %#v", got)
	}
}
