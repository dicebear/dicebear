import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isValidVersion,
  updatePackageJson,
  collectWorkspaceNames,
  updateChangelog,
  expectedGoModulePath,
} from "../../scripts/lib/version.mjs";

const CHANGELOG = [
  "# Changelog",
  "",
  "## [Unreleased]",
  "",
  "### Fixed",
  "",
  "- Some bug fix.",
  "",
  "## [10.0.0] - 2026-05-27",
  "",
  "### Added",
  "",
  "- Initial release.",
  "",
  "[Unreleased]: https://github.com/dicebear/dicebear/compare/v10.0.0...HEAD",
  "[10.0.0]: https://github.com/dicebear/dicebear/releases/tag/v10.0.0",
  "",
].join("\n");

// --- isValidVersion ---

test("isValidVersion accepts semver versions", () => {
  assert.ok(isValidVersion("9.4.0"));
  assert.ok(isValidVersion("1.0.0-alpha.1"));
  assert.ok(isValidVersion("0.0.1-rc.2"));
});

test("isValidVersion rejects invalid versions", () => {
  assert.ok(!isValidVersion(""));
  assert.ok(!isValidVersion("abc"));
  assert.ok(!isValidVersion("1.2"));
  assert.ok(!isValidVersion("v1.0.0"));
});

// --- updatePackageJson ---

test("updatePackageJson sets version to new value", () => {
  const raw = JSON.stringify({ name: "@dicebear/core", version: "1.0.0" }, null, "  ") + "\n";
  const result = updatePackageJson(raw, "2.0.0", new Set());
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.version, "2.0.0");
});

