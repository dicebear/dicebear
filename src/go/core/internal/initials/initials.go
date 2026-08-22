// Package initials derives display initials from a seed string.
//
// Words are split by Unicode letter/mark classes (\p{L}, \p{M}) so the result
// matches every other port for accented and non-Latin input.
// See https://www.regular-expressions.info/unicode.html
package initials

import (
	"regexp"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// upper applies full Unicode case mapping (ß→SS, ﬁ→FI, …), matching JS
// toUpperCase and Rust to_uppercase. Go's strings.ToUpper only does simple 1:1
// mapping, which would diverge for special-casing letters. A fresh Caser is
// built per call because cases.Caser is not safe for concurrent use.
func upper(s string) string {
	return cases.Upper(language.Und).String(s)
}

var (
	// Apostrophes and accents that should not break a word (e.g. l'eau, d´or).
	reQuotes = regexp.MustCompile("[`´'ʼ]")
	// A word: a letter followed by any letters or combining marks.
	reWord = regexp.MustCompile(`\p{L}[\p{L}\p{M}]*`)
	// The first one or two letter+marks units of a word.
	reTwo = regexp.MustCompile(`^(?:\p{L}\p{M}*){1,2}`)
	// The first single letter+marks unit of a word.
	reOne = regexp.MustCompile(`^(?:\p{L}\p{M}*)`)
)

// FromSeed returns one or two uppercase initials for seed, discarding an "@…"
// suffix so email addresses yield a single initial.
func FromSeed(seed string) string {
	return fromSeedWith(seed, true)
}

// fromSeedWith is FromSeed with control over whether an "@…" suffix is stripped
// before deriving initials.
func fromSeedWith(seed string, discardAtSymbol bool) string {
	input := seed

	if discardAtSymbol {
		// Strip the whole @ suffix (including any line terminators), mirroring
		// the dotall `@.*` strip in every port. Only the first @ matters since
		// `.*` reaches the end.
		if i := strings.IndexByte(input, '@'); i >= 0 {
			input = input[:i]
		}
	}

	input = reQuotes.ReplaceAllString(input, "")

	words := reWord.FindAllString(input, -1)

	if len(words) == 0 {
		if discardAtSymbol {
			return fromSeedWith(seed, false)
		}
		return ""
	}

	if len(words) == 1 {
		if m := reTwo.FindString(words[0]); m != "" {
			return upper(m)
		}
		return ""
	}

	first := reOne.FindString(words[0])
	last := reOne.FindString(words[len(words)-1])

	if first == "" || last == "" {
		return ""
	}

	return upper(first + last)
}
