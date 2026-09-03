package render

import (
	"github.com/dicebear/dicebear-go/v10/color"
	"github.com/dicebear/dicebear-go/v10/internal/errs"
	"github.com/dicebear/dicebear-go/v10/internal/prng"
	"github.com/dicebear/dicebear-go/v10/internal/style"
)

// resolver derives every deterministic value for an avatar from the style, the
// user options, and a seeded PRNG, exposing them as memoized named accessors.
//
// Every value the resolver picks is recorded in a snapshot (resolved), which
// the public Avatar.JSON returns. The raw seed is deliberately excluded. The
// PRNG is key-based and order-independent, so the snapshot doubles as the memo
// and the only mutable state besides the colorResolving stack that detects
// circular color references.
type resolver struct {
	style          *style.Style
	options        *options
	rng            *prng.Prng
	colorResolving []string
	result         map[string]any
	order          []string
	tags           *tagFilter
}

func newResolver(s *style.Style, opts *options) *resolver {
	seed, _ := opts.seed()
	return &resolver{
		style:   s,
		options: opts,
		rng:     prng.New(seed),
		result:  map[string]any{},
	}
}

func strIdentity(s string) string { return s }

// record inserts a snapshot value if the key has not been recorded yet (the
// first write wins, mirroring the JS #memo). Insertion order is tracked so the
// JSON envelope can emit keys in resolution order, like the JS/Rust ports.
func (r *resolver) record(key string, value any) {
	if _, ok := r.result[key]; !ok {
		r.result[key] = value
		r.order = append(r.order, key)
	}
}

// seed is deliberately not recorded — it is the one input kept out of the
// resolved snapshot, so a serialized avatar never leaks it.
func (r *resolver) seed() string {
	s, _ := r.options.seed()
	return s
}

func (r *resolver) size() *float64 {
	v := r.options.size()
	if v != nil {
		r.record("size", *v)
	} else {
		r.record("size", nil)
	}
	return v
}

func (r *resolver) idRandomization() bool {
	v := false
	if p := r.options.idRandomization(); p != nil {
		v = *p
	}
	r.record("idRandomization", v)
	return v
}

// animation returns the global animation switch, recorded under `animation`,
// default false. Deliberately without PRNG involvement: whether an avatar
// animates must not depend on the seed.
func (r *resolver) animation() bool {
	v := false
	if p := r.options.animation(); p != nil {
		v = *p
	}
	r.record("animation", v)
	return v
}

// animationPlays reports whether one timeline plays. A named timeline follows
// its ${name}Animation switch when the user set one, recorded under that key,
// and the global switch otherwise. Unnamed timelines (name is "") always
// follow the global switch. The switch is read only when asked for, so a name
// the style does not carry leaves nothing in the snapshot.
func (r *resolver) animationPlays(name string) bool {
	if name == "" {
		return r.animation()
	}

	v, ok := r.options.animationFor(name)
	if !ok {
		return r.animation()
	}

	r.record(name+"Animation", v)
	return v
}

func (r *resolver) animationSpeed() float64 {
	return r.floatOpt("animationSpeed", r.options.animationSpeed(), 1)
}

// animationSpeedFor returns the speed factor of one timeline. A named
// timeline plays at its ${name}AnimationSpeed option when the user set one,
// drawn under that key, and at the global factor otherwise. Unnamed timelines
// (name is "") always follow the global factor. The option is resolved only
// when asked for, so a name the style does not carry leaves nothing in the
// snapshot.
func (r *resolver) animationSpeedFor(name string) float64 {
	if name == "" {
		return r.animationSpeed()
	}

	rng := r.options.animationSpeedFor(name)
	if rng == nil {
		return r.animationSpeed()
	}

	return r.floatOpt(name+"AnimationSpeed", rng, 1)
}

// animationDelay returns the start offset in seconds shared by every
// timeline, drawn under `animationDelay`, default 0.
func (r *resolver) animationDelay() float64 {
	return r.floatOpt("animationDelay", r.options.animationDelay(), 0)
}

// animationDelayFor returns the start offset of one timeline. A named
// timeline uses its ${name}AnimationDelay option when the user set one, drawn
// under that key, and the global offset otherwise. Unnamed timelines (name is
// "") always follow the global offset. Mirrors animationSpeedFor.
func (r *resolver) animationDelayFor(name string) float64 {
	if name == "" {
		return r.animationDelay()
	}

	rng := r.options.animationDelayFor(name)
	if rng == nil {
		return r.animationDelay()
	}

	return r.floatOpt(name+"AnimationDelay", rng, 0)
}

func (r *resolver) title() (string, bool) {
	s, ok := r.options.title()
	if ok {
		r.record("title", s)
	} else {
		r.record("title", nil)
	}
	return s, ok
}

