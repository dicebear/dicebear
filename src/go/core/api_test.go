package dicebear

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
	"regexp"
	"strings"
	"testing"
)

const minimalStyle = `{"canvas":{"width":100,"height":100,"elements":[]}}`

func mustStyle(t *testing.T, def string) *Style {
	t.Helper()
	style, err := NewStyle([]byte(def))
	if err != nil {
		t.Fatalf("NewStyle: %v", err)
	}
	return style
}

func TestJSONExposesSVGAndResolvedOptions(t *testing.T) {
	style := mustStyle(t, minimalStyle)
	avatar, err := NewAvatar(style, map[string]any{"seed": "x"})
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}

	var out struct {
		SVG     string         `json:"svg"`
		Options map[string]any `json:"options"`
	}
	b, err := avatar.JSON()
	if err != nil {
		t.Fatalf("JSON: %v", err)
	}
	if err := json.Unmarshal(b, &out); err != nil {
		t.Fatalf("unmarshal JSON: %v", err)
	}

	if out.SVG != avatar.SVG() {
		t.Errorf("JSON svg does not match SVG()")
	}
	// The resolved options carry the picked values but never the raw seed.
	if out.Options["flip"] != "none" {
		t.Errorf("resolved flip = %v, want none", out.Options["flip"])
	}
	if _, ok := out.Options["seed"]; ok {
		t.Errorf("resolved options must not contain the raw seed")
	}
}

func TestOptionsDescriptorDescribesComponentsAndColors(t *testing.T) {
	style := mustStyle(t, `{
		"canvas": { "width": 100, "height": 100, "elements": [] },
		"components": {
			"shape": { "width": 100, "height": 100, "variants": { "a": { "elements": [] }, "b": { "elements": [] } } }
		},
		"colors": {
			"fill": { "values": ["#000000"] },
			"outline": { "values": ["#111111", "#eeeeee"], "contrastTo": "fill", "notEqualTo": ["fill"] }
		}
	}`)

	descriptor := NewOptionsDescriptor(style).ToJSON()

	if seed, _ := descriptor["seed"].(map[string]any); seed["type"] != "string" {
		t.Errorf("seed descriptor = %v", descriptor["seed"])
	}

	shapeVariant, _ := descriptor["shapeVariant"].(map[string]any)
	values, _ := shapeVariant["values"].([]string)
	if !equalStrings(values, []string{"a", "b"}) {
		t.Errorf("shapeVariant values = %v, want [a b]", shapeVariant["values"])
	}

	shapeProbability, _ := descriptor["shapeProbability"].(map[string]any)
	if shapeProbability["type"] != "number" {
		t.Errorf("shapeProbability type = %v", shapeProbability["type"])
	}

	if fill, _ := descriptor["fillColor"].(map[string]any); fill["type"] != "color" {
		t.Errorf("fillColor type = %v", descriptor["fillColor"])
	}
	if bg, _ := descriptor["backgroundColor"].(map[string]any); bg["type"] != "color" {
		t.Errorf("backgroundColor type = %v", descriptor["backgroundColor"])
	}

	// A color group repeats the constraints of its definition, so tooling that
	// picks colors itself can apply them.
	wantOutline := map[string]any{
		"type":       "color",
		"list":       true,
		"contrastTo": "fill",
		"notEqualTo": []string{"fill"},
	}
	if got, _ := descriptor["outlineColor"].(map[string]any); !reflect.DeepEqual(got, wantOutline) {
		t.Errorf("outlineColor = %v, want %v", descriptor["outlineColor"], wantOutline)
	}

	fillColor, _ := descriptor["fillColor"].(map[string]any)
	if _, ok := fillColor["contrastTo"]; ok {
		t.Errorf("fillColor = %v, want no contrastTo", fillColor)
	}
	if _, ok := fillColor["notEqualTo"]; ok {
		t.Errorf("fillColor = %v, want no notEqualTo", fillColor)
	}

	// Every color name carries a single-valued ColorOrder enum, without a list
	// flag.
	wantOrder := map[string]any{"type": "enum", "values": []string{"random", "fixed"}}
	for _, key := range []string{"backgroundColorOrder", "fillColorOrder"} {
		if got, _ := descriptor[key].(map[string]any); !reflect.DeepEqual(got, wantOrder) {
			t.Errorf("%s = %v, want %v", key, descriptor[key], wantOrder)
		}
	}
}

