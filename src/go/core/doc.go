// Package dicebear is the Go implementation of the DiceBear avatar library. It
// generates deterministic SVG avatars from a style definition and a seed string.
//
// DiceBear is available for multiple languages. All implementations share the
// same key-based PRNG and rendering pipeline, producing byte-identical SVG
// output for the same seed, style, and options — verified against the
// cross-language parity fixtures under tests/fixtures/parity in the monorepo.
//
// This package is a thin public façade: [Avatar], [Style], [OptionsDescriptor]
// and the typed errors ([ValidationError], [CircularColorReferenceError]). The
// engine — PRNG, resolver, renderer, options reader, style model, validation —
// lives under internal/ so it can be refactored freely without affecting the
// public API. The color helpers are the one other public surface, in the
// sub-package github.com/dicebear/dicebear-go/v11/color.
//
// Style definitions and option sets are the same JSON the npm, Composer, PyPI,
// crates.io and pub.dev packages consume; the pure-data style definitions ship
// as github.com/dicebear/styles/v10.
//
//	style, err := dicebear.NewStyle([]byte(styles.Adventurer))
//	if err != nil {
//	    // handle error
//	}
//
//	avatar, err := dicebear.NewAvatar(style, map[string]any{
//	    "seed": "John Doe",
//	    "size": 128,
//	})
//	if err != nil {
//	    // handle error
//	}
//
//	svg := avatar.SVG()           // SVG string
//	uri := avatar.DataURI()       // data:image/svg+xml;charset=utf-8,...
package dicebear
