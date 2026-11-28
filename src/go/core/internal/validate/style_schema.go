package validate

import (
	"sync"

	"github.com/dicebear/schema/v3"
	"github.com/santhosh-tekuri/jsonschema/v6"
)

var styleValidator = sync.OnceValue(func() *jsonschema.Schema {
	return compileSchema(schemaBaseURL+"definition.min.json", schema.Definition)
})

// styleSchema validates a decoded style definition against definition.json.
func styleSchema(inst any) error {
	return checkSchema(styleValidator(), inst, styleSubject)
}