func TestCircularColorReferenceIsReported(t *testing.T) {
	style := mustStyle(t, `{
		"canvas": {
			"width": 100, "height": 100,
			"elements": [{ "type": "element", "name": "rect", "attributes": { "fill": { "type": "color", "name": "a" } } }]
		},
		"colors": {
			"a": { "values": ["#000000"], "contrastTo": "b" },
			"b": { "values": ["#ffffff"], "contrastTo": "a" }
		}
	}`)

	_, err := NewAvatar(style, map[string]any{"seed": "x"})
	if err == nil {
		t.Fatal("expected a circular color reference error")
	}
	if !strings.Contains(err.Error(), "Circular color reference") {
		t.Errorf("error = %q, want it to mention a circular color reference", err)
	}
	if _, ok := err.(*CircularColorReferenceError); !ok {
		t.Errorf("error type = %T, want *CircularColorReferenceError", err)
	}
}

func TestJSONSerializesWholeNumberOptionsAsIntegers(t *testing.T) {
	// The other ports emit integers ("size":128), not floats (128.0); the
	// resolved-options snapshot must match byte-for-byte.
	style := mustStyle(t, minimalStyle)
	avatar, err := NewAvatar(style, map[string]any{"seed": "x", "size": 128})
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}

	b, err := avatar.JSON()
	if err != nil {
		t.Fatalf("JSON: %v", err)
	}

	dec := json.NewDecoder(bytes.NewReader(b))
	dec.UseNumber()
	var out struct {
		Options map[string]any `json:"options"`
	}
	if err := dec.Decode(&out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	size, ok := out.Options["size"].(json.Number)
	if !ok || size.String() != "128" {
		t.Errorf("resolved size = %v, want 128 (integer, not float)", out.Options["size"])
	}
}

func TestJSONEmitsOptionsInResolutionOrder(t *testing.T) {
	// The envelope must match the JS port byte-for-byte, including the key
	// order (size before title — both resolved before the root attributes).
	// The expected string is the verbatim output of the JS core for the same
	// style and options.
	style := mustStyle(t, minimalStyle)
	avatar, err := NewAvatar(style, map[string]any{"seed": "x", "size": 128, "title": "t"})
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}

	b, err := avatar.JSON()
	if err != nil {
		t.Fatalf("JSON: %v", err)
	}

	want := `"options":{"backgroundColorFill":"solid","backgroundColor":[],` +
		`"scale":1,"flip":"none","rotate":0,"translateX":0,"translateY":0,` +
		`"borderRadius":0,"size":128,"title":"t","idRandomization":false}`
	if !strings.Contains(string(b), want) {
		t.Errorf("JSON() options section diverges from the JS port:\n got: %s\nwant: …%s", b, want)
	}
}

func TestValidationErrorsDoNotLeakWorkingDirectory(t *testing.T) {
	// The schemas are registered under neutral absolute URIs; a relative name
	// would be resolved against the process CWD and leak filesystem paths into
	// the error message.
	_, defErr := NewStyle([]byte(`{"components":{}}`))
	style := mustStyle(t, minimalStyle)
	_, optErr := NewAvatar(style, map[string]any{"seed": 123})

	for _, err := range []error{defErr, optErr} {
		if err == nil {
			t.Fatal("expected a validation error")
		}
		if strings.Contains(err.Error(), "file://") {
			t.Errorf("validation error leaks a filesystem path: %q", err)
		}
	}
}

func TestDeeplyNestedColorsResolveWithoutBlowup(t *testing.T) {
	// Each color references the next via BOTH contrastTo and notEqualTo, which
	// without memoization fans out to 2^depth color resolutions — a
	// schema-valid hang. With the resolver's memo it is linear.
	const depth = 40

	var colors strings.Builder
	for i := 0; i < depth; i++ {
		fmt.Fprintf(&colors,
			`"c%d":{"values":["#000000"],"contrastTo":"c%d","notEqualTo":["c%d"]},`,
			i, i+1, i+1)
	}
	fmt.Fprintf(&colors, `"c%d":{"values":["#ffffff"]}`, depth)

	def := fmt.Sprintf(
		`{"canvas":{"width":100,"height":100,"elements":[{"type":"element","name":"rect","attributes":{"fill":{"type":"color","name":"c0"}}}]},"colors":{%s}}`,
		colors.String())

	style := mustStyle(t, def)
	if _, err := NewAvatar(style, map[string]any{"seed": "x"}); err != nil {
		t.Fatalf("deeply nested colors failed: %v", err)
	}
}

