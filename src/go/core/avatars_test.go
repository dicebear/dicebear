package dicebear

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

// Cross-language avatar parity. Renders each shared fixture case and asserts the
// SVG matches byte-for-byte the output committed under
// <repo>/tests/fixtures/parity/avatars/, the same fixtures the JS, PHP,
// Python, Rust and Dart suites render against.

func TestAvatarParity(t *testing.T) {
	styleNames := []string{"initials", "thumbs", "glass", "shape-grid", "notionists", "tagged"}

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

			// Deep-equal (order-independent), like the JS/PHP/Python/Rust/Dart
			// suites. Decode with UseNumber so a JSON integer (1) and float
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
	styleNames := []string{"initials", "thumbs", "glass", "shape-grid", "notionists", "tagged"}

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
