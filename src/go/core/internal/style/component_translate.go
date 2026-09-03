package style

import "github.com/dicebear/dicebear-go/v11/internal/prng"

// componentTranslate is a read-only view over a component's translate block,
// providing the X and Y offset ranges.
type componentTranslate struct {
	X *prng.Range `json:"x"`
	Y *prng.Range `json:"y"`
}
