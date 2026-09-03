package render

import (
	"strconv"
	"strings"

	"github.com/dicebear/dicebear-go/v11/internal/num"
	"github.com/dicebear/dicebear-go/v11/internal/prng"
	"github.com/dicebear/dicebear-go/v11/internal/style"
)

// animationTrackOrder is the canonical track order, outermost wrapper to
// innermost. It mirrors the usual translate → rotate → scale transform
// composition. Every port must wrap in this exact order for the outputs to
// stay byte-identical.
var animationTrackOrder = [...]string{
	"translateX",
	"translateY",
	"rotate",
	"scaleX",
	"scaleY",
	"opacity",
}

// playingAnimations returns the animation blocks of an element that play.
// The element check comes first: only styles that carry declarative
// animations may touch the options, so the resolved-options snapshot of every
// other avatar stays free of them.
func (r *renderer) playingAnimations(el *style.Element) []*style.Animation {
	if len(el.Animations) == 0 {
		return nil
	}

	// The global switch is read first so it lands in the resolved options
	// whenever a node carries animations, on or off. Named timelines then
	// follow their own switch when the user set one.
	r.resolver.animation()

	var playing []*style.Animation
	for i := range el.Animations {
		animation := &el.Animations[i]
		if r.resolver.animationPlays(animation.Name) {
			playing = append(playing, animation)
		}
	}
	return playing
}

// applyAnimations wraps an element's rendered markup in one <g class="…"> per
// animation track and queues the matching CSS. A no-op when the element
// carries no animations, none of its timelines plays, or the markup rendered
// to nothing (the empty-wrapper pruning then also prunes the animation).
//
// Wrapper nesting is block 0 outermost, and within a block the canonical
// track order (translate before rotate before scale, opacity innermost) — the
// composition contract the Figma plugin maps onto node transforms.
//
// The element's own opacity rides on the innermost opacity wrapper as the
// resting value the keyframes then override.
func (r *renderer) applyAnimations(markup string, el *style.Element) string {
	if markup == "" {
		return markup
	}

	// A skipped timeline contributes neither wrappers nor CSS. If none plays,
	// the markup passes through untouched.
	playing := r.playingAnimations(el)
	if len(playing) == 0 {
		return markup
	}

	var classes []string
	opacityWrapper := -1
	for _, animation := range playing {
		for _, track := range animationTrackOrder {
			if trackData, ok := animation.Tracks[track]; ok {
				if track == "opacity" {
					opacityWrapper = len(classes)
				}
				classes = append(classes, r.buildAnimationCss(animation, track, trackData.Keyframes))
			}
		}
	}

	restingOpacity := ""
	if opacityWrapper >= 0 {
		// Only is empty when the element carries no opacity, and an empty list
		// renders to an empty string. The value comes from the same validated
		// definition as every other attribute, so a render error here is
		// impossible.
		only := el.Attributes.Only("opacity")
		if attrs, err := r.renderAttributes(&only); err == nil {
			restingOpacity = attrs
		}
	}

	result := markup
	for i := len(classes) - 1; i >= 0; i-- {
		opacity := ""
		if i == opacityWrapper {
			opacity = restingOpacity
		}
		result = `<g class="` + classes[i] + `"` + opacity + `>` + result + "</g>"
	}

	return result
}

// attributesWithoutAnimatedOpacity strips the opacity attribute an animated
// opacity track takes over.
//
// A track writes the opacity the author means, not a factor on top of the
// element's own value: an element hidden with opacity="0" is a resting state
// the animation replaces, the way a CSS animation on the element itself would.
// The attribute therefore moves to the animating wrapper, where the keyframes
// override it. With the animation off no wrapper exists and the attribute
// stays where it is.
func (r *renderer) attributesWithoutAnimatedOpacity(el *style.Element) *style.AttrList {
	attributes := &el.Attributes

	// The element check comes first: only styles that carry declarative
	// animations may touch the options, so the resolved-options snapshot of
	// every other avatar stays free of them.
	if _, ok := attributes.Get("opacity"); !ok || len(el.Animations) == 0 {
		return attributes
	}

	for _, animation := range r.playingAnimations(el) {
		if _, ok := animation.Tracks["opacity"]; ok {
			out := attributes.Without("opacity")
			return &out
		}
	}

	return attributes
}

