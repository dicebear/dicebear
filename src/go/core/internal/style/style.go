// Package style is the validated, decomposed model of a style definition: the
// element tree, components (with aliases flattened), colors, and metadata, plus
// the OptionsDescriptor that enumerates a style's accepted options.
package style

import (
	"encoding/json"
	"fmt"
	"sort"

	"github.com/dicebear/dicebear-go/v10/internal/errs"
	"github.com/dicebear/dicebear-go/v10/internal/validate"
)

// definition is the raw, deserialized style definition.
type definition struct {
	ID         string                     `json:"$id"`
	Schema     string                     `json:"$schema"`
	Comment    string                     `json:"$comment"`
	Meta       *Meta                      `json:"meta"`
	Attributes AttrList                   `json:"attributes"`
	Canvas     Canvas                     `json:"canvas"`
	Components map[string]json.RawMessage `json:"components"`
	Colors     map[string]ColorDef        `json:"colors"`
}

// Style is a validated, decomposed wrapper around a style definition. New runs
// the JSON Schema validator and the alias cross-reference check, then flattens
// component aliases so the resolver and renderer can treat every entry
// uniformly.
type Style struct {
	id             string
	schema         string
	comment        string
	meta           *Meta
	attributes     AttrList
	canvas         Canvas
	components     map[string]*Component
	colors         map[string]ColorDef
	hasAnimations  bool
	animationNames []string
}

// New parses and validates a style definition from its JSON bytes.
func New(definitionJSON []byte) (*Style, error) {
	if err := validate.Definition(definitionJSON); err != nil {
		return nil, err
	}

	var def definition
	if err := json.Unmarshal(definitionJSON, &def); err != nil {
		return nil, err
	}

	bases, aliases, err := decodeComponents(def.Components)
	if err != nil {
		return nil, err
	}

	if err := validateAliases(bases, aliases); err != nil {
		return nil, err
	}

	if err := validateAnimations(&def.Canvas, bases); err != nil {
		return nil, err
	}

	return &Style{
		id:             def.ID,
		schema:         def.Schema,
		comment:        def.Comment,
		meta:           def.Meta,
		attributes:     def.Attributes,
		canvas:         def.Canvas,
		components:     flattenComponents(bases, aliases),
		colors:         def.Colors,
		hasAnimations:  computeHasAnimations(&def.Canvas, bases),
		animationNames: computeAnimationNames(&def.Canvas, bases),
	}, nil
}

// ID returns the definition's $id, or "" when not set.
func (s *Style) ID() string { return s.id }

// Schema returns the definition's $schema URI, or "" when not set.
func (s *Style) Schema() string { return s.schema }

// Comment returns the definition's $comment, or "" when not set.
func (s *Style) Comment() string { return s.comment }

// Canvas returns the canvas view.
func (s *Style) Canvas() *Canvas { return &s.canvas }

// RootAttributes returns the root SVG attributes.
func (s *Style) RootAttributes() *AttrList { return &s.attributes }

// Meta returns the metadata view, or nil when absent.
func (s *Style) Meta() *Meta { return s.meta }

// Components returns the flattened name → component map.
func (s *Style) Components() map[string]*Component { return s.components }

// Colors returns the name → color-definition map.
func (s *Style) Colors() map[string]ColorDef { return s.colors }

// HasAnimations reports whether any element in the definition carries
// declarative animations. Computed once at load. Consumed by the options
// descriptor to advertise the animation options only where they have an
// effect.
func (s *Style) HasAnimations() bool { return s.hasAnimations }

// AnimationNames returns the sorted distinct names of the definition's
// animation timelines, possibly empty. Computed once at load. Consumed by the
// options descriptor so tooling can offer the by-name form of the animation
// option. Sorted so every port reports the same order regardless of how it
// walks the definition. Callers must not mutate the returned slice.
func (s *Style) AnimationNames() []string { return s.animationNames }

