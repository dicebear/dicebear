package render

import (
	"errors"
	"testing"

	"github.com/dicebear/dicebear-go/v11/internal/errs"
	"github.com/dicebear/dicebear-go/v11/internal/style"
)

func minimalStyle(t *testing.T) *style.Style {
	t.Helper()

	s, err := style.New([]byte(`{"canvas":{"width":100,"height":100,"elements":[]}}`))
	if err != nil {
		t.Fatal(err)
	}

	return s
}

func nest(levels int) any {
	var value any = []any{}

	for i := 1; i < levels; i++ {
		value = []any{value}
	}

	return value
}

// Options the JSON round-trip cannot carry come back as a ValidationError for
// the options, the error a caller looks for with errors.As.
func TestGenerateReportsOptionsTheRoundTripCannotCarryAsInvalid(t *testing.T) {
	list := []any{nil}
	list[0] = list

	self := map[string]any{"seed": "x"}
	self["a"] = self

	cases := map[string]map[string]any{
		"a list that contains itself":     {"backgroundColor": list},
		"options that contain themselves": self,
		"deeper than encoding/json reads": {"backgroundColor": nest(20000)},
		"deeply nested":                   {"seed": nest(5000)},
	}

	for name, opts := range cases {
		_, err := Generate(minimalStyle(t), opts)

		var invalid *errs.ValidationError
		if !errors.As(err, &invalid) || invalid.Subject != "options" {
			t.Errorf("%s: got %T (%v), want invalid options", name, err, err)
		}
	}
}
