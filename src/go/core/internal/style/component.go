package style

import (
	"encoding/json"

	"github.com/dicebear/dicebear-go/v11/internal/prng"
)

// Component is a read-only view over an entry in a style definition's
// components block. An entry is either a base component with its own dimensions
// and variants or an alias declared via extends; aliases share the source's
// data and delegate every accessor to it.
type Component struct {
	name       string
	sourceName string
	data       *componentData
}

// componentData is the intrinsic data of a base component, shared by its
// aliases.
type componentData struct {
	Width       float64                     `json:"width"`
	Height      float64                     `json:"height"`
	Probability *float64                    `json:"probability"`
	Rotate      *prng.Range                 `json:"rotate"`
	Scale       *prng.Range                 `json:"scale"`
	Translate   *componentTranslate         `json:"translate"`
	Variants    map[string]ComponentVariant `json:"variants"`
}

func (c *Component) Name() string       { return c.name }
func (c *Component) SourceName() string { return c.sourceName }
func (c *Component) IsAlias() bool      { return c.name != c.sourceName }

func (c *Component) Width() float64  { return c.data.Width }
func (c *Component) Height() float64 { return c.data.Height }

// Probability returns the render probability (0–100), defaulting to 100.
func (c *Component) Probability() float64 {
	if c.data.Probability != nil {
		return *c.data.Probability
	}
	return 100
}

func (c *Component) Rotate() *prng.Range { return c.data.Rotate }
func (c *Component) Scale() *prng.Range  { return c.data.Scale }

func (c *Component) TranslateX() *prng.Range {
	if c.data.Translate != nil {
		return c.data.Translate.X
	}
	return nil
}

func (c *Component) TranslateY() *prng.Range {
	if c.data.Translate != nil {
		return c.data.Translate.Y
	}
	return nil
}

func (c *Component) Variants() map[string]ComponentVariant { return c.data.Variants }

// decodeComponents splits the raw components block into base components and
// aliases (name → source name), leaving alias validity for validateAliases.
func decodeComponents(raw map[string]json.RawMessage) (map[string]*componentData, map[string]string, error) {
	bases := map[string]*componentData{}
	aliases := map[string]string{}

	for name, message := range raw {
		var probe struct {
			Extends *string `json:"extends"`
		}
		if err := json.Unmarshal(message, &probe); err != nil {
			return nil, nil, err
		}

		if probe.Extends != nil {
			aliases[name] = *probe.Extends
			continue
		}

		var data componentData
		if err := json.Unmarshal(message, &data); err != nil {
			return nil, nil, err
		}
		bases[name] = &data
	}

	return bases, aliases, nil
}

// flattenComponents resolves the base/alias split into a single map. Each alias
// shares its source's data; an alias whose source is missing is skipped (the
// missing source is reported by validateAliases).
func flattenComponents(bases map[string]*componentData, aliases map[string]string) map[string]*Component {
	components := make(map[string]*Component, len(bases)+len(aliases))

	for name, data := range bases {
		components[name] = &Component{name: name, sourceName: name, data: data}
	}
	for name, extends := range aliases {
		if data, ok := bases[extends]; ok {
			components[name] = &Component{name: name, sourceName: extends, data: data}
		}
	}

	return components
}
