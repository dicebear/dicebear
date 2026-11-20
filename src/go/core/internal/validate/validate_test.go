package validate

import (
	"encoding/json"
	"strings"
	"testing"
)

// definitionWithFill builds the smallest definition that carries value in a
// root attribute, which is where the filteredString patterns of the schema
// apply.
func definitionWithFill(t *testing.T, value string) []byte {
	t.Helper()

	def := map[string]any{
		"canvas":     map[string]any{"width": 100, "height": 100, "elements": []any{}},
		"attributes": map[string]any{"fill": value},
	}

	raw, err := json.Marshal(def)
	if err != nil {
		t.Fatalf("marshal definition: %v", err)
	}

	return raw
}

// separators holds the characters definition.json allows between a scheme or a
// function name and what follows it. The schema spells the class out as
// [ \t\n\f\r], so every regex engine reads it the same way and no port has to
// translate it.
var separators = []rune{0x0009, 0x000a, 0x000c, 0x000d, 0x0020}

// nonSeparators holds code points that some regex flavors count as whitespace
// and the schema does not. A payload held together by one of them is not what
// the injection filters look for, so it comes through as an ordinary value.
var nonSeparators = []rune{
	0x000b, 0x0085, 0x00a0, 0x1680, 0x2000, 0x2028, 0x2029,
	0x202f, 0x205f, 0x3000, 0xfeff, 0x200b,
}

// The injection filters of definition.json keep javascript: and url() payloads
// out of attribute values whatever separator the payload uses, as long as that
// separator is one the schema counts.
func TestSeparatorsKeepInjectionPayloadsOut(t *testing.T) {
	// The empty string covers the payloads that carry no separator at all.
	spellings := []string{""}
	for _, sep := range separators {
		spellings = append(spellings, string(sep))
	}

	for _, s := range spellings {
		for _, value := range []string{
			"javascript" + s + ":alert(1)",
			"url" + s + "(" + s + "https://evil.example)",
		} {
			if err := Definition(definitionWithFill(t, value)); err == nil {
				t.Errorf("fill %q was accepted, want rejected", value)
			}
		}
	}
}

func TestPayloadsHeldTogetherByOtherCharactersStayAccepted(t *testing.T) {
	for _, sep := range nonSeparators {
		s := string(sep)

		for _, value := range []string{
			"javascript" + s + ":alert(1)",
			"url" + s + "(" + s + "https://evil.example)",
		} {
			if err := Definition(definitionWithFill(t, value)); err != nil {
				t.Errorf("fill %q with U+%04X was rejected, want accepted: %v", value, sep, err)
			}
		}
	}
}

func TestLocalPaintServerReferencesStayAccepted(t *testing.T) {
	values := []string{"url(#local)", "red"}

	for _, sep := range separators {
		s := string(sep)
		values = append(values, "url("+s+"#local)", "url"+s+"("+s+"#local)")
	}

	for _, value := range values {
		if err := Definition(definitionWithFill(t, value)); err != nil {
			t.Errorf("fill %q was rejected, want accepted: %v", value, err)
		}
	}
}

// Right after the parenthesis the schema reads anything outside the separator
// class as the first character of the URL, so a reference that opens on one of
// those characters is not a local reference and is turned away.
func TestReferencesOpeningOnANonSeparatorAreRejected(t *testing.T) {
	for _, sep := range nonSeparators {
		value := "url(" + string(sep) + "#local)"

		if err := Definition(definitionWithFill(t, value)); err == nil {
			t.Errorf("fill %q with U+%04X was accepted, want rejected", value, sep)
		}
	}
}

func nestJSON(levels int, leaf string) string {
	return strings.Repeat("[", levels) + leaf + strings.Repeat("]", levels)
}

// The value itself is level 1: an object holding 63 arrays reaches level 64.
func TestExceedsMaxDepthCountsTheValueAsTheFirstLevel(t *testing.T) {
	if exceedsMaxDepth([]byte(`{"seed":` + nestJSON(MaxDepth-1, `"x"`) + `}`)) {
		t.Error("64 levels exceed the limit")
	}

	if !exceedsMaxDepth([]byte(`{"seed":` + nestJSON(MaxDepth, `"x"`) + `}`)) {
		t.Error("65 levels do not exceed the limit")
	}
}

// Brackets inside strings, escaped quotes included, are text, not nesting.
func TestExceedsMaxDepthIgnoresBracketsInStrings(t *testing.T) {
	text := `"` + strings.Repeat(`[{\"`, 100) + `"`

	if exceedsMaxDepth([]byte(`{"seed":` + text + `}`)) {
		t.Error("brackets in a string counted as nesting")
	}
}

func TestDeepNestingIsInvalid(t *testing.T) {
	for _, check := range []func([]byte) error{Options, Definition} {
		err := check([]byte(`{"seed":` + nestJSON(5000, `"x"`) + `}`))

		if err == nil || !strings.Contains(err.Error(), "nesting is deeper") {
			t.Errorf("got %v, want the nesting error", err)
		}
	}
}
