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

// Mirrors the animationSpeedFor() accessor: a ${name}AnimationSpeed option
// normalizes like animationSpeed, and an unset one reads as nil.

func TestOptionsAnimationSpeedForReturnsNilWhenUnset(t *testing.T) {
	opts := newOptions(map[string]any{"animationSpeed": 2.0})

	if got := opts.animationSpeedFor("blink"); got != nil {
		t.Errorf(`animationSpeedFor("blink") = %v, want nil`, got)
	}
}

func TestOptionsAnimationSpeedForNormalizesValueAndRange(t *testing.T) {
	opts := newOptions(map[string]any{
		"blinkAnimationSpeed": 2.0,
		"swayAnimationSpeed":  []any{0.5, 2.0},
		"bobAnimationSpeed":   []any{},
	})

	if blink := opts.animationSpeedFor("blink"); blink == nil || blink.Min != 2 || blink.Max != 2 {
		t.Errorf(`animationSpeedFor("blink") = %v, want a fixed range of 2`, blink)
	}
	if sway := opts.animationSpeedFor("sway"); sway == nil || sway.Min != 0.5 || sway.Max != 2 {
		t.Errorf(`animationSpeedFor("sway") = %v, want a range of 0.5 to 2`, sway)
	}
	if bob := opts.animationSpeedFor("bob"); bob != nil {
		t.Errorf(`animationSpeedFor("bob") = %v, want nil for an empty array`, bob)
	}
}

// Mirrors the animation() / animationFor() accessors: both read a boolean
// switch, and an unset one reads as unset.

func TestOptionsAnimationReturnsNilWhenUnset(t *testing.T) {
	if got := newOptions(map[string]any{}).animation(); got != nil {
		t.Errorf("animation() = %v, want nil", *got)
	}
}

func TestOptionsAnimationForPassesTheSwitchThrough(t *testing.T) {
	opts := newOptions(map[string]any{"animation": true, "blinkAnimation": false})

	if got, ok := opts.animationFor("blink"); !ok || got {
		t.Errorf(`animationFor("blink") = %v, %v, want false, true`, got, ok)
	}
	if got, ok := opts.animationFor("sway"); ok || got {
		t.Errorf(`animationFor("sway") = %v, %v, want false, false`, got, ok)
	}
}

// Mirrors the animationDelay() / animationDelayFor() accessors, which read
// like the speed ones.

func TestOptionsAnimationDelayForNormalizesValueAndRange(t *testing.T) {
	opts := newOptions(map[string]any{
		"animationDelay":      1.0,
		"blinkAnimationDelay": []any{-2.0, 2.0},
	})

	if global := opts.animationDelay(); global == nil || global.Min != 1 || global.Max != 1 {
		t.Errorf("animationDelay() = %v, want a fixed range of 1", global)
	}
	if blink := opts.animationDelayFor("blink"); blink == nil || blink.Min != -2 || blink.Max != 2 {
		t.Errorf(`animationDelayFor("blink") = %v, want a range of -2 to 2`, blink)
	}
	if sway := opts.animationDelayFor("sway"); sway != nil {
		t.Errorf(`animationDelayFor("sway") = %v, want nil`, sway)
	}
}
