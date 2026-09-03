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

func TestColorOrderFixedKeepsStylePaletteInDefinitionOrder(t *testing.T) {
	// Without user-supplied colors, "fixed" uses the palette as the style
	// lists it, for every seed.
	want := []string{"#f0c8a0", "#d4a574", "#8d5524"}

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

func TestColorOrderFixedSkipsContrastSortingForStylePalette(t *testing.T) {
	// background.contrastTo = skin: the contrast sort would put black first
	// against a white skin, the fixed order keeps white first.
	r := makeResolver(t, styleWithColorsJSON, `{
		"seed": "order-style-contrast",
		"skinColor": "#ffffff",
		"backgroundColorOrder": "fixed"
	}`)

	want := []string{"#ffffff"}
	if got := mustColor(t, r, "background"); !slices.Equal(got, want) {
		t.Errorf("color(background) = %v, want %v", got, want)
	}
}

func TestColorOrderFixedDefaultsStopCountToPaletteSize(t *testing.T) {
	r := makeResolver(t, styleWithColorsJSON, `{
		"seed": "order-style-stops",
		"skinColorFill": "linear",
		"skinColorOrder": "fixed"
	}`)

	want := []string{"#f0c8a0", "#d4a574", "#8d5524"}
	if got := mustColor(t, r, "skin"); !slices.Equal(got, want) {
		t.Errorf("color(skin) = %v, want %v", got, want)
	}
}

// The per-name animation speed tests mirror the describe('animation options',
// ...) block of the JS reference suite (src/js/core/tests/Resolver.test.js).

func TestAnimationSpeedForLetsTheSpecificOptionWinOverTheGlobalOne(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{
		"animationSpeed": 0.5,
		"blinkAnimationSpeed": 2
	}`)

	if got := r.animationSpeedFor("blink"); got != 2 {
		t.Errorf(`animationSpeedFor("blink") = %v, want 2`, got)
	}
	if got := r.animationSpeedFor("sway"); got != 0.5 {
		t.Errorf(`animationSpeedFor("sway") = %v, want 0.5`, got)
	}
	if got := r.animationSpeedFor(""); got != 0.5 {
		t.Errorf(`animationSpeedFor("") = %v, want 0.5`, got)
	}

	resolved := r.resolved()
	if got := resolved["blinkAnimationSpeed"]; got != 2.0 {
		t.Errorf("resolved blinkAnimationSpeed = %v, want 2", got)
	}
	if _, ok := resolved["swayAnimationSpeed"]; ok {
		t.Error("swayAnimationSpeed should stay out of the resolved options")
	}
}

func TestAnimationSpeedForDrawsASpecificRangeUnderItsOwnKey(t *testing.T) {
	options := `{
		"seed": "x",
		"blinkAnimationSpeed": [0.5, 2],
		"swayAnimationSpeed": [0.5, 2]
	}`
	r := makeResolver(t, minimalStyleJSON, options)
	blink := r.animationSpeedFor("blink")

	if blink < 0.5 || blink > 2 {
		t.Errorf(`animationSpeedFor("blink") = %v, want a value within 0.5 to 2`, blink)
	}
	if sway := r.animationSpeedFor("sway"); sway == blink {
		t.Errorf("blink and sway both resolved to %v, want distinct draws", blink)
	}

	global := makeResolver(t, minimalStyleJSON, `{"seed": "x", "animationSpeed": [0.5, 2]}`).animationSpeed()
	if blink == global {
		t.Errorf("blink = %v equals the global draw, want a draw under its own key", blink)
	}

	if again := makeResolver(t, minimalStyleJSON, options).animationSpeedFor("blink"); again != blink {
		t.Errorf("second resolve = %v, want %v", again, blink)
	}
}

func TestAnimationPlaysLetsANamedSwitchWinOverTheGlobalOne(t *testing.T) {
	on := makeResolver(t, minimalStyleJSON, `{"animation": false, "blinkAnimation": true}`)

	if !on.animationPlays("blink") {
		t.Error(`animationPlays("blink") = false, want true`)
	}
	if on.animationPlays("sway") {
		t.Error(`animationPlays("sway") = true, want false`)
	}
	if on.animationPlays("") {
		t.Error(`animationPlays("") = true, want false`)
	}
	resolved := on.resolved()
	if got := resolved["blinkAnimation"]; got != true {
		t.Errorf("resolved blinkAnimation = %v, want true", got)
	}
	if _, ok := resolved["swayAnimation"]; ok {
		t.Error("swayAnimation should stay out of the resolved options")
	}

	off := makeResolver(t, minimalStyleJSON, `{"animation": true, "blinkAnimation": false}`)

	if off.animationPlays("blink") {
		t.Error(`animationPlays("blink") = true, want false`)
	}
	if !off.animationPlays("sway") {
		t.Error(`animationPlays("sway") = false, want true`)
	}
	if !off.animationPlays("") {
		t.Error(`animationPlays("") = false, want true`)
	}
}

func TestAnimationDelayForLetsANamedDelayWinOverTheGlobalOne(t *testing.T) {
	r := makeResolver(t, minimalStyleJSON, `{"animationDelay": 1, "blinkAnimationDelay": -2}`)

	if got := r.animationDelay(); got != 1 {
		t.Errorf("animationDelay() = %v, want 1", got)
	}
	if got := r.animationDelayFor("blink"); got != -2 {
		t.Errorf(`animationDelayFor("blink") = %v, want -2`, got)
	}
	if got := r.animationDelayFor("sway"); got != 1 {
		t.Errorf(`animationDelayFor("sway") = %v, want 1`, got)
	}
	if got := r.animationDelayFor(""); got != 1 {
		t.Errorf(`animationDelayFor("") = %v, want 1`, got)
	}
	if got := makeResolver(t, minimalStyleJSON, `{}`).animationDelayFor("blink"); got != 0 {
		t.Errorf(`animationDelayFor("blink") without options = %v, want 0`, got)
	}
}

func TestAnimationDelayForDrawsADelayRangeUnderItsOwnKeySeeded(t *testing.T) {
	options := `{"seed": "x", "animationDelay": [0, 3], "blinkAnimationDelay": [0, 3]}`
	r := makeResolver(t, minimalStyleJSON, options)
	global := r.animationDelay()
	blink := r.animationDelayFor("blink")

	if global < 0 || global > 3 {
		t.Errorf("animationDelay() = %v, want a value within 0 to 3", global)
	}
	if blink < 0 || blink > 3 {
		t.Errorf(`animationDelayFor("blink") = %v, want a value within 0 to 3`, blink)
	}
	if global == blink {
		t.Errorf("global and blink both resolved to %v, want distinct draws", global)
	}
	if again := makeResolver(t, minimalStyleJSON, options).animationDelayFor("blink"); again != blink {
		t.Errorf("second resolve = %v, want %v", again, blink)
	}
}
