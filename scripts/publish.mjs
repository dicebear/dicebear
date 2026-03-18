import { readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { shouldPublish } from "./lib/publish.mjs";
import { resolveWorkspacePackages } from "./lib/workspace.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const distTag = process.argv[2];
if (!distTag) {
  console.error("Usage: node scripts/publish.mjs <dist-tag>");
  process.exit(1);
}

const packageJsonPaths = resolveWorkspacePackages(ROOT);

let published = 0;
let skipped = 0;

for (const pkgPath of packageJsonPaths) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

  // Check registry version
  let registryVersion;
  try {
    registryVersion = execFileSync("npm", ["view", pkg.name, "version"], {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    // Package not yet on registry
    registryVersion = null;
  }

  const decision = shouldPublish(pkg, registryVersion);

  if (!decision.publish) {
    console.log(`  skip (${decision.reason}): ${pkg.name}${pkg.version ? "@" + pkg.version : ""}`);
    skipped++;
    continue;
  }

  const pkgDir = join(pkgPath, "..");
  console.log(`  publish: ${pkg.name}@${pkg.version} (tag: ${distTag})`);
  execFileSync("npm", ["publish", "--tag", distTag, "--ignore-scripts"], {
    cwd: pkgDir,
    stdio: "inherit",
  });
  published++;
}

console.log(`\nDone! Published: ${published}, Skipped: ${skipped}`);
