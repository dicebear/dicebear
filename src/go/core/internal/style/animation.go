package style

import (
	"bytes"
	"encoding/json"
)

// Animation is one declarative animation timeline on an element: an optional
// user-selectable name, the timing parameters, plus one keyframe list per
// animated track. Name is "" when the timeline is unnamed — the schema pattern
// forbids empty names, so no valid definition carries one.
type Animation struct {
	Name       string                    `json:"name"`
	Duration   float64                   `json:"duration"`
	Delay      *float64                  `json:"delay"`
	Iterations *AnimationIterations      `json:"iterations"`
	Direction  string                    `json:"direction"`
	Fill       string                    `json:"fill"`
	Easing     *Easing                   `json:"easing"`
	Origin     *AnimationOrigin          `json:"origin"`
	Tracks     map[string]AnimationTrack `json:"tracks"`
}

// AnimationOrigin is the transform origin for rotate and scale tracks, as a
// percentage of the element's bounding box.
type AnimationOrigin struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// AnimationTrack is the keyframe list animating one property of an element.
type AnimationTrack struct {
	Keyframes []AnimationKeyframe `json:"keyframes"`
}

// AnimationKeyframe is a single keyframe: a timeline position (percentage of
// the duration), the track value there, and an optional easing shaping the
// segment to the next keyframe.
type AnimationKeyframe struct {
	At     float64 `json:"at"`
	Value  float64 `json:"value"`
	Easing *Easing `json:"easing"`
}

// AnimationIterations is an iteration count: the "infinite" keyword or a
// finite number of runs.
type AnimationIterations struct {
	count  float64
	finite bool
}

// Finite returns the run count and whether it is finite; (0, false) means
// infinite.
func (it AnimationIterations) Finite() (float64, bool) { return it.count, it.finite }

func (it *AnimationIterations) UnmarshalJSON(b []byte) error {
	trimmed := bytes.TrimSpace(b)
	if len(trimmed) > 0 && trimmed[0] == '"' {
		// "infinite" is the only string the schema admits.
		it.finite = false
		return nil
	}

	if err := json.Unmarshal(trimmed, &it.count); err != nil {
		return err
	}
	it.finite = true
	return nil
}

// Easing is an easing for the transition between two keyframes: a named
// keyword ("linear", "ease", …, "hold") or a cubic bezier given by its two
// control points.
type Easing struct {
	keyword        string
	x1, y1, x2, y2 float64
	isBezier       bool
}

func (e Easing) IsBezier() bool  { return e.isBezier }
func (e Easing) Keyword() string { return e.keyword }

// Bezier returns the control points of a bezier easing.
func (e Easing) Bezier() (x1, y1, x2, y2 float64) { return e.x1, e.y1, e.x2, e.y2 }

func (e *Easing) UnmarshalJSON(b []byte) error {
	trimmed := bytes.TrimSpace(b)
	if len(trimmed) > 0 && trimmed[0] == '"' {
		e.isBezier = false
		return json.Unmarshal(trimmed, &e.keyword)
	}

	var bezier struct {
		X1 float64 `json:"x1"`
		Y1 float64 `json:"y1"`
		X2 float64 `json:"x2"`
		Y2 float64 `json:"y2"`
	}
	if err := json.Unmarshal(trimmed, &bezier); err != nil {
		return err
	}
	e.isBezier = true
	e.x1, e.y1, e.x2, e.y2 = bezier.X1, bezier.Y1, bezier.X2, bezier.Y2
	return nil
}
