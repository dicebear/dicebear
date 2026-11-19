// Package text makes user text well-formed before the core reads it.
//
// A Go string can hold bytes that are not UTF-8, for example an emoji cut off
// in the middle of its bytes. Ports whose strings are UTF-16 can hold a lone
// surrogate instead. Neither has a meaning another port could reproduce, so
// every port replaces them with U+FFFD first. Here each maximal subpart of an
// ill-formed sequence becomes one U+FFFD, the substitution the Unicode
// Standard recommends (chapter 3, "U+FFFD Substitution of Maximal Subparts")
// and the WHATWG Encoding Standard's TextDecoder applies.
//
// Go's own conversions are not used: a range loop and json.Marshal replace
// every byte of a cut sequence, strings.ToValidUTF8 a whole run of them.
package text

import (
	"encoding/json"
	"reflect"
	"strings"
	"unicode/utf8"
)

const replacement = "�"

// WellFormed returns s with every ill-formed UTF-8 sequence replaced by
// U+FFFD, one per maximal subpart. Valid UTF-8 comes back unchanged.
func WellFormed(s string) string {
	if utf8.ValidString(s) {
		return s
	}

	var b strings.Builder
	b.Grow(len(s) + 8)

	for i := 0; i < len(s); {
		lead := s[i]

		if lead < 0x80 {
			b.WriteByte(lead)
			i++
			continue
		}

		need, lo, hi := sequence(lead)
		if need == 0 {
			// A byte that cannot start a sequence.
			b.WriteString(replacement)
			i++
			continue
		}

		j := i + 1
		for k := 0; k < need; k++ {
			if j >= len(s) || s[j] < lo || s[j] > hi {
				break
			}
			j++
			lo, hi = 0x80, 0xBF
		}

		if j-i == need+1 {
			b.WriteString(s[i:j])
		} else {
			// The lead byte and the continuation bytes that fit it form one
			// maximal subpart; the byte that broke it starts over.
			b.WriteString(replacement)
		}

		i = j
	}

	return b.String()
}

// sequence returns how many continuation bytes follow lead in a well-formed
// sequence and the range the first one must fall in (Unicode Standard, table
// 3-7). need is 0 when lead cannot start a sequence.
func sequence(lead byte) (need int, lo, hi byte) {
	switch {
	case lead >= 0xC2 && lead <= 0xDF:
		return 1, 0x80, 0xBF
	case lead == 0xE0:
		return 2, 0xA0, 0xBF
	case lead == 0xED:
		return 2, 0x80, 0x9F
	case lead >= 0xE1 && lead <= 0xEF:
		return 2, 0x80, 0xBF
	case lead == 0xF0:
		return 3, 0x90, 0xBF
	case lead >= 0xF1 && lead <= 0xF3:
		return 3, 0x80, 0xBF
	case lead == 0xF4:
		return 3, 0x80, 0x8F
	default:
		return 0, 0, 0
	}
}

var (
	marshalerType = reflect.TypeOf((*json.Marshaler)(nil)).Elem()
	textType      = reflect.TypeOf((*interface{ MarshalText() ([]byte, error) })(nil)).Elem()
	numberType    = reflect.TypeOf(json.Number(""))
)

// WellFormedValue returns a copy of v with WellFormed applied to every string
// it holds: map keys, map values, and slice and array items at any depth,
// through pointers and interfaces. Maps come back as map[string]any and
// slices as []any, which encoding/json writes the same way. Values that carry
// their own JSON encoding (json.Marshaler, encoding.TextMarshaler,
// json.Number, []byte) and anything else are passed through as they are.
func WellFormedValue(v any) any {
	if v == nil {
		return nil
	}

	return wellFormedValue(reflect.ValueOf(v), 0)
}

// maxDepth stops the walk on a pointer cycle. The value is then passed on as
// it is, and json.Marshal reports the cycle the way it did before.
const maxDepth = 1000

func wellFormedValue(v reflect.Value, depth int) any {
	if !v.IsValid() {
		return nil
	}

	if depth > maxDepth {
		return v.Interface()
	}

	t := v.Type()
	if t == numberType || t.Implements(marshalerType) || t.Implements(textType) {
		return v.Interface()
	}

	switch v.Kind() {
	case reflect.String:
		return WellFormed(v.String())

	case reflect.Interface, reflect.Pointer:
		if v.IsNil() {
			return v.Interface()
		}
		return wellFormedValue(v.Elem(), depth+1)

	case reflect.Map:
		if v.IsNil() || t.Key().Kind() != reflect.String {
			return v.Interface()
		}

		out := make(map[string]any, v.Len())
		iter := v.MapRange()
		for iter.Next() {
			out[WellFormed(iter.Key().String())] = wellFormedValue(iter.Value(), depth+1)
		}
		return out

	case reflect.Slice, reflect.Array:
		if v.Kind() == reflect.Slice && (v.IsNil() || t.Elem().Kind() == reflect.Uint8) {
			return v.Interface()
		}

		out := make([]any, v.Len())
		for i := range out {
			out[i] = wellFormedValue(v.Index(i), depth+1)
		}
		return out
	}

	return v.Interface()
}
