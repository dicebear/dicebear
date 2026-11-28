package validate

import (
	"sync"

	"github.com/dicebear/schema/v3"
	"github.com/santhosh-tekuri/jsonschema/v6"
)

var optionsValidator = sync.OnceValue(func() *jsonschema.Schema {
	return compileSchema(schemaBaseURL+"options.min.json", schema.Options)
})

// optionsSchema validates decoded options against options.json.
func optionsSchema(inst any) error {
	return checkSchema(optionsValidator(), inst, optionsSubject)
}
