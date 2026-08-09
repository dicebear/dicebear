package render

import "testing"

// Mirrors the describe('colorOrder()', ...) accessor cases of the JS reference
// suite (src/js/core/tests/Options.test.js). The two validation cases (unknown
// value, array value) live in the public API tests, since validation happens in
// Generate rather than in the options accessor.

func TestOptionsColorOrderReturnsEmptyWhenUnset(t *testing.T) {
	if got := newOptions(map[string]any{}).colorOrder("skin"); got != "" {
		t.Errorf(`colorOrder("skin") = %q, want ""`, got)
	}
}

func TestOptionsColorOrderPassesValueThrough(t *testing.T) {
	opts := newOptions(map[string]any{"skinColorOrder": "fixed"})

	if got := opts.colorOrder("skin"); got != "fixed" {
		t.Errorf(`colorOrder("skin") = %q, want "fixed"`, got)
	}
}