// buildAnimationCss generates the @keyframes block (deduplicated by content,
// so identical tracks on many elements share one block) and the class rule
// for a single track, and returns the class name.
func (r *renderer) buildAnimationCss(animation *style.Animation, track string, keyframes []style.AnimationKeyframe) string {
	body := r.keyframesBody(track, keyframes, animation.Easing)

	keyframesName, ok := r.keyframesByContent[body]
	if !ok {
		keyframesName = "dbk-" + r.animationHash() + "-" + strconv.Itoa(r.keyframesCounter)
		r.keyframesCounter++

		r.keyframesByContent[body] = keyframesName
		r.keyframesCss = append(r.keyframesCss, "@keyframes "+keyframesName+"{"+body+"}")
	}

	speed := r.resolver.animationSpeedFor(animation.Name)
	delaySeconds := 0.0
	if animation.Delay != nil {
		delaySeconds = *animation.Delay
	}
	duration := num.Format(animation.Duration / speed)
	// The offset is wall clock seconds, so it is added after the speed has
	// scaled the authored delay.
	delay := num.Format(delaySeconds/speed + r.resolver.animationDelayFor(animation.Name))

	iterations := "infinite"
	if animation.Iterations != nil {
		if count, finite := animation.Iterations.Finite(); finite {
			iterations = num.Format(count)
		}
	}

	direction := directionCss(animation.Direction)

	fill := animation.Fill
	if fill == "" {
		fill = "none"
	}

	// Only rotate and scale pivot around a point. Translation and opacity
	// need no origin, so their rules skip the transform-box prefix.
	originCss := ""
	if track == "rotate" || track == "scaleX" || track == "scaleY" {
		x, y := 50.0, 50.0
		if animation.Origin != nil {
			x, y = animation.Origin.X, animation.Origin.Y
		}
		originCss = "transform-box:fill-box;transform-origin:" + num.Format(x) + "% " + num.Format(y) + "%;"
	}

	className := "dba-" + r.animationHash() + "-" + strconv.Itoa(r.animationCounter)
	r.animationCounter++

	// The name comes last in the shorthand so it can never be mistaken for a
	// keyword. All seven tokens are always emitted so every port serializes
	// the same string.
	r.animationCss = append(r.animationCss,
		"."+className+"{"+originCss+"animation:"+duration+"s "+easingCss(animation.Easing)+" "+
			delay+"s "+iterations+" "+direction+" "+fill+" "+keyframesName+"}")

	return className
}

// keyframesBody serializes a track's keyframes to a @keyframes body.
// Endpoints are padded with copies of the nearest keyframe so the resting
// value holds outside the keyframed span, matching Figma's hold semantics. A
// keyframe's easing shapes the segment to the next keyframe and is emitted
// only when it differs from the block default (the rule's timing function
// covers the rest). The last keyframe has no following segment, so its easing
// is never emitted.
func (r *renderer) keyframesBody(track string, keyframes []style.AnimationKeyframe, defaultEasing *style.Easing) string {
	list := make([]style.AnimationKeyframe, 0, len(keyframes)+2)
	if keyframes[0].At > 0 {
		list = append(list, style.AnimationKeyframe{At: 0, Value: keyframes[0].Value})
	}
	list = append(list, keyframes...)

	if last := list[len(list)-1]; last.At < 100 {
		list = append(list, style.AnimationKeyframe{At: 100, Value: last.Value})
	}

	defaultCss := easingCss(defaultEasing)

	var b strings.Builder
	for i := range list {
		keyframe := &list[i]

		css := defaultCss
		if keyframe.Easing != nil && i < len(list)-1 {
			css = easingCss(keyframe.Easing)
		}
		timing := ""
		if css != defaultCss {
			timing = ";animation-timing-function:" + css
		}

		b.WriteString(num.Format(keyframe.At) + "%{" + trackDeclaration(track, keyframe.Value) + timing + "}")
	}

	return b.String()
}

