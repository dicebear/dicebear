package dicebear

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

// Cross-language avatar parity. Renders each shared fixture case and asserts the
// SVG matches byte-for-byte the output committed under
// <repo>/tests/fixtures/parity/avatars/, the same fixtures every other port
// renders against.

func TestAvatarParity(t *testing.T) {
	styleNames := fixtureStyleNames(t)

	for _, name := range styleNames {
		stylePath := fixturePath(t, filepath.Join("styles", name+".json"))
		styleJSON, err := os.ReadFile(stylePath)
		if err != nil {
			t.Fatalf("read style %s: %v", name, err)
		}

		style, err := NewStyle(styleJSON)
		if err != nil {
			t.Fatalf("parse style %s: %v", name, err)
		}

		var cases []struct {
			ID              string          `json:"id"`
			Options         map[string]any  `json:"options"`
			SVG             string          `json:"svg"`
			DataURI         string          `json:"dataUri"`
			ResolvedOptions json.RawMessage `json:"resolvedOptions"`
		}
		readFixture(t, filepath.Join("avatars", name+".json"), &cases)

		for _, c := range cases {
			avatar, err := NewAvatar(style, c.Options)
			if err != nil {
				t.Fatalf("render %s/%s: %v", name, c.ID, err)
				continue
			}

			if got := avatar.SVG(); got != c.SVG {
				t.Errorf("%s/%s SVG mismatch at byte %d", name, c.ID, firstDiff(got, c.SVG))
			}

			// Only select cases carry a dataUri — it pins the percent-encoding
			// contract (JS encodeURIComponent) without bloating every fixture.
			if c.DataURI != "" {
				if got := avatar.DataURI(); got != c.DataURI {
					t.Errorf("%s/%s data URI mismatch at byte %d", name, c.ID, firstDiff(got, c.DataURI))
				}
			}

			// Deep-equal (order-independent), like the other ports' suites.
			// Decode with UseNumber so a JSON integer (1) and float
			// (1.0) compare unequal — this pins whole-number options as JSON
			// integers, the same guarantee the Rust suite makes.
			gotJSON, err := json.Marshal(avatar.ResolvedOptions())
			if err != nil {
				t.Fatalf("marshal resolved options %s/%s: %v", name, c.ID, err)
			}
			got := decodeNumberAware(t, gotJSON)
			want := decodeNumberAware(t, c.ResolvedOptions)
			if !reflect.DeepEqual(got, want) {
				t.Errorf("%s/%s resolved options mismatch\n got: %s\nwant: %s", name, c.ID, gotJSON, c.ResolvedOptions)
			}
		}
	}
}

// Cross-language descriptor parity: the field map every port derives from a
// style (types, ranges, sorted variant lists, per-color fields) must deep-equal
// the JS-generated fixture. The number-aware decode also pins whole numbers as
// JSON integers, like the resolved-options assertion above.
func TestDescriptorParity(t *testing.T) {
	styleNames := fixtureStyleNames(t)

	for _, name := range styleNames {
		styleJSON, err := os.ReadFile(fixturePath(t, filepath.Join("styles", name+".json")))
		if err != nil {
			t.Fatalf("read style %s: %v", name, err)
		}
		style, err := NewStyle(styleJSON)
		if err != nil {
			t.Fatalf("parse style %s: %v", name, err)
		}

		gotJSON, err := json.Marshal(NewOptionsDescriptor(style).ToJSON())
		if err != nil {
			t.Fatalf("marshal descriptor %s: %v", name, err)
		}

		wantJSON, err := os.ReadFile(fixturePath(t, filepath.Join("descriptors", name+".json")))
		if err != nil {
			t.Fatalf("read descriptor %s: %v", name, err)
		}

		got := decodeNumberAware(t, gotJSON)
		want := decodeNumberAware(t, wantJSON)
		if !reflect.DeepEqual(got, want) {
			t.Errorf("%s descriptor mismatch\n got: %s\nwant: %s", name, gotJSON, wantJSON)
		}
	}
}

// decodeNumberAware unmarshals JSON into `any` with UseNumber, so numbers stay
// as json.Number (distinguishing 1 from 1.0) instead of collapsing to float64.
func decodeNumberAware(t *testing.T, b []byte) any {
	t.Helper()
	dec := json.NewDecoder(bytes.NewReader(b))
	dec.UseNumber()
	var v any
	if err := dec.Decode(&v); err != nil {
		t.Fatalf("decode: %v", err)
	}
	return v
}

// firstDiff returns the index of the first byte where a and b differ, or the
// length of the shorter string if one is a prefix of the other.
func firstDiff(a, b string) int {
	n := len(a)
	if len(b) < n {
		n = len(b)
	}
	for i := 0; i < n; i++ {
		if a[i] != b[i] {
			return i
		}
	}
	return n
}

// Ill-formed UTF-8 in the seed and the title becomes U+FFFD, one per maximal
// subpart, so the avatar matches the one for the well-formed text.
// Inputs are hex strings; the utf16 cases are for the ports whose strings are
// UTF-16 code units. See tests/fixtures/parity/generate.mjs.
func TestIllFormedTextParity(t *testing.T) {
	styleJSON, err := os.ReadFile(fixturePath(t, filepath.Join("styles", "initials.json")))
	if err != nil {
		t.Fatalf("read style: %v", err)
	}

	style, err := NewStyle(styleJSON)
	if err != nil {
		t.Fatalf("parse style: %v", err)
	}

	var fixture struct {
		UTF8 []struct {
			Input      string `json:"input"`
			WellFormed string `json:"wellFormed"`
			SVG        string `json:"svg"`
		} `json:"utf8"`
	}
	readFixture(t, "ill-formed-text.json", &fixture)

	if len(fixture.UTF8) == 0 {
		t.Fatal("no utf8 cases")
	}

	for _, c := range fixture.UTF8 {
		raw, err := hex.DecodeString(c.Input)
		if err != nil {
			t.Fatalf("decode %s: %v", c.Input, err)
		}

		input := string(raw)
		avatar, err := NewAvatar(style, map[string]any{"seed": input, "title": input})
		if err != nil {
			t.Fatalf("%s: %v", c.Input, err)
		}

		if got := avatar.String(); got != c.SVG {
			t.Errorf("%s (%q): SVG differs at byte %d", c.Input, c.WellFormed, firstDiff(got, c.SVG))
		}
	}
}
