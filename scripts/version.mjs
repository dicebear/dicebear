import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";
import { isValidVersion, updatePackageJson, collectWorkspaceNames, updateChangelog } from "./lib/version.mjs";
import { resolveWorkspacePackages } from "./lib/workspace.mjs";

const ROOT = resolve(import.meta.dirname, "..");

const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/version.mjs <version>");
  process.exit(1);
}

if (!isValidVersion(version)) {
  console.error(`Invalid version: ${version}`);
  process.exit(1);
}

const packageJsonPaths = [join(ROOT, "package.json"), ...resolveWorkspacePackages(ROOT)];

// Collect all workspace package names
const workspaceNames = collectWorkspaceNames(
  packageJsonPaths.map((p) => readFileSync(p, "utf-8"))
);

// Update each package.json
for (const pkgPath of packageJsonPaths) {
  const raw = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(raw);
  const oldVersion = pkg.version;
  const newRaw = updatePackageJson(raw, version, workspaceNames);

  if (newRaw !== null) {
    writeFileSync(pkgPath, newRaw);
    console.log(`  ${pkg.name ?? "root"}: ${oldVersion ?? "-"} → ${version}`);
  }
}

// The Python core is not an npm workspace (like the PHP core), so bump its
// pyproject.toml here to keep all ports on the same version. Only the version
// string is replaced so the rest of the manifest stays byte-for-byte untouched.
const pyprojectPath = join(ROOT, "src/python/core/pyproject.toml");
if (existsSync(pyprojectPath)) {
  const raw = readFileSync(pyprojectPath, "utf-8");
  const updated = raw.replace(/^version = "[^"]*"$/m, `version = "${version}"`);

  if (updated !== raw) {
    writeFileSync(pyprojectPath, updated);
    console.log(`  dicebear-core (python): → ${version}`);
  }
}

// Promote the changelog's Unreleased section to the new version
const changelogPath = join(ROOT, "CHANGELOG.md");
if (existsSync(changelogPath)) {
  const raw = readFileSync(changelogPath, "utf-8");
  const date = new Date().toISOString().slice(0, 10);
  const updated = updateChangelog(raw, version, date);

  if (updated !== null) {
    writeFileSync(changelogPath, updated);
    console.log(`\nCHANGELOG.md: Unreleased → ${version} (${date})`);
  } else {
    console.log("\nCHANGELOG.md: nothing to promote (skipped)");
  }
}

// Sync package-lock.json
console.log("\nSyncing package-lock.json...");
execSync("npm install --package-lock-only", { cwd: ROOT, stdio: "inherit" });

// Git commit and tag
const tag = `v${version}`;
console.log(`\nCreating commit and tag ${tag}...`);
execSync("git add -A", { cwd: ROOT, stdio: "inherit" });
execSync(`git commit -m "${tag}"`, { cwd: ROOT, stdio: "inherit" });
execSync(`git tag "${tag}"`, { cwd: ROOT, stdio: "inherit" });

console.log(`\nDone! Push with: git push && git push --tags`);