// validateAliases verifies that every extends references an existing, non-alias
// component — a cross-key constraint the JSON Schema cannot express.
func validateAliases(bases map[string]*componentData, aliases map[string]string) error {
	names := make([]string, 0, len(aliases))
	for name := range aliases {
		names = append(names, name)
	}
	sort.Strings(names) // deterministic error order

	var details []string
	for _, name := range names {
		target := aliases[name]

		if _, isBase := bases[target]; isBase {
			continue
		}

		if _, isAlias := aliases[target]; isAlias {
			details = append(details, fmt.Sprintf(
				"/components/%s/extends references alias \"%s\" — alias chains are not allowed",
				name, target,
			))
			continue
		}

		details = append(details, fmt.Sprintf(
			"/components/%s/extends references unknown component \"%s\"",
			name, target,
		))
	}

	if len(details) > 0 {
		return &errs.ValidationError{Subject: "style definition", Details: details}
	}
	return nil
}

// validateAnimations verifies that every animation track lists its keyframes
// in strictly ascending `at` order — an ordering constraint between array
// items the JSON Schema cannot express. Step jumps are expressed with the
// `hold` easing rather than duplicate positions. All violations are collected
// before failing.
func validateAnimations(canvas *Canvas, bases map[string]*componentData) error {
	var details []string

	visitElements(canvas, bases, func(el *Element, path string) {
		for ai := range el.Animations {
			for _, trackName := range sortedKeys(el.Animations[ai].Tracks) {
				keyframes := el.Animations[ai].Tracks[trackName].Keyframes

				for i := 1; i < len(keyframes); i++ {
					if keyframes[i].At <= keyframes[i-1].At {
						details = append(details, fmt.Sprintf(
							"%s/animations/%d/tracks/%s/keyframes/%d/at must be greater than the previous keyframe",
							path, ai, trackName, i,
						))
					}
				}
			}
		}
	})

	if len(details) > 0 {
		return &errs.ValidationError{Subject: "style definition", Details: details}
	}
	return nil
}

// computeHasAnimations reports whether any element in the definition carries
// animations. Eager where the JS port is lazy: computing it at load keeps
// Style free of mutable state, so instances stay safe to share.
func computeHasAnimations(canvas *Canvas, bases map[string]*componentData) bool {
	found := false

	visitElements(canvas, bases, func(el *Element, _ string) {
		if len(el.Animations) > 0 {
			found = true
		}
	})

	return found
}

// computeAnimationNames collects the sorted distinct names of the definition's
// animation timelines. Eager like computeHasAnimations, so Style stays free of
// mutable state. The result is never nil — the descriptor serializes it as a
// JSON array even when no timeline is named.
func computeAnimationNames(canvas *Canvas, bases map[string]*componentData) []string {
	seen := map[string]struct{}{}
	names := make([]string, 0)

	visitElements(canvas, bases, func(el *Element, _ string) {
		for i := range el.Animations {
			name := el.Animations[i].Name
			if name == "" {
				continue
			}
			if _, ok := seen[name]; !ok {
				seen[name] = struct{}{}
				names = append(names, name)
			}
		}
	})

	sort.Strings(names)
	return names
}

// visitElements walks every element in the definition — the canvas tree and
// every non-alias component variant tree — and invokes visit with the element
// and its JSON pointer path. Component and variant maps are walked in sorted
// name order (deterministic error order).
func visitElements(canvas *Canvas, bases map[string]*componentData, visit func(el *Element, path string)) {
	var walk func(elements []Element, path string)
	walk = func(elements []Element, path string) {
		for i := range elements {
			el := &elements[i]
			elementPath := fmt.Sprintf("%s/%d", path, i)

			visit(el, elementPath)

			if len(el.Children) > 0 {
				walk(el.Children, elementPath+"/children")
			}
		}
	}

	walk(canvas.Elements, "/canvas/elements")

	for _, name := range sortedKeys(bases) {
		component := bases[name]
		for _, variantName := range sortedKeys(component.Variants) {
			walk(
				component.Variants[variantName].Elements,
				fmt.Sprintf("/components/%s/variants/%s/elements", name, variantName),
			)
		}
	}
}

// sortedKeys returns a map's keys in sorted order.
func sortedKeys[V any](m map[string]V) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}