func TestValidation(t *testing.T) {
	style := mustStyle(t, minimalStyle)

	// Accepts a minimal valid style and options.
	if _, err := NewAvatar(style, map[string]any{"seed": "x"}); err != nil {
		t.Errorf("minimal options rejected: %v", err)
	}
	// nil options are treated as empty and accepted.
	if _, err := NewAvatar(style, nil); err != nil {
		t.Errorf("nil options rejected: %v", err)
	}

	// Rejects a definition missing canvas.
	if _, err := NewStyle([]byte(`{"components":{}}`)); err == nil {
		t.Error("definition missing canvas must fail")
	}

	// Rejects an alias to an unknown component.
	_, err := NewStyle([]byte(`{"canvas":{"width":100,"height":100,"elements":[]},"components":{"a":{"extends":"missing"}}}`))
	if err == nil {
		t.Error("alias to unknown component must fail")
	} else if !strings.Contains(err.Error(), "unknown component") {
		t.Errorf("error = %q, want it to mention an unknown component", err)
	}

	// Rejects options with a wrong type (seed must be a string).
	if _, err := NewAvatar(style, map[string]any{"seed": 123}); err == nil {
		t.Error("seed: 123 must fail validation")
	}
}

// animatedContainerStyle wraps one animated circle in the named container
// element. Mirrors the defs/clipPath/mask cases of the describe('animations',
// ...) block in the JS reference suite (src/js/core/tests/Style.test.js).
func animatedContainerStyle(container string) string {
	return `{
		"canvas": {
			"width": 100,
			"height": 100,
			"elements": [
				{
					"type": "element",
					"name": "` + container + `",
					"attributes": { "id": "wrap" },
					"children": [
						{
							"type": "element",
							"name": "g",
							"children": [
								{
									"type": "element",
									"name": "circle",
									"attributes": { "r": "10" },
									"animations": [
										{ "duration": 1, "tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }] } } }
									]
								}
							]
						}
					]
				}
			]
		}
	}`
}

// The schema rejects animations below defs and clipPath, so the constructor
// fails through validation and no core carries a check of its own.
func TestAnimationsAreRejectedInsideDefsAndClipPath(t *testing.T) {
	for _, container := range []string{"defs", "clipPath"} {
		if _, err := NewStyle([]byte(animatedContainerStyle(container))); err == nil {
			t.Errorf("animation inside %s must fail", container)
		}
	}
}

func TestAnimationsAreAcceptedInsideMask(t *testing.T) {
	style := mustStyle(t, animatedContainerStyle("mask"))

	if !style.HasAnimations() {
		t.Error("HasAnimations() = false, want true")
	}
}

func TestColorOrderValidation(t *testing.T) {
	style := mustStyle(t, minimalStyle)

	// Accepts the two known values.
	for _, value := range []string{"random", "fixed"} {
		if _, err := NewAvatar(style, map[string]any{"skinColorOrder": value}); err != nil {
			t.Errorf("skinColorOrder: %q rejected: %v", value, err)
		}
	}

	// Rejects an unknown value.
	if _, err := NewAvatar(style, map[string]any{"skinColorOrder": "sorted"}); err == nil {
		t.Error(`skinColorOrder: "sorted" must fail validation`)
	} else if _, ok := err.(*ValidationError); !ok {
		t.Errorf("error type = %T, want *ValidationError", err)
	}

	// Rejects an array value. The option takes a single value, since a list
	// would reintroduce the PRNG pick that "fixed" exists to avoid.
	if _, err := NewAvatar(style, map[string]any{"skinColorOrder": []string{"fixed"}}); err == nil {
		t.Error(`skinColorOrder: ["fixed"] must fail validation`)
	} else if _, ok := err.(*ValidationError); !ok {
		t.Errorf("error type = %T, want *ValidationError", err)
	}
}

