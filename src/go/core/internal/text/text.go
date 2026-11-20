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
//
// Well-formed input encodes to the same JSON as before the walk. A value
// json.Marshal could take the address of (a slice item, or what a pointer
// points to) is handed on as a pointer to the original when its encoding may
// depend on that: a struct, or a type whose pointer carries the marshaler.
func WellFormedValue(v any) any {
	if v == nil {
		return nil
	}

	w := walker{path: map[visit]struct{}{}}

	return w.value(reflect.ValueOf(v))
}

// visit identifies a map, pointer or slice the walk is currently inside.
type visit struct {
	typ reflect.Type
	ptr uintptr
	len int
}

// walker remembers the references on the path from the root to the current
// value. Meeting one of them again is a cycle: the value is then passed on as
// it is, and json.Marshal reports the cycle the way it did before. A depth
// limit alone would not do, because a value that refers to itself twice
// doubles the work on every level.
type walker struct {
	path map[visit]struct{}
}

// enter records v on the path and reports false when it is already there.
func (w *walker) enter(v reflect.Value) (visit, bool) {
	key := visit{typ: v.Type(), ptr: v.Pointer()}
	if v.Kind() == reflect.Slice {
		key.len = v.Len()
	}

	if _, seen := w.path[key]; seen {
		return key, false
	}

	w.path[key] = struct{}{}

	return key, true
}

func (w *walker) value(v reflect.Value) any {
	if !v.IsValid() {
		return nil
	}

	t := v.Type()
	if t == numberType || t.Implements(marshalerType) || t.Implements(textType) {
		return v.Interface()
	}

	// encoding/json calls a marshaler declared on the pointer only for a
	// value it can take the address of. Copying such a value into an
	// interface would lose that, so the pointer goes on instead.
	if v.CanAddr() {
		if p := reflect.PointerTo(t); p.Implements(marshalerType) || p.Implements(textType) {
			return v.Addr().Interface()
		}
	}

	switch v.Kind() {
	case reflect.String:
		return WellFormed(v.String())

	case reflect.Interface:
		if v.IsNil() {
			return v.Interface()
		}
		return w.value(v.Elem())

	case reflect.Pointer:
		if v.IsNil() {
			return v.Interface()
		}

		key, fresh := w.enter(v)
		if !fresh {
			return v.Interface()
		}
		defer delete(w.path, key)

		return w.value(v.Elem())

	case reflect.Map:
		if v.IsNil() || t.Key().Kind() != reflect.String {
			return v.Interface()
		}

		key, fresh := w.enter(v)
		if !fresh {
			return v.Interface()
		}
		defer delete(w.path, key)

		out := make(map[string]any, v.Len())
		iter := v.MapRange()
		for iter.Next() {
			out[WellFormed(iter.Key().String())] = w.value(iter.Value())
		}
		return out

	case reflect.Slice:
		if v.IsNil() || t.Elem().Kind() == reflect.Uint8 {
			return v.Interface()
		}

		if v.Len() > 0 {
			key, fresh := w.enter(v)
			if !fresh {
				return v.Interface()
			}
			defer delete(w.path, key)
		}

		return w.items(v)

	case reflect.Array:
		return w.items(v)

	case reflect.Struct:
		// Its fields are not walked, but they may hold a marshaler declared
		// on the pointer, which only an addressable struct reaches.
		if v.CanAddr() {
			return v.Addr().Interface()
		}
	}

	return v.Interface()
}

func (w *walker) items(v reflect.Value) []any {
	out := make([]any, v.Len())
	for i := range out {
		out[i] = w.value(v.Index(i))
	}

	return out
}
