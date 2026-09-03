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

const CHANGELOG_REPO_URL = "https://github.com/dicebear/dicebear";

/**
 * Promotes the `## [Unreleased]` section of a Keep a Changelog file to a
 * released version: the existing entries are moved under a new
 * `## [<version>] - <date>` heading, a fresh empty `## [Unreleased]` is kept on
 * top, and the bottom link references are updated accordingly.
 *
 * @param {string} raw - Raw CHANGELOG.md content
 * @param {string} newVersion
 * @param {string} date - Release date in `YYYY-MM-DD` form
 * @returns {string | null} Updated changelog, or null if there is nothing to do
 */
// A Go module path carries its major version as a suffix from v2 on, and the
// module proxy rejects a tag whose go.mod disagrees with it. Returns the module
// path `version` requires, or null when `goModRaw` already declares it.
export function expectedGoModulePath(goModRaw, version) {
  const match = goModRaw.match(/^module\s+(\S+)/m);

  if (!match) {
    throw new Error("go.mod carries no module line");
  }

  const current = match[1];
  const base = current.replace(/\/v\d+$/, "");
  const major = version.split(".")[0];
  const expected = major === "0" || major === "1" ? base : `${base}/v${major}`;

  return current === expected ? null : expected;
}

export function updateChangelog(raw, newVersion, date) {
  const unreleasedHeading = /^## \[Unreleased\][^\n]*$/m;

  if (!unreleasedHeading.test(raw)) {
    return null;
  }

  // Idempotent: if this version was already promoted (e.g. a previous release
  // run failed after writing the changelog), don't promote the now-empty
  // Unreleased section again. The closing bracket prevents `10.0.1` from
  // matching `10.0.10`.
  if (raw.includes(`## [${newVersion}]`)) {
    return null;
  }

  // Move the current Unreleased entries under a dated version heading and keep
  // a fresh, empty Unreleased section on top.
  let result = raw.replace(
    unreleasedHeading,
    `## [Unreleased]\n\n## [${newVersion}] - ${date}`
  );

  // Update the bottom link references when they follow the conventional shape.
  const unreleasedLink =
    /^\[Unreleased\]:\s*\S+\/compare\/v([\w.-]+)\.\.\.HEAD[^\n]*$/m;
  const match = result.match(unreleasedLink);

  if (match) {
    const prevVersion = match[1];
    result = result.replace(
      unreleasedLink,
      `[Unreleased]: ${CHANGELOG_REPO_URL}/compare/v${newVersion}...HEAD\n` +
        `[${newVersion}]: ${CHANGELOG_REPO_URL}/compare/v${prevVersion}...v${newVersion}`
    );
  }

  return result !== raw ? result : null;
}
