package dicebear

import "github.com/dicebear/dicebear-go/v11/internal/style"

// OptionsDescriptor describes every option a given style accepts. Tooling such
// as the editor uses it to render form controls and validation hints.
type OptionsDescriptor = style.OptionsDescriptor

// NewOptionsDescriptor returns a descriptor for the given style.
func NewOptionsDescriptor(s *Style) *OptionsDescriptor {
	return style.NewOptionsDescriptor(s)
}
