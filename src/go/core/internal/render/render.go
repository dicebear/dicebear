// Package render resolves options against a style and turns the element tree
// into the final SVG. It bundles the option resolver, the renderer, and the
// metadata/escaping helpers; Generate is the single entry point the public
// Avatar uses.
package render

import (
	"encoding/json"

	"github.com/dicebear/dicebear-go/v11/internal/errs"
	"github.com/dicebear/dicebear-go/v11/internal/style"
	"github.com/dicebear/dicebear-go/v11/internal/text"
	"github.com/dicebear/dicebear-go/v11/internal/validate"
)

// Result is the outcome of rendering an avatar: the SVG, the resolved-options
// snapshot, and the order its keys were resolved in (for the JSON envelope).
type Result struct {
	SVG     string
	Options map[string]any
	Order   []string
}

// Generate validates options, resolves them against the style, and renders the
// SVG. A nil options map is treated as empty. Returns an error on invalid
// options or a circular color reference.
//
// Options are normalized through a JSON round-trip, so passing a Go int such as
// map[string]any{"size": 128} behaves the same as the JSON 128.
//
// Ill-formed UTF-8 in the seed and the title becomes U+FFFD first, the same
// text every other port reads. json.Marshal would replace it too, but one
// U+FFFD per byte; text.WellFormed replaces the way every port does.
//
// Options the round-trip cannot carry, such as a value that contains itself or
// one nested deeper than encoding/json reads, are invalid options.
func Generate(s *style.Style, opts map[string]any) (*Result, error) {
	optionsJSON, err := json.Marshal(wellFormedText(opts))
	if err != nil {
		return nil, invalidOptions(err)
	}

	if err := validate.Options(optionsJSON); err != nil {
		return nil, err
	}

	var normalized map[string]any
	if err := json.Unmarshal(optionsJSON, &normalized); err != nil {
		return nil, invalidOptions(err)
	}

	res := newResolver(s, newOptions(normalized))
	svg, err := newRenderer(s, res).render()
	if err != nil {
		return nil, err
	}

	return &Result{SVG: svg, Options: res.resolved(), Order: res.resolvedOrder()}, nil
}

// invalidOptions reports err from the JSON round-trip as invalid options, the
// error a caller checks for. err stays reachable through errors.Is and
// errors.As.
func invalidOptions(err error) error {
	return &errs.ValidationError{Subject: "options", Details: []string{err.Error()}, Err: err}
}

// freeText names the options that carry text of the caller's choosing. Every
// other string option is held to ASCII by the options schema.
var freeText = [...]string{"seed", "title"}

// wellFormedText returns opts with ill-formed UTF-8 in the freeText options
// replaced. It does not change the caller's map: it copies the map, and only
// when there is something to replace. A nil map comes back as an empty one.
//
// It replaces only a value of type string. Any other value under these keys
// is left to json.Marshal and the validator.
func wellFormedText(opts map[string]any) map[string]any {
	if opts == nil {
		return map[string]any{}
	}

	out := opts
	copied := false

	for _, key := range freeText {
		value, ok := opts[key].(string)
		if !ok {
			continue
		}

		replaced := text.WellFormed(value)
		if replaced == value {
			continue
		}

		if !copied {
			out = make(map[string]any, len(opts))
			for k, v := range opts {
				out[k] = v
			}

			copied = true
		}

		out[key] = replaced
	}

	return out
}