func TestFixedColorOrderKeepsStopOrder(t *testing.T) {
	style := mustStyle(t, `{
		"canvas": {
			"width": 100, "height": 100,
			"elements": [{ "type": "element", "name": "rect", "attributes": { "fill": { "type": "color", "name": "bg" } } }]
		},
		"colors": { "bg": { "values": ["#ff0000", "#0000ff"] } }
	}`)

	avatar, err := NewAvatar(style, map[string]any{
		"seed":         "test",
		"bgColor":      []string{"#0055a4", "#ffffff", "#ef4135"},
		"bgColorFill":  "linear",
		"bgColorOrder": "fixed",
	})
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}

	want := `<stop offset="0%" stop-color="#0055a4"/>` +
		`<stop offset="50%" stop-color="#ffffff"/>` +
		`<stop offset="100%" stop-color="#ef4135"/>`
	if !strings.Contains(avatar.SVG(), want) {
		t.Errorf("SVG lacks the fixed-order stops\n got: %s\nwant substring: %s", avatar.SVG(), want)
	}
}

func TestEncodeURIComponentMatchesJS(t *testing.T) {
	// Expected values are exactly what JavaScript's encodeURIComponent returns.
	cases := []struct{ in, want string }{
		{"<svg>", "%3Csvg%3E"},
		{"a b&c", "a%20b%26c"},
		{"-_.!~*'()", "-_.!~*'()"}, // the unreserved set passes through
		{"é", "%C3%A9"},            // multi-byte UTF-8 → per-byte escaping
		{`"#/`, "%22%23%2F"},
	}
	for _, c := range cases {
		if got := encodeURIComponent(c.in); got != c.want {
			t.Errorf("encodeURIComponent(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestDataURIEncodesSVG(t *testing.T) {
	style := mustStyle(t, minimalStyle)
	avatar, err := NewAvatar(style, map[string]any{"seed": "x"})
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}

	uri := avatar.DataURI()
	if want := "data:image/svg+xml;charset=utf-8," + encodeURIComponent(avatar.SVG()); uri != want {
		t.Errorf("DataURI() = %q, want %q", uri, want)
	}
	// The SVG starts with "<svg", which encodes to "%3Csvg".
	if !strings.HasPrefix(uri, "data:image/svg+xml;charset=utf-8,%3Csvg") {
		t.Errorf("DataURI() = %q, missing expected encoded prefix", uri)
	}
}

func TestJSONDoesNotHTMLEscapeSVG(t *testing.T) {
	// The other ports emit the literal "<svg ...>" in the JSON envelope; Go's
	// default json.Marshal would escape < > & to < > &. JSON() must not.
	style := mustStyle(t, minimalStyle)
	avatar, err := NewAvatar(style, map[string]any{"seed": "x"})
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}

	b, err := avatar.JSON()
	if err != nil {
		t.Fatalf("JSON: %v", err)
	}
	s := string(b)

	if !strings.Contains(s, `"svg":"<svg `) {
		t.Errorf("JSON() should contain a literal \"<svg \", got: %s", s)
	}
	// The \uXXXX escapes json.Marshal would emit for < > & must be absent. Each
	// literal is a backslash followed by uXXXX (six bytes), via the doubled
	// backslash in the interpreted string.
	for _, escaped := range []string{"\\u003c", "\\u003e", "\\u0026"} {
		if strings.Contains(s, escaped) {
			t.Errorf("JSON() must not HTML-escape (found %s), got: %s", escaped, s)
		}
	}
}

// pacedStyle carries a named timeline next to an unnamed one on the same
// element, so a per-name animation speed has one to scale and one to leave as
// authored. Mirrors the describe('per-name speed', ...) block of the JS
// reference suite (src/js/core/tests/Renderer.test.js).
const pacedStyle = `{
	"canvas": {
		"width": 100,
		"height": 100,
		"elements": [
			{
				"type": "element",
				"name": "rect",
				"animations": [
					{
						"name": "sway",
						"duration": 4,
						"delay": 1,
						"tracks": { "rotate": { "keyframes": [{ "at": 0, "value": 0 }, { "at": 100, "value": 4 }] } }
					},
					{
						"duration": 3,
						"tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }, { "at": 50, "value": 0.5 }] } }
					}
				]
			}
		]
	}
}`

// animationHashOf extracts the animation namespace hash from the first class
// name in the rendered SVG.
func animationHashOf(t *testing.T, svg string) string {
	t.Helper()
	match := regexp.MustCompile(`dba-([0-9a-f]+)-\d+`).FindStringSubmatch(svg)
	if match == nil {
		t.Fatalf("expected an animation class in the output, got: %s", svg)
	}
	return match[1]
}

func mustAvatar(t *testing.T, style *Style, options map[string]any) *Avatar {
	t.Helper()
	avatar, err := NewAvatar(style, options)
	if err != nil {
		t.Fatalf("NewAvatar: %v", err)
	}
	return avatar
}

func TestPerNameSpeedScalesOnlyTheNamedTimeline(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, pacedStyle), map[string]any{
		"animation":          true,
		"swayAnimationSpeed": 2,
	}).SVG()

	for _, want := range []string{"animation:2s linear 0.5s infinite", "animation:3s linear 0s infinite"} {
		if !strings.Contains(svg, want) {
			t.Errorf("SVG should contain %q, got: %s", want, svg)
		}
	}
}

