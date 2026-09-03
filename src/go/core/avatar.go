package dicebear

import (
	"bytes"
	"encoding/json"

	"github.com/dicebear/dicebear-go/v11/internal/render"
)

// Avatar is a rendered avatar. NewAvatar immediately resolves and renders the
// SVG; the accessor methods return different serializations of that result.
type Avatar struct {
	svg             string
	resolvedOptions map[string]any
	order           []string
}

// NewAvatar validates options, then resolves and renders an avatar for style.
// A nil options map is treated as empty. Returns an error on invalid options or
// a circular color reference.
//
// Options are normalized through a JSON round-trip, so passing
// map[string]any{"size": 128} (a Go int) behaves the same as the JSON 128.
func NewAvatar(style *Style, options map[string]any) (*Avatar, error) {
	result, err := render.Generate(style, options)
	if err != nil {
		return nil, err
	}

	return &Avatar{svg: result.SVG, resolvedOptions: result.Options, order: result.Order}, nil
}

// String returns the rendered SVG markup (implements fmt.Stringer).
func (a *Avatar) String() string { return a.svg }

// SVG returns the rendered SVG markup.
func (a *Avatar) SVG() string { return a.svg }

// ResolvedOptions returns a deep copy of the fully resolved options used to
// render the avatar. The raw seed is deliberately excluded. The copy is deep
// (color slices are cloned) so a caller mutating the result cannot corrupt the
// avatar's internal state — matching the JS port's structuredClone.
func (a *Avatar) ResolvedOptions() map[string]any {
	out := make(map[string]any, len(a.resolvedOptions))
	for k, v := range a.resolvedOptions {
		if s, ok := v.([]string); ok {
			clone := make([]string, len(s))
			copy(clone, s)
			out[k] = clone
		} else {
			out[k] = v
		}
	}
	return out
}

// JSON returns { "svg", "options" } — the SVG and the resolved options used to
// render it — as JSON bytes.
//
// It is built by hand rather than via json.Marshal for byte parity with the
// other ports: those keep the resolved options in resolution order and do not
// HTML-escape the SVG, whereas json.Marshal would sort the map keys
// alphabetically and escape <, > and & in the embedded markup.
func (a *Avatar) JSON() ([]byte, error) {
	var b bytes.Buffer
	b.WriteString(`{"svg":`)

	svg, err := marshalNoEscape(a.svg)
	if err != nil {
		return nil, err
	}
	b.Write(svg)

	b.WriteString(`,"options":{`)
	for i, key := range a.order {
		if i > 0 {
			b.WriteByte(',')
		}
		k, err := marshalNoEscape(key)
		if err != nil {
			return nil, err
		}
		b.Write(k)
		b.WriteByte(':')
		v, err := marshalNoEscape(a.resolvedOptions[key])
		if err != nil {
			return nil, err
		}
		b.Write(v)
	}
	b.WriteString("}}")

	return b.Bytes(), nil
}

// DataURI returns the SVG encoded as a data:image/svg+xml URI.
func (a *Avatar) DataURI() string {
	return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(a.svg)
}

// marshalNoEscape JSON-encodes v without escaping <, > and & (which json.Marshal
// does by default), and strips the trailing newline json.Encoder appends.
func marshalNoEscape(v any) ([]byte, error) {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	if err := enc.Encode(v); err != nil {
		return nil, err
	}
	return bytes.TrimRight(buf.Bytes(), "\n"), nil
}

// encodeURIComponent percent-encodes s exactly like JavaScript's
// encodeURIComponent: every byte is escaped except the unreserved set
// A-Za-z0-9 and -_.!~*'().
func encodeURIComponent(s string) string {
	const upperhex = "0123456789ABCDEF"
	const unreserved = "-_.!~*'()"

	var b []byte
	for i := 0; i < len(s); i++ {
		c := s[i]
		switch {
		case c >= 'A' && c <= 'Z', c >= 'a' && c <= 'z', c >= '0' && c <= '9':
			b = append(b, c)
		case indexByteString(unreserved, c):
			b = append(b, c)
		default:
			b = append(b, '%', upperhex[c>>4], upperhex[c&0x0f])
		}
	}
	return string(b)
}

func indexByteString(set string, c byte) bool {
	for i := 0; i < len(set); i++ {
		if set[i] == c {
			return true
		}
	}
	return false
}
