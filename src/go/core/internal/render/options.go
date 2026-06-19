package render

import (
	"strings"

	"github.com/dicebear/dicebear-go/v10/internal/prng"
)

// tagFilterToken is a parsed `tags` filter token. options.tags decodes each raw
// `category` / `category:value` / `!…` string into this shape so the resolver
// composes the filter without parsing the grammar itself. hasValue distinguishes
// a bare category (`cat`) from an empty value (`cat:`).
type tagFilterToken struct {
	category string
	value    string
	hasValue bool
	negated  bool
}

// options reads and normalizes the raw user-supplied options. Each accessor
// returns the user's input in a normalized form (always a slice for options
// that accept a scalar or a slice, or the zero/absent form when unset), so the
// resolver never has to normalize. The data map is the options object after a
// JSON round-trip, so every number is a float64 and every array a []any.
type options struct {
	data       map[string]any
	tagsParsed bool
	tagTokens  []tagFilterToken
}

func newOptions(data map[string]any) *options {
	if data == nil {
		data = map[string]any{}
	}
	return &options{data: data}
}

func (o *options) get(key string) (any, bool) {
	v, ok := o.data[key]
	if !ok || v == nil {
		return nil, false
	}
	return v, true
}

func (o *options) seed() (string, bool) {
	if v, ok := o.get("seed"); ok {
		if s, ok := v.(string); ok {
			return s, true
		}
	}
	return "", false
}

func (o *options) size() *float64 {
	if v, ok := o.get("size"); ok {
		if n, ok := v.(float64); ok {
			return &n
		}
	}
	return nil
}

func (o *options) idRandomization() *bool {
	if v, ok := o.get("idRandomization"); ok {
		if b, ok := v.(bool); ok {
			return &b
		}
	}
	return nil
}

func (o *options) title() (string, bool) {
	if v, ok := o.get("title"); ok {
		if s, ok := v.(string); ok {
			return s, true
		}
	}
	return "", false
}

func (o *options) flip() []string        { v, _ := o.get("flip"); return asStringArray(v) }
func (o *options) fontFamily() []string  { v, _ := o.get("fontFamily"); return asStringArray(v) }
func (o *options) fontWeight() []float64 { v, _ := o.get("fontWeight"); return asNumberArray(v) }

func (o *options) scale() *prng.Range        { v, _ := o.get("scale"); return toRange(v) }
func (o *options) borderRadius() *prng.Range { v, _ := o.get("borderRadius"); return toRange(v) }
func (o *options) rotate() *prng.Range       { v, _ := o.get("rotate"); return toRange(v) }
func (o *options) translateX() *prng.Range   { v, _ := o.get("translateX"); return toRange(v) }
func (o *options) translateY() *prng.Range   { v, _ := o.get("translateY"); return toRange(v) }

// tags returns the global `tags` filter as parsed tokens, or an empty slice when
// unset. Each raw token (`category` / `category:value`, optionally `!`-prefixed
// to exclude) is decoded into a tagFilterToken so the resolver composes the
// filter without parsing the grammar itself. Memoized, since the resolver reads
// it once per component.
func (o *options) tags() []tagFilterToken {
	if o.tagsParsed {
		return o.tagTokens
	}
	o.tagsParsed = true

	v, _ := o.get("tags")
	raw := asStringArray(v)
	tokens := make([]tagFilterToken, 0, len(raw))
	for _, token := range raw {
		negated := strings.HasPrefix(token, "!")
		body := token
		if negated {
			body = token[1:]
		}

		if sep := strings.IndexByte(body, ':'); sep == -1 {
			tokens = append(tokens, tagFilterToken{category: body, negated: negated})
		} else {
			tokens = append(tokens, tagFilterToken{
				category: body[:sep],
				value:    body[sep+1:],
				hasValue: true,
				negated:  negated,
			})
		}
	}

	o.tagTokens = tokens
	return tokens
}

// componentVariant returns the ${name}Variant constraint as a weighted map, or
// (nil, false) when unset. A bare string or string list is normalized to weight
// 1 each.
func (o *options) componentVariant(name string) (map[string]float64, bool) {
	raw, ok := o.get(name + "Variant")
	if !ok {
		return nil, false
	}

	switch val := raw.(type) {
	case string:
		return map[string]float64{val: 1}, true
	case []any:
		out := map[string]float64{}
		for _, item := range val {
			if s, ok := item.(string); ok {
				out[s] = 1
			}
		}
		return out, true
	case map[string]any:
		out := map[string]float64{}
		for k, v := range val {
			if w, ok := v.(float64); ok {
				out[k] = w
			}
		}
		return out, true
	default:
		return nil, false
	}
}

func (o *options) componentProbability(name string) *float64 {
	if v, ok := o.get(name + "Probability"); ok {
		if n, ok := v.(float64); ok {
			return &n
		}
	}
	return nil
}

// color returns (nil, false) when ${name}Color is unset, so the resolver can
// fall back to the style definition's values.
func (o *options) color(name string) ([]string, bool) {
	raw, ok := o.get(name + "Color")
	if !ok {
		return nil, false
	}
	return asStringArray(raw), true
}

func (o *options) colorFill(name string) []string {
	v, _ := o.get(name + "ColorFill")
	return asStringArray(v)
}

func (o *options) colorAngle(name string) *prng.Range {
	v, _ := o.get(name + "ColorAngle")
	return toRange(v)
}

func (o *options) colorFillStops(name string) *prng.Range {
	v, _ := o.get(name + "ColorFillStops")
	return toRange(v)
}

// asStringArray normalizes a scalar/array/absent string value into a slice.
func asStringArray(value any) []string {
	switch v := value.(type) {
	case []any:
		out := make([]string, 0, len(v))
		for _, item := range v {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	case string:
		return []string{v}
	default:
		return nil
	}
}

// asNumberArray normalizes a scalar/array/absent numeric value into a slice.
func asNumberArray(value any) []float64 {
	switch v := value.(type) {
	case []any:
		out := make([]float64, 0, len(v))
		for _, item := range v {
			if n, ok := item.(float64); ok {
				out = append(out, n)
			}
		}
		return out
	case float64:
		return []float64{v}
	default:
		return nil
	}
}

// toRange normalizes a range option (bare number, [n], [min, max], or absent)
// into a *prng.Range. A bare number becomes a fixed min == max; an empty array
// is treated as unset. Matches the JS, PHP, Python, Rust and Dart ports.
func toRange(value any) *prng.Range {
	switch v := value.(type) {
	case float64:
		return &prng.Range{Min: v, Max: v}
	case []any:
		var nums []float64
		for _, item := range v {
			if n, ok := item.(float64); ok {
				nums = append(nums, n)
			}
		}
		if len(nums) == 0 {
			return nil
		}
		min, max := nums[0], nums[0]
		for _, n := range nums {
			if n < min {
				min = n
			}
			if n > max {
				max = n
			}
		}
		return &prng.Range{Min: min, Max: max}
	default:
		return nil
	}
}
