import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { resolveWorkspacePackages } from "../../scripts/lib/workspace.mjs";
import { expectedGoModulePath } from "../../scripts/lib/version.mjs";

const ROOT = resolve(import.meta.dirname, "../..");
const results = resolveWorkspacePackages(ROOT);

test("resolveWorkspacePackages finds @dicebear/core", () => {
  assert.ok(results.some((p) => p.includes("src/js/core/package.json")));
});

test("resolveWorkspacePackages finds @dicebear/converter", () => {
  assert.ok(results.some((p) => p.includes("src/js/converter/package.json")));
});

test("resolveWorkspacePackages finds the CLI package (dicebear)", () => {
  assert.ok(results.some((p) => p.includes("src/js/cli/package.json")));
});

test("resolveWorkspacePackages does not include root package.json", () => {
  const rootPkgJson = resolve(ROOT, "package.json");
  assert.ok(!results.includes(rootPkgJson));
});

test("resolveWorkspacePackages finds all app packages", () => {
  assert.ok(results.some((p) => p.includes("apps/editor/package.json")));
  assert.ok(results.some((p) => p.includes("apps/docs/package.json")));
});

// The Go module proxy rejects a tag whose go.mod does not carry the major
// version in its module path. Pin the path to the workspace version here, so
// the mismatch fails in CI long before a release run trips over it.
test("the Go module path carries the workspace major version", () => {
  const { version } = JSON.parse(
    readFileSync(join(ROOT, "src/js/core/package.json"), "utf-8"),
  );
  const goMod = readFileSync(join(ROOT, "src/go/core/go.mod"), "utf-8");

  assert.equal(expectedGoModulePath(goMod, version), null);
});

test("every Go import uses the module's own path", () => {
  const goMod = readFileSync(join(ROOT, "src/go/core/go.mod"), "utf-8");
  const modulePath = goMod.match(/^module\s+(\S+)/m)[1];
  const base = modulePath.replace(/\/v\d+$/, "");
  const offenders = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);

      if (statSync(path).isDirectory()) {
        walk(path);
      } else if (entry.endsWith(".go")) {
        for (const match of readFileSync(path, "utf-8").matchAll(/"(\S+)"/g)) {
          const imported = match[1];

          if (imported.startsWith(base) && !imported.startsWith(modulePath)) {
            offenders.push(`${path}: ${imported}`);
          }
        }
      }
    }
  };

  walk(join(ROOT, "src/go/core"));
  assert.deepEqual(offenders, []);
});
