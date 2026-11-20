// Package errs holds the error types that surface through the public API. It is
// a leaf package so every other internal package can construct these errors
// without an import cycle; the root package re-exports them via type aliases.
package errs

import (
	"fmt"
	"strings"
)

// ValidationError is returned when a style definition or an options object
// fails schema (or, for style definitions, alias) validation. Details carries
// the individual failures; the Subject distinguishes the two schemas.
type ValidationError struct {
	// Subject is either "style definition" or "options".
	Subject string
	// Details holds one entry per failed constraint.
	Details []string
	// Err is the error that made the input invalid when it came from
	// elsewhere, such as encoding/json or a MarshalJSON method of the
	// caller's. It is nil for a failed schema constraint.
	Err error
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("invalid %s: %s", e.Subject, strings.Join(e.Details, "; "))
}

// Unwrap returns Err, so errors.Is and errors.As reach the cause.
func (e *ValidationError) Unwrap() error {
	return e.Err
}

// CircularColorReferenceError is returned when a color in the style definition
// references itself, directly or indirectly (e.g. a.contrastTo = b and
// b.contrastTo = a). Chain reproduces the resolution path that closed the cycle.
type CircularColorReferenceError struct {
	Chain []string
}

func (e *CircularColorReferenceError) Error() string {
	return "Circular color reference: " + strings.Join(e.Chain, " → ")
}