// trackDeclaration returns the CSS declaration animating one track at one
// keyframe value.
func trackDeclaration(track string, value float64) string {
	v := num.Format(value)

	switch track {
	case "translateX":
		return "transform:translateX(" + v + "px)"
	case "translateY":
		return "transform:translateY(" + v + "px)"
	case "rotate":
		return "transform:rotate(" + v + "deg)"
	case "scaleX":
		return "transform:scaleX(" + v + ")"
	case "scaleY":
		return "transform:scaleY(" + v + ")"
	default:
		return "opacity:" + v
	}
}

// easingCss serializes an easing to its CSS form. hold renders as step-end.
// nil is the linear default.
func easingCss(easing *style.Easing) string {
	if easing == nil {
		return "linear"
	}

	if !easing.IsBezier() {
		switch easing.Keyword() {
		case "ease":
			return "ease"
		case "easeIn":
			return "ease-in"
		case "easeOut":
			return "ease-out"
		case "easeInOut":
			return "ease-in-out"
		case "hold":
			return "step-end"
		default:
			return "linear"
		}
	}

	x1, y1, x2, y2 := easing.Bezier()
	return "cubic-bezier(" + num.Format(x1) + ", " + num.Format(y1) + ", " +
		num.Format(x2) + ", " + num.Format(y2) + ")"
}

func directionCss(direction string) string {
	switch direction {
	case "reverse":
		return "reverse"
	case "alternate":
		return "alternate"
	case "alternateReverse":
		return "alternate-reverse"
	default:
		return "normal"
	}
}

// registerAnimationStyle registers the accumulated animation CSS as a single
// <style> entry in the shared <defs> block, wrapped in a reduced-motion media
// query so users who prefer reduced motion get the static avatar. A no-op
// when no animation CSS was produced.
func (r *renderer) registerAnimationStyle() {
	if len(r.keyframesCss) == 0 {
		return
	}

	// An authored def may carry the id "animation-style", so the CSS takes
	// the next free key rather than replacing that def.
	key := "animation-style"
	for r.defs.has(key) {
		key += "-"
	}

	r.defs.set(key,
		"<style>@media (prefers-reduced-motion:no-preference){"+
			strings.Join(r.keyframesCss, "")+strings.Join(r.animationCss, "")+"}</style>")
}

// animationHash returns the FNV-1a hex hash namespacing the animation class
// and keyframe names, cached after the first call. Extends the hashSeed input
// with the animation speed, the animation delay and the state of every named
// timeline the style carries: two renders of the same avatar with different
// speeds, delays or switches
// inlined on one page must not select each other's rules, while identical
// renders sharing identical rules is harmless deduplication.
//
// Everything else about an avatar stays out of the hash, so two renders of the
// same style and seed that differ in any other option would share their names
// with different rule bodies. idRandomization is the way out of that collision,
// and it reaches the animation names through this input rather than through the
// id rewrite, which only knows id/url(#…)/href.
func (r *renderer) animationHash() string {
	if r.cachedAnimationHash == nil {
		random := ""
		if r.resolver.idRandomization() {
			random = ":" + r.randomSuffix()
		}

		// Every named timeline the style carries joins the hash with its
		// state, `off` or the factor and offset it plays at, in code unit
		// order (AnimationNames is already sorted that way), so two renders
		// that differ only in a ${name}Animation, ${name}AnimationSpeed or
		// ${name}AnimationDelay option never share their rules. The part is
		// absent when the style has no named timelines.
		names := r.style.AnimationNames()
		states := make([]string, 0, len(names))
		for _, name := range names {
			if r.resolver.animationPlays(name) {
				states = append(states, name+":"+num.Format(r.resolver.animationSpeedFor(name))+":"+num.Format(r.resolver.animationDelayFor(name)))
			} else {
				states = append(states, name+":off")
			}
		}
		named := ""
		if len(states) > 0 {
			named = ":" + strings.Join(states, ",")
		}

		sourceName := ""
		if meta := r.style.Meta(); meta != nil && meta.Source.Name != nil {
			sourceName = *meta.Source.Name
		}
		v := prng.Hex(sourceName + ":" + r.resolver.seed() + ":" + num.Format(r.resolver.animationSpeed()) + ":" + num.Format(r.resolver.animationDelay()) + named + random)
		r.cachedAnimationHash = &v
	}
	return *r.cachedAnimationHash
}
