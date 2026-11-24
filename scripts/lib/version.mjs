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
 * A Go module path carries its major version as a suffix from v2 on, and the
 * module proxy rejects a tag whose go.mod disagrees with it.
 *
 * @param {string} goModRaw - Raw go.mod content
 * @param {string} version - The version about to be released
 * @returns {string | null} The module path `version` requires, or null when
 *   `goModRaw` already declares it
 */
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

/**
 * A version with a prerelease part: `3.0.0-rc.1`, or PEP 440's `3.0.0rc1`.
 */
const PRERELEASE_VERSION = /\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+|(?:a|b|rc)\d+)/;

/**
 * Names of DiceBear packages in the manifests of every port: `@dicebear/…`
 * and `dicebear` on npm, `dicebear/…` on Packagist, `dicebear-…` on PyPI and
 * crates.io, `dicebear_…` on pub.dev, `DiceBear.…` on NuGet and
 * `github.com/dicebear/…` for Go.
 */
const DICEBEAR_PACKAGE = /@dicebear\/|github\.com\/dicebear\/|dicebear[/_-][a-z]|DiceBear\.[A-Z]/;

/**
 * Lists the dependencies on DiceBear packages outside this repository that
 * still point at a prerelease, such as `@dicebear/schema` `^3.0.0-rc.1`.
 *
 * A stable release must not carry them: NuGet refuses to pack a stable
 * package with a prerelease dependency, and Go and NuGet resolve the lowest
 * version a requirement allows, which would hand users the release candidate
 * of the schema. The workspace packages are left out, the release bumps them
 * itself.
 *
 * @param {{ path: string, raw: string }[]} manifests - package.json, go.mod,
 *   composer.json, pubspec.yaml, Cargo.toml, pyproject.toml and .csproj files
 * @param {Set<string>} workspaceNames
 * @returns {{ path: string, dependency: string }[]}
 */
export function findPrereleaseDependencies(manifests, workspaceNames) {
  const found = [];

  for (const { path, raw } of manifests) {
    if (path.endsWith("package.json")) {
      const pkg = JSON.parse(raw);

      for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
        for (const [name, spec] of Object.entries(pkg[field] ?? {})) {
          const external =
            (name === "dicebear" || name.startsWith("@dicebear/")) &&
            !workspaceNames.has(name);

          if (external && PRERELEASE_VERSION.test(String(spec))) {
            found.push({ path, dependency: `${name} ${spec}` });
          }
        }
      }

      continue;
    }

    for (const line of raw.split("\n")) {
      const code = line.trim();

      if (/^(#|\/\/|<!--)/.test(code)) {
        continue;
      }

      if (DICEBEAR_PACKAGE.test(code) && PRERELEASE_VERSION.test(code)) {
        found.push({ path, dependency: code });
      }
    }
  }

  return found;
}

/**
 * Sets the release date of a major line in the version support data of the
 * docs (`RELEASED` in `versionSupport.ts`) and drops the reminder comment
 * above it, so the support timeline starts on the day the release is cut.
 *
 * @param {string} raw - Raw versionSupport.ts content
 * @param {number} major
 * @param {string} date - Release date in `YYYY-MM-DD` form
 * @returns {string | null} Updated content, or null if there is nothing to do
 */
export function updateReleaseDate(raw, major, date) {
  const line = new RegExp(
    `^((?:[ \\t]*//[^\\n]*\\n)*)([ \\t]*)${major}: '\\d{4}-\\d{2}-\\d{2}',$`,
    "m",
  );

  if (!line.test(raw)) {
    return null;
  }

  const updated = raw.replace(line, (_, comments, indent) => {
    const kept = comments
      .split("\n")
      .filter((comment) => comment !== "" && !/TODO/.test(comment))
      .map((comment) => `${comment}\n`)
      .join("");

    return `${kept}${indent}${major}: '${date}',`;
  });

  return updated !== raw ? updated : null;
}
