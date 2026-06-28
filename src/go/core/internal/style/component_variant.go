package style

import "strings"

// ComponentVariant is a read-only view over an entry in a component's variants
// block.
type ComponentVariant struct {
	Elements []Element `json:"elements"`
	Weight   *float64  `json:"weight"`
	Tags     []string  `json:"tags"`
}

// WeightOr1 returns the weighted-pick weight, defaulting to 1.
func (cv ComponentVariant) WeightOr1() float64 {
	if cv.Weight != nil {
		return *cv.Weight
	}
	return 1
}

// HasTag tests this variant against a single tag-filter token's grammar. With an
// empty value, it matches a whole category: the bare category tag or any
// category:value tag. With a value, it matches only the exact category:value tag.
// The resolver composes these checks into the allow/disallow filter structure.
func (cv ComponentVariant) HasTag(category, value string, hasValue bool) bool {
	if !hasValue {
		prefix := category + ":"
		for _, tag := range cv.Tags {
			if tag == category || strings.HasPrefix(tag, prefix) {
				return true
			}
		}
		return false
	}

	want := category + ":" + value
	for _, tag := range cv.Tags {
		if tag == want {
			return true
		}
	}
	return false
}
