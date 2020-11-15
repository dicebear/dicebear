export function gte(a: string, b: string) {
  let aParsed = parse(a);
  let bParsed = parse(b);

  if (aParsed.major > bParsed.major) {
    return true;
  }

  if (aParsed.major < bParsed.major) {
    return false;
  }

  if (aParsed.minor > bParsed.minor) {
    return true;
  }

  if (aParsed.minor < bParsed.minor) {
    return false;
  }

  return aParsed.patch >= bParsed.patch;
}

export function parse(version: string) {
  let [major, minor, patch] = version.split('.').map((v) => parseInt(v));

  return { major, minor, patch };
}
