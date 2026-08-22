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

// The Rust core is not an npm workspace either; bump its Cargo.toml so it ships
// on the same version as the other ports. Only the [package] version line (at
// column 0) matches `^version = "…"`, not the indented dependency versions.
const cargoPath = join(ROOT, "src/rust/core/Cargo.toml");
if (existsSync(cargoPath)) {
  const raw = readFileSync(cargoPath, "utf-8");
  const updated = raw.replace(/^version = "[^"]*"$/m, `version = "${version}"`);

  if (updated !== raw) {
    writeFileSync(cargoPath, updated);
    console.log(`  dicebear-core (rust): → ${version}`);
  }
}

// The Dart core is not an npm workspace either; bump its pubspec.yaml so it
// ships on the same version as the other ports. pub.dev's automated publishing
// requires the pubspec version to match the v{{version}} tag exactly. Only the
// top-level `version:` line (at column 0) matches; indented dependency
// constraints do not.
const pubspecPath = join(ROOT, "src/dart/core/pubspec.yaml");
if (existsSync(pubspecPath)) {
  const raw = readFileSync(pubspecPath, "utf-8");
  const updated = raw.replace(/^version: .*$/m, `version: ${version}`);

  if (updated !== raw) {
    writeFileSync(pubspecPath, updated);
    console.log(`  dicebear_core (dart): → ${version}`);
  }
}

// The C# core is not an npm workspace either; bump the <Version> property in
// its csproj so the NuGet package ships on the same version as the other ports.
// The project file carries exactly one, so no anchoring is needed.
const csprojPath = join(ROOT, "src/csharp/core/DiceBear.Core.csproj");
if (existsSync(csprojPath)) {
  const raw = readFileSync(csprojPath, "utf-8");
  const updated = raw.replace(
    /<Version>[^<]*<\/Version>/,
    `<Version>${version}</Version>`,
  );

  if (updated !== raw) {
    writeFileSync(csprojPath, updated);
    console.log(`  DiceBear.Core (csharp): → ${version}`);
  }
}

// The Go core (src/go/core) needs no file bump: a Go module's version lives
// entirely in the Git tag, which the module proxy reads directly. The tag
// created below (e.g. v10.2.0) is mirrored to the standalone dicebear-go repo by
// split-go-core.yml, and `github.com/dicebear/dicebear-go/v10` resolves it from
// there. The major version is encoded in the module path (/v10), so it only
// changes by hand on a major bump — not here.

// Promote the changelog's Unreleased section to the new version
const changelogPath = join(ROOT, "CHANGELOG.md");
if (existsSync(changelogPath)) {
  const raw = readFileSync(changelogPath, "utf-8");
  const date = new Date().toISOString().slice(0, 10);
  const updated = updateChangelog(raw, version, date);

  if (updated !== null) {
    writeFileSync(changelogPath, updated);
    // The compare-link line the promotion appends runs past Prettier's print
    // width as soon as a version carries a prerelease suffix, which fails the
    // format job on the release commit. Reflow the file before it is staged.
    execSync("npx prettier --write CHANGELOG.md", { cwd: ROOT, stdio: "inherit" });
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