func TestPerNameSpeedLetsTheSpecificOptionWinOverTheGlobalOne(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, pacedStyle), map[string]any{
		"animation":          true,
		"animationSpeed":     0.5,
		"swayAnimationSpeed": 2,
	}).SVG()

	for _, want := range []string{"animation:2s linear 0.5s infinite", "animation:6s linear 0s infinite"} {
		if !strings.Contains(svg, want) {
			t.Errorf("SVG should contain %q, got: %s", want, svg)
		}
	}
}

func TestPerNameSpeedIgnoresANameTheStyleDoesNotCarry(t *testing.T) {
	style := mustStyle(t, pacedStyle)
	listed := mustAvatar(t, style, map[string]any{
		"animation":            true,
		"bounceAnimationSpeed": 2,
	})
	plain := mustAvatar(t, style, map[string]any{"animation": true})

	if listed.SVG() != plain.SVG() {
		t.Errorf("an unknown name should not change the output\n got: %s\nwant: %s", listed.SVG(), plain.SVG())
	}
	if _, ok := listed.ResolvedOptions()["bounceAnimationSpeed"]; ok {
		t.Error("bounceAnimationSpeed should stay out of the resolved options")
	}
}

func TestPerNameSpeedLeavesATimelineThatDoesNotPlayUntouched(t *testing.T) {
	style := mustStyle(t, pacedStyle)
	off := mustAvatar(t, style, map[string]any{
		"animation":          false,
		"swayAnimationSpeed": 2,
	})
	static := mustAvatar(t, style, nil)

	if off.SVG() != static.SVG() {
		t.Errorf("a static render should ignore the option\n got: %s\nwant: %s", off.SVG(), static.SVG())
	}
	if _, ok := off.ResolvedOptions()["swayAnimationSpeed"]; ok {
		t.Error("swayAnimationSpeed should stay out of the resolved options")
	}
}

func TestPerNameSpeedIncludesTheNamedFactorInTheClassNamespace(t *testing.T) {
	style := mustStyle(t, pacedStyle)
	named := mustAvatar(t, style, map[string]any{
		"animation":          true,
		"swayAnimationSpeed": 2,
	}).SVG()
	global := mustAvatar(t, style, map[string]any{
		"animation":      true,
		"animationSpeed": 2,
	}).SVG()

	if animationHashOf(t, named) == animationHashOf(t, global) {
		t.Errorf("the named factor should hash differently from the global one, got %s", animationHashOf(t, named))
	}
}

func TestPerNameSpeedRecordsTheDrawnFactorInTheResolvedOptions(t *testing.T) {
	options := mustAvatar(t, mustStyle(t, pacedStyle), map[string]any{
		"animation":          true,
		"swayAnimationSpeed": []any{2, 2},
	}).ResolvedOptions()

	if got := options["swayAnimationSpeed"]; got != 2.0 {
		t.Errorf("resolved swayAnimationSpeed = %v, want 2", got)
	}
	if got := options["animationSpeed"]; got != 1.0 {
		t.Errorf("resolved animationSpeed = %v, want 1", got)
	}
}

