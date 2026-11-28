package validate

const optionsSubject = "options"

// Options validates an options object: the depth check, then options.json.
func Options(instanceJSON []byte) error {
	inst, err := decode(instanceJSON, optionsSubject)
	if err != nil {
		return err
	}

	return optionsSchema(inst)
}
