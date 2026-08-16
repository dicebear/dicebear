/**
 * The playground setup as a file: the avatar style, the seed, and every option
 * the reader changed. Written so a look can leave the browser it was made in,
 * go into a repository or a message, and come back later unchanged.
 *
 * JSON, because the options already are JSON. The same object goes into
 * `new Avatar()`, into the code snippets under "How to use", and into the
 * preset files. TOML or YAML would mean a parser in the bundle and a second
 * set of rules for nested weights and color lists, for a file nobody writes
 * by hand anyway.
 */
import { Avatar, OptionsDescriptor } from '@dicebear/core';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';

export type PlaygroundConfig = {
  /** Absent when the file carries options only, e.g. a pasted snippet. */
  style?: string;
  /** Render options including `seed`, ready to pass to `new Avatar()`. */
  options: Record<string, unknown>;
};

/** Raised when a file's meaning changes. Parsing refuses anything higher. */
const CONFIG_VERSION = 1;

/**
 * Everything here comes from outside: a file, or whatever was pasted into the
 * dialog. A real config is a few hundred bytes, so the cap is only there to
 * keep a mistaken paste of something enormous from parsing at all.
 */
export const MAX_CONFIG_BYTES = 256 * 1024;

/** Matches the schema's limit for option names. */
const MAX_STYLE_NAME_LENGTH = 128;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function serializePlaygroundConfig(config: PlaygroundConfig): string {
  return JSON.stringify(
    {
      version: CONFIG_VERSION,
      style: config.style,
      options: config.options,
    },
    null,
    2,
  );
}

/**
 * Reads an exported file, or a bare options object.
 *
 * The second shape is there because the options block is the unit people
 * already copy around: it is what the "How to use" snippets print and what a
 * preset stores. Telling the two apart works on the `options` key, which is
 * not a render option itself. A bare object is applied to the style that is
 * currently selected, since nothing in it says which one it came from.
 *
 * Throws with a message meant for the reader.
 */
export function parsePlaygroundConfig(text: string): PlaygroundConfig {
  let parsed: unknown;

  if (new TextEncoder().encode(text).length > MAX_CONFIG_BYTES) {
    throw new Error('This is too large to be a set of options (max 256 KB).');
  }

  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`This is not valid JSON: ${(err as Error).message}`, {
      cause: err,
    });
  }

  if (!isPlainObject(parsed)) {
    throw new Error('Expected a JSON object.');
  }

  // The version says how to read the rest, so it is checked before the shape
  // is worked out. Run the other way round, a file whose next format drops the
  // `options` wrapper would fall into the bare-options branch below and come
  // back as a complaint about option names.
  if ('version' in parsed) {
    if (typeof parsed.version !== 'number') {
      throw new Error('The "version" field has to be a number.');
    }

    if (parsed.version > CONFIG_VERSION) {
      throw new Error(
        'This file was written by a newer version of the playground.',
      );
    }
  }

  if (!('options' in parsed)) {
    return { options: parsed };
  }

  if (!isPlainObject(parsed.options)) {
    throw new Error('The "options" field has to be an object.');
  }

  // Length included, because the name is quoted back at the reader when no
  // style answers to it, and it is their text until then.
  if (
    parsed.style !== undefined &&
    (typeof parsed.style !== 'string' ||
      parsed.style.length > MAX_STYLE_NAME_LENGTH)
  ) {
    throw new Error('The "style" field has to be the name of an avatar style.');
  }

  return { style: parsed.style, options: parsed.options };
}

const quote = (values: readonly string[]) =>
  values.map((value) => `"${value}"`).join(', ');

/** The names in an option the reader picks from a list: one, several, or weighted. */
function pickedNames(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === 'string');
  }

  if (isPlainObject(value)) {
    return Object.keys(value);
  }

  return [];
}

/**
 * Checks the config against the style it is about to be applied to, then
 * renders it once, so that a file which cannot work says why instead of
 * leaving the reader in front of a preview that did not change.
 *
 * The core's schema only knows the shape of an option: `hairColor` passes it
 * whether or not the style has hair, and `hairVariant: ["long01"]` passes it
 * whether or not that variant exists. Neither throws. The first is ignored and
 * the second matches no variant at all, which renders an avatar with the
 * component missing. So both are read off the style's own descriptor here.
 * What the core answers after that is the rest: a size beyond the limit, a
 * color that is not a color.
 */
export async function checkPlaygroundConfig(
  styleName: string,
  options: Record<string, unknown>,
): Promise<void> {
  const style = await loadAvatarStyle(styleName);
  const descriptor = new OptionsDescriptor(style).toJSON();

  // `Object.hasOwn`, so that an option named `constructor` counts as unknown
  // here rather than as something the prototype chain answers for.
  const unknown = Object.keys(options).filter(
    (key) => !Object.hasOwn(descriptor, key),
  );

  if (unknown.length > 0) {
    throw new Error(
      `This avatar style has no option called ${quote(unknown)}. The options were probably made with a different avatar style.`,
    );
  }

  for (const [key, value] of Object.entries(options)) {
    const field = descriptor[key];

    // `open` marks a field whose listed values are suggestions. The tag filter
    // is the one that carries it, and it takes a grammar rather than a name.
    if (field.type !== 'enum' || field.open) {
      continue;
    }

    const missing = pickedNames(value).filter(
      (name) => !field.values.includes(name),
    );

    if (missing.length > 0) {
      throw new Error(
        `The "${key}" option of this avatar style has no ${quote(missing)}. The options were probably made with a different avatar style.`,
      );
    }
  }

  void new Avatar(style, clonePlain(options));
}