func (r *resolver) flip() string {
	v, ok := prng.Pick(r.rng, "flip", r.options.flip(), strIdentity)
	if !ok {
		v = "none"
	}
	r.record("flip", v)
	return v
}

func (r *resolver) fontFamily() string {
	v, ok := prng.Pick(r.rng, "fontFamily", r.options.fontFamily(), strIdentity)
	if !ok {
		v = "system-ui"
	}
	r.record("fontFamily", v)
	return v
}

func (r *resolver) fontWeight() float64 {
	v, ok := prng.Pick(r.rng, "fontWeight", r.options.fontWeight(), prng.NumString)
	if !ok {
		v = 400
	}
	r.record("fontWeight", v)
	return v
}

func (r *resolver) scale() float64 { return r.floatOpt("scale", r.options.scale(), 1) }
func (r *resolver) borderRadius() float64 {
	return r.floatOpt("borderRadius", r.options.borderRadius(), 0)
}
func (r *resolver) rotate() float64     { return r.floatOpt("rotate", r.options.rotate(), 0) }
func (r *resolver) translateX() float64 { return r.floatOpt("translateX", r.options.translateX(), 0) }
func (r *resolver) translateY() float64 { return r.floatOpt("translateY", r.options.translateY(), 0) }

// variant selects a variant for the given component, or ("", false) when the
// component is unknown or rolled invisible.
func (r *resolver) variant(name string) (string, bool) {
	v, ok := r.resolveVariant(name)
	if ok {
		r.record(name+"Variant", v)
	} else {
		r.record(name+"Variant", nil)
	}
	return v, ok
}

func (r *resolver) resolveVariant(name string) (string, bool) {
	comp, ok := r.style.Components()[name]
	if !ok {
		return "", false
	}
	if !r.isVisible(name, comp) {
		return "", false
	}

	return r.rng.WeightedPick(name+"Variant", r.variantWeights(comp))
}

// variantWeights builds the name → weight map the PRNG draws a variant from. The
// per-component ${name}Variant option is more specific than the global tags
// filter, so it takes precedence: when set, it fully governs the component's pool
// (its named variants, weighted by the option) and the tags filter is ignored for
// that component. The tags filter applies only where the user gave no explicit
// ${name}Variant, and falls back to every variant when neither is set. Names the
// style does not define are dropped, and an empty ${name}Variant (or an empty tag
// result) yields no variant.
func (r *resolver) variantWeights(comp *style.Component) map[string]float64 {
	variants := comp.Variants()
	named, hasNamed := r.options.componentVariant(comp.SourceName())
	weights := map[string]float64{}

	if hasNamed {
		for v, w := range named {
			if _, exists := variants[v]; exists {
				weights[v] = w
			}
		}
		return weights
	}

	if len(r.options.tags()) > 0 {
		for _, v := range r.tagFilteredNames(variants) {
			weights[v] = variants[v].WeightOr1()
		}
		return weights
	}

	for v, variant := range variants {
		weights[v] = variant.WeightOr1()
	}
	return weights
}

type tagAllow struct {
	category string
	values   []string
}

type tagDisallow struct {
	category string
	value    string
	hasValue bool
}

// tagFilter holds the parsed options.tags tokens grouped by role. bareDisallows
// is the subset of disallows carrying no value, kept as a lookup set for the
// per-component narrowing.
type tagFilter struct {
	allowGroups   []*tagAllow
	bares         []string
	disallows     []tagDisallow
	bareDisallows map[string]bool
}

// tagFilter classifies the parsed options.tags tokens into the allow groups,
// bare requirements and disallows the filter is composed from. The result
// depends only on the options, never on a component, so it is computed once per
// avatar rather than rebuilt for each of a style's components.
func (r *resolver) tagFilter() *tagFilter {
	if r.tags != nil {
		return r.tags
	}

	f := &tagFilter{bareDisallows: map[string]bool{}}
	allowIndex := map[string]*tagAllow{}
	bareSeen := map[string]bool{}

	for _, tok := range r.options.tags() {
		if tok.negated {
			f.disallows = append(f.disallows, tagDisallow{category: tok.category, value: tok.value, hasValue: tok.hasValue})
			if !tok.hasValue {
				f.bareDisallows[tok.category] = true
			}
		} else if tok.hasValue {
			grp, ok := allowIndex[tok.category]
			if !ok {
				grp = &tagAllow{category: tok.category}
				allowIndex[tok.category] = grp
				f.allowGroups = append(f.allowGroups, grp)
			}
			grp.values = append(grp.values, tok.value)
		} else if !bareSeen[tok.category] {
			bareSeen[tok.category] = true
			f.bares = append(f.bares, tok.category)
		}
	}

	r.tags = f

	return f
}

