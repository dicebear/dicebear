// Package validate checks style definitions and options against the shared
// draft-07 JSON schemas (the pure-data github.com/dicebear/schema module). The
// compiled validators are built once, lazily, and reused.
package validate

import (
	"bytes"
	"fmt"
	"sync"

	"github.com/dicebear/schema/v3"
	"github.com/santhosh-tekuri/jsonschema/v6"

	"github.com/dicebear/dicebear-go/v11/internal/errs"
)

// The schemas are registered under their published CDN URIs: a relative name
// would be resolved against the process working directory, leaking the
// consumer's filesystem paths into validation error messages. Keep the
// version in sync with the github.com/dicebear/schema dependency in go.mod.
const schemaBaseURL = "https://cdn.hopjs.net/npm/@dicebear/schema@3.0.0/dist/"

var definitionValidator = sync.OnceValue(func() *jsonschema.Schema {
	return compileSchema(schemaBaseURL+"definition.min.json", schema.Definition)
})

var optionsValidator = sync.OnceValue(func() *jsonschema.Schema {
	return compileSchema(schemaBaseURL+"options.min.json", schema.Options)
})

func compileSchema(name, raw string) *jsonschema.Schema {
	doc, err := jsonschema.UnmarshalJSON(bytes.NewReader([]byte(raw)))
	if err != nil {
		panic("embedded schema is invalid JSON: " + err.Error())
	}

	c := jsonschema.NewCompiler()
	if err := c.AddResource(name, doc); err != nil {
		panic("embedded schema could not be registered: " + err.Error())
	}

	sch, err := c.Compile(name)
	if err != nil {
		panic("embedded schema does not compile: " + err.Error())
	}

	return sch
}

// Definition validates a style definition against definition.json.
func Definition(instanceJSON []byte) error {
	return check(definitionValidator(), instanceJSON, "style definition")
}

// Options validates an options object against options.json.
func Options(instanceJSON []byte) error {
	return check(optionsValidator(), instanceJSON, "options")
}

// MaxDepth is how many levels of objects and arrays a style definition or the
// options may nest, counting the value itself as the first. Every port turns
// down a deeper value as invalid, so a definition renders in all of them or in
// none. Valid options nest two levels and the deepest style definition uses
// less than a quarter of the limit.
const MaxDepth = 64

func check(sch *jsonschema.Schema, instanceJSON []byte, subject string) error {
	if exceedsMaxDepth(instanceJSON) {
		return &errs.ValidationError{
			Subject: subject,
			Details: []string{fmt.Sprintf("nesting is deeper than the %d levels this port reads", MaxDepth)},
		}
	}

	inst, err := jsonschema.UnmarshalJSON(bytes.NewReader(instanceJSON))
	if err != nil {
		return &errs.ValidationError{Subject: subject, Details: []string{err.Error()}}
	}

	if err := sch.Validate(inst); err != nil {
		return &errs.ValidationError{Subject: subject, Details: []string{err.Error()}}
	}

	return nil
}

// exceedsMaxDepth reports whether the JSON text nests objects and arrays
// deeper than MaxDepth levels. It counts brackets outside strings, which is
// the nesting the decoder would build. Text that is not valid JSON is left to
// the decoder to report.
func exceedsMaxDepth(instanceJSON []byte) bool {
	depth := 0
	inString := false
	escaped := false

	for _, b := range instanceJSON {
		switch {
		case escaped:
			escaped = false
		case inString:
			switch b {
			case '\\':
				escaped = true
			case '"':
				inString = false
			}
		case b == '"':
			inString = true
		case b == '[' || b == '{':
			depth++
			if depth > MaxDepth {
				return true
			}
		case b == ']' || b == '}':
			depth--
		}
	}

	return false
}
