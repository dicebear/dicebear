package style

// ColorDef is a read-only view over an entry in a style definition's colors
// block: the candidate values plus the contrast/exclusion constraints. The
// color math itself lives in the internal color package.
type ColorDef struct {
	Values     []string `json:"values"`
	NotEqualTo []string `json:"notEqualTo"`
	ContrastTo string   `json:"contrastTo"`
}