// tagFilteredNames narrows a component's variants to the names satisfying the
// global tags filter, applying the parsed options.tags tokens in one pass over
// the pool:
//
//   - A positive cat:value token is an axis-scoped allow. Within each category
//     some allow mentions, a variant is kept only if it carries no tag in that
//     category (untouched) or matches one of the allowed values (OR within the
//     category). Distinct allowed categories combine with AND, and a category no
//     allow mentions is left unconstrained.
//   - A bare positive cat token requires the category: it drops variants that
//     carry no tag in cat. It only binds where the category is in use — a
//     component with no cat tag on any variant is left untouched, so animation
//     turns on a style's opt-in animation without erasing the components that
//     know nothing about it.
//   - A negative !cat / !cat:value token disallows, dropping every variant
//     carrying any tag in cat (bare) or the exact cat:value tag. Disallows are
//     checked alongside allows but always win.
//
// The result order is irrelevant: WeightedPick sorts the names internally.
func (r *resolver) tagFilteredNames(variants map[string]style.ComponentVariant) []string {
	f := r.tagFilter()
	allowGroups, bares, disallows := f.allowGroups, f.bares, f.disallows

	// A bare token only binds where its category is in use, so this narrowing —
	// unlike the classification — is genuinely per-component.
	var required []string
	for _, category := range bares {
		if f.bareDisallows[category] {
			continue
		}
		for _, variant := range variants {
			if variant.HasTag(category, "", false) {
				required = append(required, category)
				break
			}
		}
	}

	var names []string
	for name, variant := range variants {
		allowed := true
		for _, category := range required {
			if !variant.HasTag(category, "", false) {
				allowed = false
				break
			}
		}
		if !allowed {
			continue
		}

		for _, grp := range allowGroups {
			if !variant.HasTag(grp.category, "", false) {
				continue
			}
			matched := false
			for _, value := range grp.values {
				if variant.HasTag(grp.category, value, true) {
					matched = true
					break
				}
			}
			if !matched {
				allowed = false
				break
			}
		}
		if !allowed {
			continue
		}

		disallowed := false
		for _, ex := range disallows {
			if variant.HasTag(ex.category, ex.value, ex.hasValue) {
				disallowed = true
				break
			}
		}

		if !disallowed {
			names = append(names, name)
		}
	}

	return names
}

func (r *resolver) color(name string) ([]string, error) {
	key := name + "Color"

	// Memoize like the JS #memo: a color already resolved this pass is returned
	// from the snapshot instead of being recomputed. Without it, a graph where
	// each color references the next via both contrastTo and notEqualTo
	// re-resolves exponentially (a schema-valid DoS).
	if cached, ok := r.cachedColor(key); ok {
		return cached, nil
	}

	value, err := r.resolveColor(name)
	if err != nil {
		return nil, err
	}
	r.record(key, value)
	return value, nil
}

func (r *resolver) cachedColor(key string) ([]string, bool) {
	v, ok := r.result[key]
	if !ok {
		return nil, false
	}
	if arr, ok := v.([]string); ok {
		return arr, true
	}
	return nil, true
}

func (r *resolver) colorFill(name string) string {
	v, ok := prng.Pick(r.rng, name+"ColorFill", r.options.colorFill(name), strIdentity)
	if !ok {
		v = "solid"
	}
	r.record(name+"ColorFill", v)
	return v
}

func (r *resolver) colorAngle(name string) float64 {
	return r.floatOpt(name+"ColorAngle", r.options.colorAngle(name), 0)
}

// colorOrder returns the user's ${name}ColorOrder, or "random" when unset.
// Deliberately not recorded: unlike colorFill this is no PRNG pick, so it
// stays out of the resolved snapshot.
func (r *resolver) colorOrder(name string) string {
	if v := r.options.colorOrder(name); v != "" {
		return v
	}
	return style.ColorOrderRandom
}

// componentTransform returns (rotate, translateX, translateY, scale) for a
// component, each recorded as ${name}Rotate / ${name}TranslateX / … in the
// snapshot.
func (r *resolver) componentTransform(name string) (rotate, translateX, translateY, scale float64) {
	comp := r.style.Components()[name]

	var rRange, sRange, txRange, tyRange *prng.Range
	if comp != nil {
		rRange = comp.Rotate()
		sRange = comp.Scale()
		txRange = comp.TranslateX()
		tyRange = comp.TranslateY()
	}

	rotate = r.floatOpt(name+"Rotate", rRange, 0)
	translateX = r.floatOpt(name+"TranslateX", txRange, 0)
	translateY = r.floatOpt(name+"TranslateY", tyRange, 0)
	scale = r.floatOpt(name+"Scale", sRange, 1)
	return
}

// resolved returns an informational snapshot of every value the resolver
// picked. Unset (nil) entries are filtered out; the raw seed is excluded.
func (r *resolver) resolved() map[string]any {
	out := make(map[string]any, len(r.result))
	for k, v := range r.result {
		if v != nil {
			out[k] = v
		}
	}
	return out
}

