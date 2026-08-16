import { getAvatarApiUrl, getAvatarApiCommand } from './avatar/api';

export interface CodeExamples {
  httpApi: string;
  js: string;
  php: string;
  python: string;
  rust: string;
  go: string;
  dart: string;
  cli: string;
}

export function formatPhpValue(value: unknown, depth = 0): string {
  const indent = '    '.repeat(depth);
  const outerIndent = depth > 0 ? '    '.repeat(depth - 1) : '';

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string')
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    if (depth === 0) {
      return `[${value.map((v) => formatPhpValue(v)).join(', ')}]`;
    }

    const items = value.map((v) => `${indent}${formatPhpValue(v, depth + 1)}`);

    return `[\n${items.join(',\n')}\n${outerIndent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '[]';

    if (depth === 0) {
      return `[${entries.map(([k, v]) => `'${k.replace(/'/g, "\\'")}' => ${formatPhpValue(v)}`).join(', ')}]`;
    }

    const items = entries.map(
      ([k, v]) =>
        `${indent}'${k.replace(/'/g, "\\'")}' => ${formatPhpValue(v, depth + 1)}`,
    );

    return `[\n${items.join(',\n')}\n${outerIndent}]`;
  }

  return String(value);
}

export function formatPythonValue(value: unknown, depth = 0): string {
  const indent = '    '.repeat(depth);
  const outerIndent = depth > 0 ? '    '.repeat(depth - 1) : '';

  if (value === null || value === undefined) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string')
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    if (depth === 0) {
      return `[${value.map((v) => formatPythonValue(v)).join(', ')}]`;
    }

    const items = value.map(
      (v) => `${indent}${formatPythonValue(v, depth + 1)}`,
    );

    return `[\n${items.join(',\n')}\n${outerIndent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';

    if (depth === 0) {
      return `{${entries.map(([k, v]) => `"${k.replace(/"/g, '\\"')}": ${formatPythonValue(v)}`).join(', ')}}`;
    }

    const items = entries.map(
      ([k, v]) =>
        `${indent}"${k.replace(/"/g, '\\"')}": ${formatPythonValue(v, depth + 1)}`,
    );

    return `{\n${items.join(',\n')}\n${outerIndent}}`;
  }

  return String(value);
}

export function formatGoValue(value: unknown, depth = 0): string {
  const indent = '\t'.repeat(depth);
  const outerIndent = depth > 0 ? '\t'.repeat(depth - 1) : '';

  if (value === null || value === undefined) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string')
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]any{}';

    if (depth === 0) {
      return `[]any{${value.map((v) => formatGoValue(v)).join(', ')}}`;
    }

    const items = value.map((v) => `${indent}${formatGoValue(v, depth + 1)}`);

    // Go requires a trailing comma when the closing brace is on its own line.
    return `[]any{\n${items.join(',\n')},\n${outerIndent}}`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return 'map[string]any{}';

    if (depth === 0) {
      return `map[string]any{${entries.map(([k, v]) => `"${k.replace(/"/g, '\\"')}": ${formatGoValue(v)}`).join(', ')}}`;
    }

    const items = entries.map(
      ([k, v]) =>
        `${indent}"${k.replace(/"/g, '\\"')}": ${formatGoValue(v, depth + 1)}`,
    );

    // Go requires a trailing comma when the closing brace is on its own line.
    return `map[string]any{\n${items.join(',\n')},\n${outerIndent}}`;
  }

  return String(value);
}

export function formatDartValue(value: unknown, depth = 0): string {
  const indent = '  '.repeat(depth);
  const outerIndent = depth > 0 ? '  '.repeat(depth - 1) : '';

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string')
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    if (depth === 0) {
      return `[${value.map((v) => formatDartValue(v)).join(', ')}]`;
    }

    const items = value.map((v) => `${indent}${formatDartValue(v, depth + 1)}`);

    // dart format keeps a trailing comma when the closing bracket is on its
    // own line.
    return `[\n${items.join(',\n')},\n${outerIndent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';

    if (depth === 0) {
      return `{${entries.map(([k, v]) => `'${k.replace(/'/g, "\\'")}': ${formatDartValue(v)}`).join(', ')}}`;
    }

    const items = entries.map(
      ([k, v]) =>
        `${indent}'${k.replace(/'/g, "\\'")}': ${formatDartValue(v, depth + 1)}`,
    );

    return `{\n${items.join(',\n')},\n${outerIndent}}`;
  }

  return String(value);
}

/**
 * The body of a map literal: one `key: value` line per option at the given
 * indent, wrapped in the newlines that separate it from the braces. Values are
 * formatted at depth 0, which keeps nested arrays on a single line. A preset
 * sets a dozen color groups, and putting every hex on its own line would bury
 * the snippet.
 *
 * An empty option set collapses to nothing, so the braces close on the same
 * line instead of wrapping a blank line or, in Go and Dart, a lone comma.
 */
function optionLines(
  options: Record<string, unknown>,
  indent: string,
  line: (key: string, value: unknown) => string,
  trailingComma = false,
): string {
  const entries = Object.entries(options);

  if (entries.length === 0) {
    return '';
  }

  const body = entries
    .map(([key, value]) => `${indent}${line(key, value)}`)
    .join(',\n');

  return `\n${body}${trailingComma ? ',' : ''}\n`;
}

/**
 * The eight snippets shown next to an option: one call per library, plus the
 * HTTP-API URL and the CLI invocation. Takes a whole option set, because the
 * options table passes one entry and a preset card passes a dozen.
 */
export function generateCodeExamples(
  styleName: string,
  options: Record<string, unknown>,
): CodeExamples {
  const httpApi = getAvatarApiUrl(styleName, options);

  const js = `new Avatar(style, {${optionLines(
    options,
    '  ',
    (key, value) => `${key}: ${JSON.stringify(value)}`,
  )}});`;

  const php = `new Avatar($style, [${optionLines(
    options,
    '  ',
    (key, value) => `'${key}' => ${formatPhpValue(value)}`,
  )}]);`;

  const python = `Avatar(style, {${optionLines(
    options,
    '    ',
    (key, value) => `"${key}": ${formatPythonValue(value)}`,
  )}})`;

  const rust = `Avatar::new(&style, json!({${optionLines(
    options,
    '    ',
    (key, value) => `"${key}": ${JSON.stringify(value)}`,
  )}}))?;`;

  // Go and Dart keep a trailing comma when the closing brace sits on its own
  // line, matching what gofmt and dart format produce.
  const go = `dicebear.NewAvatar(style, map[string]any{${optionLines(
    options,
    '\t',
    (key, value) => `"${key}": ${formatGoValue(value)}`,
    true,
  )}})`;

  const dart = `Avatar(style, {${optionLines(
    options,
    '  ',
    (key, value) => `'${key}': ${formatDartValue(value)}`,
    true,
  )}});`;

  const cli = getAvatarApiCommand(styleName, options);

  return { httpApi, js, php, python, rust, go, dart, cli };
}
