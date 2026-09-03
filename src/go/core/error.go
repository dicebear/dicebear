package dicebear

import "github.com/dicebear/dicebear-go/v11/internal/errs"

// ValidationError is returned when a style definition or an options object
// fails schema (or, for style definitions, alias) validation. It is an alias of
// the internal error type, so type assertions and errors.As work across the
// package boundary.
type ValidationError = errs.ValidationError

// CircularColorReferenceError is returned when a color in the style definition
// references itself, directly or indirectly.
type CircularColorReferenceError = errs.CircularColorReferenceError