// resolvedOrder returns the snapshot keys with non-nil values in the order they
// were first recorded, matching the JS/Rust resolution order for the JSON
// envelope.
func (r *resolver) resolvedOrder() []string {
	out := make([]string, 0, len(r.order))
	for _, k := range r.order {
		if r.result[k] != nil {
			out = append(out, k)
		}
	}
	return out
}

func (r *resolver) probability(comp *style.Component) float64 {
	if p := r.options.componentProbability(comp.SourceName()); p != nil {
		return *p
	}
	return comp.Probability()
}

func (r *resolver) isVisible(name string, comp *style.Component) bool {
	return r.rng.Bool(name+"Probability", r.probability(comp))
}

// resolveColor resolves a named color to its final stop list, applying
// contrast sorting and notEqualTo filtering from the style definition.
// Circular references between colors (e.g. a.contrastTo = b, b.contrastTo = a)
// are detected via the colorResolving stack and reported as a
// CircularColorReferenceError.
//
// A user-set ${name}ColorOrder: "fixed" pins the candidates to their given
// order, whether they come from the ${name}Color option or from the style's
// palette: the shuffle and the contrast sort are skipped (notEqualTo filtering
// still applies), and the gradient stop count defaults to the number of
// candidates instead of 2.
func (r *resolver) resolveColor(name string) ([]string, error) {
	styleColor, hasStyleColor := r.style.Colors()[name]

	userColors, hasUserColors := r.options.color(name)
	var source []string
	if hasUserColors {
		source = userColors
	} else if hasStyleColor {
		source = styleColor.Values
	}

	candidates := make([]string, len(source))
	for i, c := range source {
		candidates[i] = color.ToHex(c)
	}

	fixed := r.colorOrder(name) == style.ColorOrderFixed
	fill := r.colorFill(name)
	stops := 1
	if fill != "solid" {
		fallback := 2
		if fixed {
			fallback = len(candidates)
		}
		stops = r.colorFillStops(name, fallback)
	}

	if !hasStyleColor {
		return takeN(r.orderColors(name, candidates, fixed), stops), nil
	}

	// Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a).
	for _, n := range r.colorResolving {
		if n == name {
			chain := append(append([]string{}, r.colorResolving...), name)
			return nil, &errs.CircularColorReferenceError{Chain: chain}
		}
	}

	r.colorResolving = append(r.colorResolving, name)
	err := r.applyColorConstraints(styleColor, &candidates, fixed)
	r.colorResolving = r.colorResolving[:len(r.colorResolving)-1]
	if err != nil {
		return nil, err
	}

	// Skip the shuffle when sorted by contrast, to preserve that ordering.
	ordered := candidates
	if styleColor.ContrastTo == "" {
		ordered = r.orderColors(name, candidates, fixed)
	}

	return takeN(ordered, stops), nil
}

// orderColors applies ${name}ColorOrder to the candidate list. "random"
// shuffles via the PRNG, "fixed" keeps the candidates as given, duplicates
// included.
func (r *resolver) orderColors(name string, candidates []string, fixed bool) []string {
	if fixed {
		return candidates
	}
	return r.rng.Shuffle(name+"Color", candidates)
}

func (r *resolver) applyColorConstraints(styleColor style.ColorDef, candidates *[]string, fixed bool) error {
	if styleColor.ContrastTo != "" && !fixed {
		refColors, err := r.color(styleColor.ContrastTo)
		if err != nil {
			return err
		}
		if len(refColors) > 0 {
			*candidates = color.SortByContrast(*candidates, refColors[0])
		}
	}

	if len(styleColor.NotEqualTo) > 0 {
		var excluded []string
		for _, ref := range styleColor.NotEqualTo {
			cols, err := r.color(ref)
			if err != nil {
				return err
			}
			excluded = append(excluded, cols...)
		}
		*candidates = color.FilterNotEqualTo(*candidates, excluded)
	}

	return nil
}

func (r *resolver) colorFillStops(name string, fallback int) int {
	if rng := r.options.colorFillStops(name); rng != nil {
		n := r.rng.Integer(name+"ColorFillStops", rng)
		if n < 0 {
			n = 0
		}
		return n
	}
	return fallback
}

func (r *resolver) floatOpt(key string, rng *prng.Range, fallback float64) float64 {
	value := fallback
	if rng != nil {
		value = r.rng.Float(key, rng)
	}
	r.record(key, value)
	return value
}

// takeN returns a copy of the first n elements of s (or all of them if n is
// larger), mirroring the JS slice(0, stops).
func takeN(s []string, n int) []string {
	if n > len(s) {
		n = len(s)
	}
	if n < 0 {
		n = 0
	}
	out := make([]string, n)
	copy(out, s[:n])
	return out
}
