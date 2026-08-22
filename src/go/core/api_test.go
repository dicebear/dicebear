package dicebear

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
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
