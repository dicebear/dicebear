/**
 * @param {string} version
 * @returns {boolean}
 */
export function isValidVersion(version) {
  return /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version);
}

/**
 * @param {string[]} packageJsonRaws - Array of raw JSON strings
 * @returns {Set<string>}
 */
export function collectWorkspaceNames(packageJsonRaws) {
  const names = new Set();
  for (const raw of packageJsonRaws) {
    const pkg = JSON.parse(raw);
    if (pkg.name) names.add(pkg.name);
  }
  return names;
}

/**
 * @param {string} raw - Raw JSON string of a package.json
 * @param {string} newVersion
 * @param {Set<string>} workspaceNames
 * @returns {string | null} Updated JSON string, or null if no change needed
 */
export function updatePackageJson(raw, newVersion, workspaceNames) {
  const pkg = JSON.parse(raw);

  // Set new version (skip root which has no version field)
  if (pkg.version !== undefined) {
    pkg.version = newVersion;
  }

  // Update internal dependency references
  for (const depField of ["dependencies", "devDependencies"]) {
    if (!pkg[depField]) continue;
    for (const [name, value] of Object.entries(pkg[depField])) {
      if (!workspaceNames.has(name)) continue;
      // Skip wildcard references (used by private apps)
      if (value === "*") continue;
      pkg[depField][name] = newVersion;
    }
  }

  // Leave peerDependencies ranges untouched

  // Preserve original formatting (detect indent)
  const indent = raw.match(/^(\s+)"/m)?.[1] ?? "  ";
  const newRaw = JSON.stringify(pkg, null, indent) + "\n";

  return newRaw !== raw ? newRaw : null;
}
