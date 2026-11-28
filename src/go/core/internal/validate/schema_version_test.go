package validate

import (
	"os"
	"regexp"
	"strings"
	"testing"
)

// TestSchemaBaseURLMatchesGoMod keeps the CDN URI the schemas are registered
// under on the schema version go.mod requires. The release guard only reads
// manifests, so a stale prerelease here would otherwise ship unnoticed.
func TestSchemaBaseURLMatchesGoMod(t *testing.T) {
	raw, err := os.ReadFile("../../go.mod")
	if err != nil {
		t.Fatalf("read go.mod: %v", err)
	}

	match := regexp.MustCompile(`github\.com/dicebear/schema/v\d+ v(\S+)`).FindSubmatch(raw)
	if match == nil {
		t.Fatal("go.mod does not require github.com/dicebear/schema")
	}

	want := "@dicebear/schema@" + string(match[1]) + "/"
	if !strings.Contains(schemaBaseURL, want) {
		t.Errorf("schemaBaseURL = %q, want it to contain %q", schemaBaseURL, want)
	}
}
