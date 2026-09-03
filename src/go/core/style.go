package dicebear

import "github.com/dicebear/dicebear-go/v11/internal/style"

// Style is a validated, decomposed wrapper around a style definition. Build it
// once with [NewStyle], then reuse it across many avatars.
type Style = style.Style

// NewStyle parses and validates a style definition from its JSON bytes.
func NewStyle(definitionJSON []byte) (*Style, error) {
	return style.New(definitionJSON)
}