// namedStyle carries one named block per element plus an unnamed one, so
// every switch has something to include and something to skip. Mirrors the
// describe('named selection', ...) block of the JS reference suite
// (src/js/core/tests/Renderer.test.js).
const namedStyle = `{
	"canvas": {
		"width": 100,
		"height": 100,
		"elements": [
			{
				"type": "element",
				"name": "rect",
				"animations": [
					{
						"name": "sway",
						"duration": 1,
						"tracks": { "rotate": { "keyframes": [{ "at": 0, "value": 0 }, { "at": 100, "value": 4 }] } }
					}
				]
			},
			{
				"type": "element",
				"name": "circle",
				"animations": [
					{
						"name": "blink",
						"duration": 2,
						"tracks": { "scaleY": { "keyframes": [{ "at": 0, "value": 1 }, { "at": 50, "value": 0.1 }] } }
					},
					{
						"duration": 3,
						"tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }, { "at": 50, "value": 0.5 }] } }
					}
				]
			}
		]
	}
}`

func TestNamedSelectionPlaysOnlyATimelineSwitchedOnByName(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, namedStyle), map[string]any{"blinkAnimation": true}).SVG()

	if got := strings.Count(svg, "animation:"); got != 1 {
		t.Errorf("animation rules = %d, want 1 in: %s", got, svg)
	}
	if !strings.Contains(svg, "scaleY") {
		t.Errorf("SVG should contain the blink track, got: %s", svg)
	}
	if strings.Contains(svg, "rotate(") || strings.Contains(svg, "opacity:") {
		t.Errorf("SVG should contain neither the sway nor the unnamed track, got: %s", svg)
	}
	if got := strings.Count(svg, `<g class="dba-`); got != 1 {
		t.Errorf("animation wrappers = %d, want 1 in: %s", got, svg)
	}
}

func TestNamedSelectionCombinesSeveralSwitches(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, namedStyle), map[string]any{
		"swayAnimation":  true,
		"blinkAnimation": true,
	}).SVG()

	if got := strings.Count(svg, "animation:"); got != 2 {
		t.Errorf("animation rules = %d, want 2 in: %s", got, svg)
	}
	if !strings.Contains(svg, "rotate(") || !strings.Contains(svg, "scaleY") {
		t.Errorf("SVG should contain the sway and blink tracks, got: %s", svg)
	}
	if strings.Contains(svg, "opacity:") {
		t.Errorf("SVG should not contain the unnamed track, got: %s", svg)
	}
}

func TestNamedSelectionPlaysUnnamedTimelinesOnlyThroughTheGlobalSwitch(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, namedStyle), map[string]any{"animation": true}).SVG()

	if got := strings.Count(svg, "animation:"); got != 3 {
		t.Errorf("animation rules = %d, want 3 in: %s", got, svg)
	}
	if !strings.Contains(svg, "opacity:") {
		t.Errorf("SVG should contain the unnamed track, got: %s", svg)
	}
}

func TestNamedSelectionSwitchesATimelineOffWhileTheRestPlay(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, namedStyle), map[string]any{
		"animation":      true,
		"blinkAnimation": false,
	}).SVG()

	if got := strings.Count(svg, "animation:"); got != 2 {
		t.Errorf("animation rules = %d, want 2 in: %s", got, svg)
	}
	if strings.Contains(svg, "scaleY") {
		t.Errorf("SVG should not contain the blink track, got: %s", svg)
	}
	if !strings.Contains(svg, "rotate(") || !strings.Contains(svg, "opacity:") {
		t.Errorf("SVG should contain the sway and unnamed tracks, got: %s", svg)
	}
}

func TestNamedSelectionStaysStaticForANameTheStyleDoesNotCarry(t *testing.T) {
	style := mustStyle(t, namedStyle)
	switched := mustAvatar(t, style, map[string]any{"bounceAnimation": true})
	off := mustAvatar(t, style, nil)

	if switched.SVG() != off.SVG() {
		t.Errorf("an unknown name should not change the output\n got: %s\nwant: %s", switched.SVG(), off.SVG())
	}
	if _, ok := switched.ResolvedOptions()["bounceAnimation"]; ok {
		t.Error("bounceAnimation should stay out of the resolved options")
	}
}

