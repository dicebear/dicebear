package render

import (
	"encoding/json"
	"fmt"
	"slices"
	"testing"

	"github.com/dicebear/dicebear-go/v10/internal/style"
)

// The colorOrder tests mirror the describe('colorOrder', ...) block of the JS
// reference suite (src/js/core/tests/Resolver.test.js).

const minimalStyleJSON = `{"canvas":{"width":100,"height":100,"elements":[]}}`

const styleWithColorsJSON = `{
	"canvas": { "width": 100, "height": 100, "elements": [] },
	"colors": {
		"skin": { "values": ["#f0c8a0", "#d4a574", "#8d5524"] },
		"hair": { "values": ["#2c1b18", "#b55239", "#d6b370"], "notEqualTo": ["skin"] },
		"background": { "values": ["#ffffff", "#000000", "#cccccc"], "contrastTo": "skin" }
	}
}`

// makeResolver builds a resolver from a style definition and an options JSON
// string. The options pass through a JSON round-trip like in Generate, so
// numbers arrive as float64.
func makeResolver(t *testing.T, styleJSON, optionsJSON string) *resolver {
	t.Helper()

	s, err := style.New([]byte(styleJSON))
	if err != nil {
		t.Fatalf("style.New: %v", err)
	}

	var data map[string]any
	if err := json.Unmarshal([]byte(optionsJSON), &data); err != nil {
		t.Fatalf("parse options: %v", err)
	}

	return newResolver(s, newOptions(data))
}

func mustColor(t *testing.T, r *resolver, name string) []string {
	t.Helper()

	colors, err := r.color(name)
	if err != nil {
		t.Fatalf("color(%q): %v", name, err)
	}
	return colors
}

func TestColorOrderDefaultsToRandom(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{"seed":"order-default"}`)

	if got := r.colorOrder("skin"); got != "random" {
		t.Errorf(`colorOrder("skin") = %q, want "random"`, got)
	}
}

func TestColorOrderFixedKeepsGivenOrderForGradientFills(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{
		"seed": "order-fixed",
		"skinColor": ["#0055a4", "#ffffff", "#ef4135"],
		"skinColorFill": "linear",
		"skinColorOrder": "fixed"
	}`)

	want := []string{"#0055a4", "#ffffff", "#ef4135"}
	if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
		t.Errorf("color(skin) = %v, want %v", got, want)
	}
}

func TestColorOrderFixedKeepsOrderForEverySeed(t *testing.T) {
	want := []string{"#0055a4", "#ffffff", "#ef4135"}

	for i := 0; i < 20; i++ {
		r := makeResolver(t, minimalStyleJSON, fmt.Sprintf(`{
			"seed": "order-fixed-%d",
			"skinColor": ["#0055a4", "#ffffff", "#ef4135"],
			"skinColorFill": "linear",
			"skinColorOrder": "fixed"
		}`, i))

		if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
			t.Errorf("seed %d: color(skin) = %v, want %v", i, got, want)
		}
	}
}

func TestColorOrderFixedDefaultsStopCountToNumberOfColors(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{
		"seed": "order-stops",
		"skinColor": ["#ff0000", "#00ff00", "#0000ff", "#ffffff"],
		"skinColorFill": "linear",
		"skinColorOrder": "fixed"
	}`)

	if got := mustColor(t, r, "skin"); len(got) != 4 {
		t.Errorf("len(color(skin)) = %d, want 4", len(got))
	}
}

func TestColorOrderFixedRespectsExplicitStopCount(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{
		"seed": "order-explicit-stops",
		"skinColor": ["#0055a4", "#ffffff", "#ef4135"],
		"skinColorFill": "linear",
		"skinColorFillStops": 2,
		"skinColorOrder": "fixed"
	}`)

	want := []string{"#0055a4", "#ffffff"}
	if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
		t.Errorf("color(skin) = %v, want %v", got, want)
	}
}

func TestColorOrderFixedUsesFirstColorForSolidFills(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{
		"seed": "order-solid",
		"skinColor": ["#ef4135", "#0055a4"],
		"skinColorOrder": "fixed"
	}`)

	want := []string{"#ef4135"}
	if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
		t.Errorf("color(skin) = %v, want %v", got, want)
	}
}

func TestColorOrderFixedSkipsContrastSorting(t *testing.T) {
	// background.contrastTo = skin: by default the strongest-contrast candidate
	// comes first, with a fixed order the user's first color wins.
	const options = `{
		"seed": "order-contrast",
		"skinColor": "#000000",
		"backgroundColor": ["#111111", "#ffffff"]%s
	}`

	control := makeResolver(t, styleWithColorsJSON, fmt.Sprintf(options, ""))
	fixed := makeResolver(t, styleWithColorsJSON,
		fmt.Sprintf(options, `, "backgroundColorOrder": "fixed"`))

	if got := mustColor(t, control, "background"); !slices.Equal(got, []string{"#ffffff"}) {
		t.Errorf("control color(background) = %v, want [#ffffff]", got)
	}
	if got := mustColor(t, fixed, "background"); !slices.Equal(got, []string{"#111111"}) {
		t.Errorf("fixed color(background) = %v, want [#111111]", got)
	}
}

func TestColorOrderFixedStillAppliesNotEqualToFiltering(t *testing.T) {
	// hair.notEqualTo = skin
	r := makeResolver(t, styleWithColorsJSON, `{
		"seed": "order-not-equal",
		"skinColor": "#2c1b18",
		"hairColor": ["#2c1b18", "#b55239", "#d6b370"],
		"hairColorFill": "linear",
		"hairColorOrder": "fixed"
	}`)

	want := []string{"#b55239", "#d6b370"}
	if got := mustColor(t, r, "hair"); !slices.Equal(got, want) {
		t.Errorf("color(hair) = %v, want %v", got, want)
	}
}

func TestColorOrderFixedSortsStylePaletteInsteadOfVerbatim(t *testing.T) {
	// Without user-supplied colors, "fixed" only skips the shuffle: the style
	// palette keeps the canonical code-point sort, for every seed.
	want := []string{"#8d5524", "#d4a574", "#f0c8a0"}

	for i := 0; i < 5; i++ {
		r := makeResolver(t, styleWithColorsJSON, fmt.Sprintf(`{
			"seed": "order-style-%d",
			"skinColorFill": "linear",
			"skinColorFillStops": 3,
			"skinColorOrder": "fixed"
		}`, i))

		if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
			t.Errorf("seed %d: color(skin) = %v, want %v", i, got, want)
		}
	}
}

func TestColorOrderFixedKeepsContrastSortingForStylePalette(t *testing.T) {
	// background.contrastTo = skin and no user-supplied background colors: the
	// strongest-contrast candidate still comes first.
	r := makeResolver(t, styleWithColorsJSON, `{
		"seed": "order-style-contrast",
		"skinColor": "#000000",
		"backgroundColorOrder": "fixed"
	}`)

	want := []string{"#ffffff"}
	if got := mustColor(t, r, "background"); !slices.Equal(got, want) {
		t.Errorf("color(background) = %v, want %v", got, want)
	}
}

func TestColorOrderFixedKeepsDefaultTwoStopsForStylePalette(t *testing.T) {
	r := makeResolver(t, styleWithColorsJSON, `{
		"seed": "order-style-stops",
		"skinColorFill": "linear",
		"skinColorOrder": "fixed"
	}`)

	want := []string{"#8d5524", "#d4a574"}
	if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
		t.Errorf("color(skin) = %v, want %v", got, want)
	}
}
