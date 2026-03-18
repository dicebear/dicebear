import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { isValidVersion, updatePackageJson, collectWorkspaceNames } from "./lib/version.mjs";
import { resolveWorkspacePackages } from "./lib/workspace.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

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