func TestNamedSelectionRecordsTheSwitchesInTheResolvedOptions(t *testing.T) {
	options := mustAvatar(t, mustStyle(t, namedStyle), map[string]any{"blinkAnimation": true}).ResolvedOptions()

	if got := options["animation"]; got != false {
		t.Errorf("resolved animation = %v, want false", got)
	}
	if got := options["blinkAnimation"]; got != true {
		t.Errorf("resolved blinkAnimation = %v, want true", got)
	}
	if _, ok := options["swayAnimation"]; ok {
		t.Error("swayAnimation should stay out of the resolved options")
	}
}

func TestNamedSelectionIncludesTheSwitchesInTheClassNamespace(t *testing.T) {
	style := mustStyle(t, namedStyle)
	all := animationHashOf(t, mustAvatar(t, style, map[string]any{"animation": true}).SVG())
	one := animationHashOf(t, mustAvatar(t, style, map[string]any{"blinkAnimation": true}).SVG())
	allButOne := animationHashOf(t, mustAvatar(t, style, map[string]any{
		"animation":      true,
		"blinkAnimation": false,
	}).SVG())

	if all == one || all == allButOne || one == allButOne {
		t.Errorf("switch combinations should hash apart, got all=%s one=%s allButOne=%s", all, one, allButOne)
	}
}

// The delay tests mirror the delay cases of the describe('per-name speed and
// delay', ...) block of the JS reference suite, on the same paced style.

func TestPerNameDelayAddsTheDelayAfterTheSpeedHasScaledTheAuthoredOne(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, pacedStyle), map[string]any{
		"animation":      true,
		"animationSpeed": 2,
		"animationDelay": 3,
	}).SVG()

	for _, want := range []string{"animation:2s linear 3.5s infinite", "animation:1.5s linear 3s infinite"} {
		if !strings.Contains(svg, want) {
			t.Errorf("SVG should contain %q, got: %s", want, svg)
		}
	}
}

func TestPerNameDelayLetsANamedDelayWinOverTheGlobalOne(t *testing.T) {
	svg := mustAvatar(t, mustStyle(t, pacedStyle), map[string]any{
		"animation":          true,
		"animationDelay":     1,
		"swayAnimationDelay": -2,
	}).SVG()

	for _, want := range []string{"animation:4s linear -1s infinite", "animation:3s linear 1s infinite"} {
		if !strings.Contains(svg, want) {
			t.Errorf("SVG should contain %q, got: %s", want, svg)
		}
	}
}

func TestPerNameDelayIncludesTheDelaysInTheClassNamespace(t *testing.T) {
	style := mustStyle(t, pacedStyle)
	plain := animationHashOf(t, mustAvatar(t, style, map[string]any{"animation": true}).SVG())
	shifted := animationHashOf(t, mustAvatar(t, style, map[string]any{
		"animation":      true,
		"animationDelay": 1,
	}).SVG())
	named := animationHashOf(t, mustAvatar(t, style, map[string]any{
		"animation":          true,
		"swayAnimationDelay": 1,
	}).SVG())

	if plain == shifted || shifted == named {
		t.Errorf("delays should hash apart, got plain=%s shifted=%s named=%s", plain, shifted, named)
	}
}

func TestPerNameDelayRecordsTheDelaysInTheResolvedOptions(t *testing.T) {
	style := mustStyle(t, pacedStyle)
	options := mustAvatar(t, style, map[string]any{
		"animation":          true,
		"animationDelay":     1,
		"swayAnimationDelay": []any{-2, -2},
	}).ResolvedOptions()

	if got := options["animationDelay"]; got != 1.0 {
		t.Errorf("resolved animationDelay = %v, want 1", got)
	}
	if got := options["swayAnimationDelay"]; got != -2.0 {
		t.Errorf("resolved swayAnimationDelay = %v, want -2", got)
	}
	if _, ok := mustAvatar(t, style, nil).ResolvedOptions()["animationDelay"]; ok {
		t.Error("a static render should not record animationDelay")
	}
}
