import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolves workspace patterns from root package.json into absolute paths
 * to each workspace's package.json. The root package.json is NOT included.
 *
 * @param {string} rootDir - Absolute path to the monorepo root
 * @returns {string[]} Absolute paths to workspace package.json files
 */
export function resolveWorkspacePackages(rootDir) {
  const rootPkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"));
  const patterns = rootPkg.workspaces?.packages ?? rootPkg.workspaces ?? [];

  const results = [];

  for (const pattern of patterns) {
    const starIdx = pattern.indexOf("*");

    if (starIdx === -1) {
      // Direct path — no glob
      const pkgJson = join(rootDir, pattern, "package.json");
      if (existsSync(pkgJson)) {
        results.push(pkgJson);
      }
    } else {
      // Expand single trailing `*` via readdirSync
      const base = pattern.slice(0, starIdx);
      const baseDir = join(rootDir, base);
      if (!existsSync(baseDir)) continue;

      for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const pkgJson = join(baseDir, entry.name, "package.json");
        if (existsSync(pkgJson)) {
          results.push(pkgJson);
        }
      }
    }
  }

  return results;
}
