package style

import (
	"bytes"
	"encoding/json"
	"errors"
)

// Element is a read-only view over a single render-tree node from a style
// definition. The same node type covers SVG elements, text, and component
// references — Type discriminates between them.
type Element struct {
	Type       string      `json:"type"`
	Name       *string     `json:"name"`
	Value      *DynValue   `json:"value"`
	Attributes AttrList    `json:"attributes"`
	Animations []Animation `json:"animations"`
	Children   []Element   `json:"children"`
}

// DynValue is an attribute or element value: a literal string, or a typed
// reference ({ "type": "color" | "variable", "name": "…" }).
type DynValue struct {
	str     string
	isRef   bool
	refKind string
	refName string
}

func (v DynValue) Str() string     { return v.str }
func (v DynValue) IsRef() bool     { return v.isRef }
func (v DynValue) RefKind() string { return v.refKind }
func (v DynValue) RefName() string { return v.refName }

func (v *DynValue) UnmarshalJSON(b []byte) error {
	trimmed := bytes.TrimSpace(b)
	if len(trimmed) > 0 && trimmed[0] == '"' {
		var s string
		if err := json.Unmarshal(trimmed, &s); err != nil {
			return err
		}
		v.str = s
		v.isRef = false
		return nil
	}

	var ref struct {
		Type string `json:"type"`
		Name string `json:"name"`
	}
	if err := json.Unmarshal(trimmed, &ref); err != nil {
		return err
	}
	v.isRef = true
	v.refKind = ref.Type
	v.refName = ref.Name
	return nil
}

// Attr is one ordered key/value pair of an attribute map.
type Attr struct {
	Key   string
	Value DynValue
}

// AttrList is an attribute map that preserves source order, because SVG
// attributes must render in the order they were declared — a plain Go map would
// lose that order (the JS/Rust ports rely on Map / IndexMap for the same
// reason).
type AttrList struct {
	entries []Attr
}

func (a *AttrList) UnmarshalJSON(b []byte) error {
	dec := json.NewDecoder(bytes.NewReader(b))

	tok, err := dec.Token()
	if err != nil {
		return err
	}
	if tok == nil {
		return nil // null attributes
	}
	if delim, ok := tok.(json.Delim); !ok || delim != '{' {
		return errors.New("attributes: expected an object")
	}

	for dec.More() {
		keyTok, err := dec.Token()
		if err != nil {
			return err
		}
		key, _ := keyTok.(string)

		var val DynValue
		if err := dec.Decode(&val); err != nil {
			return err
		}

		// Last-wins on a duplicate key, keeping the first position — matching
		// the JS object / Rust IndexMap semantics, so a definition with a
		// repeated attribute renders a single attribute, not two.
		updated := false
		for i := range a.entries {
			if a.entries[i].Key == key {
				a.entries[i].Value = val
				updated = true
				break
			}
		}
		if !updated {
			a.entries = append(a.entries, Attr{Key: key, Value: val})
		}
	}

	_, err = dec.Token() // consume '}'
	return err
}

// Entries returns the attribute pairs in source order.
func (a AttrList) Entries() []Attr { return a.entries }

// IsEmpty reports whether the list has no attributes.
func (a *AttrList) IsEmpty() bool {
	return a == nil || len(a.entries) == 0
}

// Get returns the value for key and whether it was present.
func (a *AttrList) Get(key string) (DynValue, bool) {
	if a == nil {
		return DynValue{}, false
	}
	for _, e := range a.entries {
		if e.Key == key {
			return e.Value, true
		}
	}
	return DynValue{}, false
}

// Without returns a copy of the attribute list with key removed, keeping the
// order of the remaining attributes.
func (a AttrList) Without(key string) AttrList {
	out := AttrList{entries: make([]Attr, 0, len(a.entries))}
	for _, e := range a.entries {
		if e.Key != key {
			out.entries = append(out.entries, e)
		}
	}
	return out
}

// Only returns a list holding just the attribute for key, or an empty list
// when the attribute is absent.
func (a AttrList) Only(key string) AttrList {
	for _, e := range a.entries {
		if e.Key == key {
			return AttrList{entries: []Attr{e}}
		}
	}
	return AttrList{}
}

// WithTransform returns a copy of the attribute list with the transform
// attribute set, updating it in place if it already exists (keeping its
// position) or appending it — matching the JS object spread.
func (a AttrList) WithTransform(value string) AttrList {
	out := AttrList{entries: append([]Attr(nil), a.entries...)}
	for i := range out.entries {
		if out.entries[i].Key == "transform" {
			out.entries[i].Value = DynValue{str: value}
			return out
		}
	}
	out.entries = append(out.entries, Attr{Key: "transform", Value: DynValue{str: value}})
	return out
}
