package render

import (
	"strings"

	"github.com/dicebear/dicebear-go/v11/internal/style"
)

// Builds attribution strings and embedded RDF/Dublin Core metadata from a
// style's meta block. Mirrors every other port,
// including the nullish creator fallback and the empty-string-as-absent
// treatment.

// nonEmptyPtr returns (value, true) only when p is non-nil and non-empty,
// mirroring the JS falsy checks (`!sourceName` is true for both a missing field
// and "").
func nonEmptyPtr(p *string) (string, bool) {
	if p != nil && *p != "" {
		return *p, true
	}
	return "", false
}

// licenseText returns a single-line attribution string, or "" when no
// attribution data is available.
func licenseText(m *style.Meta) string {
	if m == nil {
		return ""
	}

	sourceName, hasSource := nonEmptyPtr(m.Source.Name)
	sourceURL, hasSourceURL := nonEmptyPtr(m.Source.URL)
	creatorRaw := m.Creator.Name
	creatorName, hasCreator := nonEmptyPtr(creatorRaw)
	licenseName, hasLicense := nonEmptyPtr(m.License.Name)
	licenseURL, hasLicenseURL := nonEmptyPtr(m.License.URL)

	if !hasSource && !hasCreator && !hasLicense {
		return ""
	}

	title := "Design"
	if hasSource {
		title = "“" + sourceName + "”"
	}
	if hasSourceURL {
		title += " (" + sourceURL + ")"
	}

	// JS uses creatorName ?? 'Unknown' (nullish): an empty creator name stays
	// empty; only a missing one becomes "Unknown".
	creatorDisplay := "Unknown"
	if creatorRaw != nil {
		creatorDisplay = *creatorRaw
	}
	creator := "“" + creatorDisplay + "”"

	var b strings.Builder

	// Skip the "Remix of" prefix for MIT-licensed or DiceBear-original styles.
	licenseIsMIT := hasLicense && licenseName == "MIT"
	creatorIsDiceBear := hasCreator && creatorName == "DiceBear"
	if !licenseIsMIT && !creatorIsDiceBear && hasSource {
		b.WriteString("Remix of ")
	}

	b.WriteString(title + " by " + creator)

	if hasLicense {
		b.WriteString(", licensed under “" + licenseName + "”")
		if hasLicenseURL {
			b.WriteString(" (" + licenseURL + ")")
		}
	}

	return b.String()
}

// licenseXML builds an embedded <metadata> block with Dublin Core terms, or ""
// when no metadata fields are populated.
func licenseXML(m *style.Meta) string {
	rights := licenseText(m)

	if m == nil {
		return ""
	}

	title, hasTitle := nonEmptyPtr(m.Source.Name)
	creatorName, hasCreator := nonEmptyPtr(m.Creator.Name)
	sourceURL, hasSourceURL := nonEmptyPtr(m.Source.URL)
	licenseURL, hasLicenseURL := nonEmptyPtr(m.License.URL)

	if !hasTitle && !hasCreator && !hasSourceURL && !hasLicenseURL && rights == "" {
		return ""
	}

	var fields strings.Builder
	if hasTitle {
		fields.WriteString("<dc:title>" + escapeXML(title) + "</dc:title>")
	}
	if hasCreator {
		fields.WriteString("<dc:creator>" + escapeXML(creatorName) + "</dc:creator>")
	}
	if hasSourceURL {
		fields.WriteString(`<dc:source xsi:type="dcterms:URI">` + escapeXML(sourceURL) + "</dc:source>")
	}
	if hasLicenseURL {
		fields.WriteString(`<dcterms:license xsi:type="dcterms:URI">` + escapeXML(licenseURL) + "</dcterms:license>")
	}
	if rights != "" {
		fields.WriteString("<dc:rights>" + escapeXML(rights) + "</dc:rights>")
	}

	return `<metadata xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"` +
		` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"` +
		` xmlns:dc="http://purl.org/dc/elements/1.1/"` +
		` xmlns:dcterms="http://purl.org/dc/terms/">` +
		`<rdf:RDF><rdf:Description>` + fields.String() + `</rdf:Description></rdf:RDF></metadata>`
}