test("updatePackageJson updates internal dependencies", () => {
  const raw = JSON.stringify({
    name: "@dicebear/converter",
    version: "1.0.0",
    dependencies: { "@dicebear/core": "1.0.0", "external-lib": "^3.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.dependencies["@dicebear/core"], "2.0.0");
});

test("updatePackageJson updates internal devDependencies", () => {
  const raw = JSON.stringify({
    name: "@dicebear/core",
    version: "1.0.0",
    devDependencies: { "@dicebear/core": "1.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.devDependencies["@dicebear/core"], "2.0.0");
});

test("updatePackageJson leaves wildcard dependencies unchanged", () => {
  const raw = JSON.stringify({
    name: "@dicebear/editor",
    version: "1.0.0",
    dependencies: { "@dicebear/core": "*" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.dependencies["@dicebear/core"], "*");
});

test("updatePackageJson leaves peerDependencies ranges untouched", () => {
  const raw = JSON.stringify({
    name: "@dicebear/converter",
    version: "1.0.0",
    peerDependencies: { "@dicebear/core": ">=1.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.peerDependencies["@dicebear/core"], ">=1.0.0");
});

test("updatePackageJson skips root package.json without version field", () => {
  const raw = JSON.stringify({ name: "root", private: true }, null, "  ") + "\n";
  const result = updatePackageJson(raw, "2.0.0", new Set());
  assert.strictEqual(result, null);
});

test("updatePackageJson leaves external dependencies unchanged", () => {
  const raw = JSON.stringify({
    name: "@dicebear/core",
    version: "1.0.0",
    dependencies: { "external-lib": "^3.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.dependencies["external-lib"], "^3.0.0");
});

test("updatePackageJson returns null when no change needed", () => {
  const raw = JSON.stringify({
    name: "@dicebear/core",
    version: "2.0.0",
    dependencies: { "external-lib": "^3.0.0" },
  }, null, "  ") + "\n";
  const result = updatePackageJson(raw, "2.0.0", new Set());
  assert.strictEqual(result, null);
});

// --- collectWorkspaceNames ---

test("collectWorkspaceNames collects all name fields", () => {
  const raws = [
    JSON.stringify({ name: "@dicebear/core", version: "1.0.0" }),
    JSON.stringify({ name: "@dicebear/avataaars", version: "1.0.0" }),
    JSON.stringify({ version: "1.0.0" }), // no name — should be ignored
  ];
  const names = collectWorkspaceNames(raws);
  assert.strictEqual(names.size, 2);
  assert.ok(names.has("@dicebear/core"));
  assert.ok(names.has("@dicebear/avataaars"));
});

// --- updateChangelog ---

test("updateChangelog promotes Unreleased to a dated version section", () => {
  const result = updateChangelog(CHANGELOG, "10.0.1", "2026-05-29");

  // A fresh, empty Unreleased section stays on top.
  assert.match(result, /## \[Unreleased\]\n\n## \[10\.0\.1\] - 2026-05-29/);
  // The existing entries move under the new version.
  assert.match(result, /## \[10\.0\.1\] - 2026-05-29\n\n### Fixed\n\n- Some bug fix\./);
  // The previous version section is untouched.
  assert.match(result, /## \[10\.0\.0\] - 2026-05-27/);
});

test("updateChangelog rewrites the bottom link references", () => {
  const result = updateChangelog(CHANGELOG, "10.0.1", "2026-05-29");

  assert.match(
    result,
    /^\[Unreleased\]: https:\/\/github\.com\/dicebear\/dicebear\/compare\/v10\.0\.1\.\.\.HEAD$/m
  );
  assert.match(
    result,
    /^\[10\.0\.1\]: https:\/\/github\.com\/dicebear\/dicebear\/compare\/v10\.0\.0\.\.\.v10\.0\.1$/m
  );
  // The original 10.0.0 tag link is preserved.
  assert.match(
    result,
    /^\[10\.0\.0\]: https:\/\/github\.com\/dicebear\/dicebear\/releases\/tag\/v10\.0\.0$/m
  );
});

test("updateChangelog returns null when there is no Unreleased section", () => {
  const raw = "# Changelog\n\n## [10.0.0] - 2026-05-27\n\n- Initial release.\n";
  assert.strictEqual(updateChangelog(raw, "10.0.1", "2026-05-29"), null);
});

test("updateChangelog is idempotent when the version was already promoted", () => {
  const once = updateChangelog(CHANGELOG, "10.0.1", "2026-05-29");
  // Re-running the same release (e.g. after a mid-run failure) must be a no-op.
  assert.strictEqual(updateChangelog(once, "10.0.1", "2026-05-29"), null);
});

test("updateChangelog does not treat 10.0.10 as already-promoted 10.0.1", () => {
  const raw = CHANGELOG.replace(
    "## [10.0.0] - 2026-05-27",
    "## [10.0.10] - 2026-05-28\n\n### Added\n\n- prior\n\n## [10.0.0] - 2026-05-27"
  );
  const result = updateChangelog(raw, "10.0.1", "2026-05-29");
  assert.notStrictEqual(result, null);
  assert.match(result, /## \[10\.0\.1\] - 2026-05-29/);
});

test("updateChangelog promotes even without bottom link references", () => {
  const raw = "# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- A fix.\n";
  const result = updateChangelog(raw, "1.2.3", "2026-01-01");

  assert.match(result, /## \[Unreleased\]\n\n## \[1\.2\.3\] - 2026-01-01\n\n### Fixed\n\n- A fix\./);
});

test("expectedGoModulePath accepts a module path that carries the major version", () => {
  assert.equal(expectedGoModulePath("module github.com/dicebear/dicebear-go/v11\n\ngo 1.23\n", "11.0.0"), null);
  assert.equal(expectedGoModulePath("module github.com/dicebear/dicebear-go/v11\n", "11.4.2-rc.1"), null);
  assert.equal(expectedGoModulePath("module example.com/lib\n", "1.9.0"), null);
});

test("expectedGoModulePath names the path a mismatching major needs", () => {
  assert.equal(
    expectedGoModulePath("module github.com/dicebear/dicebear-go/v10\n", "11.0.0-rc.1"),
    "github.com/dicebear/dicebear-go/v11",
  );
  assert.equal(expectedGoModulePath("module example.com/lib\n", "2.0.0"), "example.com/lib/v2");
  assert.equal(expectedGoModulePath("module example.com/lib/v2\n", "1.0.0"), "example.com/lib");
});

test("expectedGoModulePath rejects a go.mod without a module line", () => {
  assert.throws(() => expectedGoModulePath("go 1.23\n", "11.0.0"));
});
