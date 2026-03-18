/**
 * @param {{ name: string, version: string, private?: boolean }} pkg
 * @param {string | null} registryVersion
 * @returns {{ publish: boolean, reason: string }}
 */
export function shouldPublish(pkg, registryVersion) {
  if (pkg.private) {
    return { publish: false, reason: "private" };
  }

  if (registryVersion === pkg.version) {
    return { publish: false, reason: "already published" };
  }

  if (registryVersion === null) {
    return { publish: true, reason: "new package" };
  }

  return { publish: true, reason: "version changed" };
}
