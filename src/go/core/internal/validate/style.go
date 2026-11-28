package validate

import (
	"encoding/json"
	"fmt"

	"github.com/dicebear/dicebear-go/v11/internal/errs"
)

const styleSubject = "style definition"

// Style validates a style definition: the depth check, definition.json, then
// the cross-key checks the schema cannot express, in the order aliases,
// component cycles, animations. The checks read the same generic value the
// schema validated, so the definition is decoded once.
func Style(instanceJSON []byte) error {
	inst, err := decode(instanceJSON, styleSubject)
	if err != nil {
		return err
	}

	if err := styleSchema(inst); err != nil {
		return err
	}

	root, _ := inst.(map[string]any)
	bases, aliases := splitComponents(root)

	if err := checkAliases(bases, aliases); err != nil {
		return err
	}

	if err := checkComponentCycles(bases, aliases); err != nil {
		return err
	}

	return checkAnimations(root, bases)
}

// splitComponents splits the components block into base components and
// aliases (name → source name). An entry is an alias when it declares extends.
func splitComponents(root map[string]any) (map[string]map[string]any, map[string]string) {
	bases := map[string]map[string]any{}
	aliases := map[string]string{}

	components, _ := root["components"].(map[string]any)
	for name, raw := range components {
		component, _ := raw.(map[string]any)

		if extends, ok := component["extends"].(string); ok {
			aliases[name] = extends
			continue
		}

		bases[name] = component
	}

	return bases, aliases
}

// checkAliases verifies that every extends references an existing, non-alias
// component — a cross-key constraint the JSON Schema cannot express.
func checkAliases(bases map[string]map[string]any, aliases map[string]string) error {
	var details []string
	for _, name := range sortedKeys(aliases) { // deterministic error order
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
		return &errs.ValidationError{Subject: styleSubject, Details: details}
	}
	return nil
}

// checkComponentCycles verifies that no component renders itself, directly
// or through other components. The renderer registers a variant's <defs> entry
// only after its body has rendered, so a cycle would recurse until the stack
// runs out. A reference to an alias counts as a reference to its source, since
// the alias renders the source's variants. Unknown names render nothing and
// close no cycle. Runs after checkAliases, so every alias points at a base
// component here.
func checkComponentCycles(bases map[string]map[string]any, aliases map[string]string) error {
	type reference struct {
		name, source, path string
	}

	references := make(map[string][]reference, len(bases))

	for _, name := range sortedKeys(bases) {
		var found []reference

		walkVariants(name, bases[name], func(el map[string]any, path string) {
			if el["type"] != "component" {
				return
			}

			referenced, ok := el["name"].(string)
			if !ok {
				return
			}

			if source, isAlias := aliases[referenced]; isAlias {
				found = append(found, reference{referenced, source, path})
			} else if _, isBase := bases[referenced]; isBase {
				found = append(found, reference{referenced, referenced, path})
			}
		})

		references[name] = found
	}

	// Depth-first search: a reference to a component that is still on the
	// stack closes a cycle. The depth is bounded by the number of components.
	onStack := make(map[string]bool)
	done := make(map[string]bool)
	var details []string

	var visit func(name string)
	visit = func(name string) {
		onStack[name] = true

		for _, ref := range references[name] {
			if onStack[ref.source] {
				details = append(details, fmt.Sprintf(
					"%s references component \"%s\", which leads back to \"%s\" — component cycles are not allowed",
					ref.path, ref.name, ref.source,
				))
			} else if !done[ref.source] {
				visit(ref.source)
			}
		}

		delete(onStack, name)
		done[name] = true
	}

	for _, name := range sortedKeys(bases) {
		if !done[name] {
			visit(name)
		}
	}

	if len(details) > 0 {
		return &errs.ValidationError{Subject: styleSubject, Details: details}
	}
	return nil
}

// checkAnimations verifies that every animation track lists its keyframes
// in strictly ascending `at` order — an ordering constraint between array
// items the JSON Schema cannot express. Step jumps are expressed with the
// `hold` easing rather than duplicate positions. All violations are collected
// before failing.
func checkAnimations(root map[string]any, bases map[string]map[string]any) error {
	var details []string

	visitElements(root, bases, func(el map[string]any, path string) {
		animations, _ := el["animations"].([]any)

		for ai, rawAnimation := range animations {
			animation, _ := rawAnimation.(map[string]any)
			tracks, _ := animation["tracks"].(map[string]any)

			for _, trackName := range sortedKeys(tracks) {
				track, _ := tracks[trackName].(map[string]any)
				keyframes, _ := track["keyframes"].([]any)

				for i := 1; i < len(keyframes); i++ {
					if keyframeAt(keyframes[i]) <= keyframeAt(keyframes[i-1]) {
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
		return &errs.ValidationError{Subject: styleSubject, Details: details}
	}
	return nil
}

// keyframeAt returns a keyframe's `at` position as the float64 the typed
// decoder reads, or 0 when it is missing.
func keyframeAt(rawKeyframe any) float64 {
	keyframe, _ := rawKeyframe.(map[string]any)
	at, _ := keyframe["at"].(json.Number)
	value, _ := at.Float64()
	return value
}

// visitElements walks every element in the definition — the canvas tree and
// every non-alias component variant tree — and invokes visit with the element
// and its JSON pointer path. Component and variant maps are walked in sorted
// name order (deterministic error order).
func visitElements(root map[string]any, bases map[string]map[string]any, visit func(el map[string]any, path string)) {
	canvas, _ := root["canvas"].(map[string]any)
	elements, _ := canvas["elements"].([]any)
	walkElements(elements, "/canvas/elements", visit)

	for _, name := range sortedKeys(bases) {
		walkVariants(name, bases[name], visit)
	}
}

// walkVariants walks the element trees of a base component's variants in
// sorted variant name order.
func walkVariants(name string, component map[string]any, visit func(el map[string]any, path string)) {
	variants, _ := component["variants"].(map[string]any)

	for _, variantName := range sortedKeys(variants) {
		variant, _ := variants[variantName].(map[string]any)
		elements, _ := variant["elements"].([]any)

		walkElements(
			elements,
			fmt.Sprintf("/components/%s/variants/%s/elements", name, variantName),
			visit,
		)
	}
}

// walkElements visits each element of a tree depth-first, every element
// before its children.
func walkElements(elements []any, path string, visit func(el map[string]any, path string)) {
	for i, raw := range elements {
		el, _ := raw.(map[string]any)
		elementPath := fmt.Sprintf("%s/%d", path, i)

		visit(el, elementPath)

		children, _ := el["children"].([]any)
		if len(children) > 0 {
			walkElements(children, elementPath+"/children", visit)
		}
	}
}
