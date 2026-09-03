// Package render resolves options against a style and turns the element tree
// into the final SVG. It bundles the option resolver, the renderer, and the
// metadata/escaping helpers; Generate is the single entry point the public
// Avatar uses.
package render

import (
	"encoding/json"

	"github.com/dicebear/dicebear-go/v11/internal/style"
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
func Generate(s *style.Style, opts map[string]any) (*Result, error) {
	if opts == nil {
		opts = map[string]any{}
	}

	optionsJSON, err := json.Marshal(opts)
	if err != nil {
		return nil, err
	}

	if err := validate.Options(optionsJSON); err != nil {
		return nil, err
	}

	var normalized map[string]any
	if err := json.Unmarshal(optionsJSON, &normalized); err != nil {
		return nil, err
	}

	res := newResolver(s, newOptions(normalized))
	svg, err := newRenderer(s, res).render()
	if err != nil {
		return nil, err
	}

	return &Result{SVG: svg, Options: res.resolved(), Order: res.resolvedOrder()}, nil
}
