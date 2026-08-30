package style

import "sort"

// The two values of the per-color ${name}ColorOrder option.
const (
	ColorOrderRandom = "random"
	ColorOrderFixed  = "fixed"
)

// OptionsDescriptor builds a descriptor of every option a given style accepts.
// Tooling such as the editor uses the result to render form controls and
// validation hints without having to introspect the style itself.
type OptionsDescriptor struct {
	style *Style
}

func NewOptionsDescriptor(s *Style) *OptionsDescriptor {
	return &OptionsDescriptor{style: s}
}

// ToJSON walks the style's components and colors and assembles the field map.
func (d *OptionsDescriptor) ToJSON() map[string]any {
	result := map[string]any{
		"seed":            map[string]any{"type": "string"},
		"size":            map[string]any{"type": "number", "min": 1, "max": 4096},
		"idRandomization": map[string]any{"type": "boolean"},
		"title":           map[string]any{"type": "string"},
		"flip":            map[string]any{"type": "enum", "values": []string{"none", "horizontal", "vertical", "both"}, "list": true},
		"fontFamily":      map[string]any{"type": "string", "list": true},
		"fontWeight":      map[string]any{"type": "number", "min": 1, "max": 1000, "list": true},
		"scale":           map[string]any{"type": "range", "min": 0, "max": 10},
		"borderRadius":    map[string]any{"type": "range", "min": 0, "max": 50},
		"rotate":          rotateRangeField(),
		"translateX":      translateRangeField(),
		"translateY":      translateRangeField(),
	}

	tagSet := map[string]struct{}{}

	for name, comp := range d.style.components {
		if comp.IsAlias() {
			continue
		}

		variants := make([]string, 0, len(comp.Variants()))
		for v := range comp.Variants() {
			variants = append(variants, v)
		}
		sort.Strings(variants)

		result[name+"Variant"] = map[string]any{"type": "enum", "values": variants, "list": true, "weighted": true}
		result[name+"Probability"] = map[string]any{"type": "number", "min": 0, "max": 100}

		for _, variant := range comp.Variants() {
			for _, tag := range variant.Tags {
				tagSet[tag] = struct{}{}
			}
		}
	}

	colorNames := make([]string, 0, len(d.style.colors)+1)
	for name := range d.style.colors {
		colorNames = append(colorNames, name)
	}
	sort.Strings(colorNames)
	colorNames = append(colorNames, "background")

	for _, name := range colorNames {
		field := map[string]any{"type": "color", "list": true}
		if cd, ok := d.style.colors[name]; ok {
			if cd.ContrastTo != "" {
				field["contrastTo"] = cd.ContrastTo
			}
			if len(cd.NotEqualTo) > 0 {
				field["notEqualTo"] = append([]string(nil), cd.NotEqualTo...)
			}
		}

		result[name+"Color"] = field
		result[name+"ColorFill"] = map[string]any{"type": "enum", "values": []string{"solid", "linear", "radial"}, "list": true}
		result[name+"ColorFillStops"] = map[string]any{"type": "range", "min": 2}
		result[name+"ColorAngle"] = rotateRangeField()
		result[name+"ColorOrder"] = map[string]any{"type": "enum", "values": []string{ColorOrderRandom, ColorOrderFixed}}
	}

	// Only advertise the tags filter when the style actually carries tags. The
	// values are the sorted union of every tag across the style's variants, but
	// open marks them as suggestions: the filter also accepts ! disallows and
	// bare categories. Only an unknown category is ignored. An unknown value
	// inside a category the style does use matches nothing, so every variant
	// tagged on that axis is dropped.
	if len(tagSet) > 0 {
		tags := make([]string, 0, len(tagSet))
		for tag := range tagSet {
			tags = append(tags, tag)
		}
		sort.Strings(tags)
		result["tags"] = map[string]any{"type": "enum", "values": tags, "list": true, "open": true}
	}

	// Only advertise the animation options when the style carries declarative
	// animations — on a static style both are accepted but have no effect. The
	// values are the style's timeline names (possibly none). The option takes
	// true/false or a subset of these names.
	if d.style.HasAnimations() {
		result["animation"] = map[string]any{
			"type":   "animation",
			"values": append([]string{}, d.style.AnimationNames()...),
		}
		result["animationSpeed"] = map[string]any{"type": "range", "min": 0.1, "max": 10}
	}

	return result
}

func rotateRangeField() map[string]any {
	return map[string]any{"type": "range", "min": -360, "max": 360}
}

func translateRangeField() map[string]any {
	return map[string]any{"type": "range", "min": -1000, "max": 1000}
}
