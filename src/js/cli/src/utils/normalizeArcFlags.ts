import type { CustomPlugin } from 'svgo';

const TOKENS = /[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g;

/** How many arguments each path command takes. */
const ARGUMENTS: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

/**
 * Rewrites the large-arc flag of every arc that draws exactly half a circle.
 *
 * Between two points that lie a diameter apart, the long and the short way
 * round are the same half circle, and which of the two halves is drawn is the
 * sweep flag's business. The large-arc flag therefore carries no meaning there,
 * and svgo decides it by comparing a computed angle against exactly π. That
 * comparison sits on the rounding rest of the last export, so the flag flips
 * back and forth between round-trips while the picture never changes. Pinning
 * it removes that noise from the diff.
 *
 * Only an exact match counts. On a chord a little shorter than the diameter the
 * two arcs sit on different centers, and a couple of thousandths in the chord
 * already move the middle of the arc by two tenths.
 */
export function normalizeArcFlags(): CustomPlugin {
  return {
    name: 'normalizeArcFlags',
    fn: () => ({
      element: {
        enter: (node) => {
          if (typeof node.attributes.d !== 'string') {
            return;
          }

          const rewritten = pinHalfCircles(node.attributes.d);

          if (rewritten !== null) {
            node.attributes.d = rewritten;
          }
        },
      },
    }),
  };
}

/**
 * The path with the large-arc flag of every exact half circle set to 0, or null
 * when nothing changed or the path cannot be read with confidence.
 */
function pinHalfCircles(d: string): string | null {
  const tokens = [...d.matchAll(TOKENS)];
  const positions: number[] = [];
  let command = '';
  let index = 0;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;

  while (index < tokens.length) {
    const token = tokens[index][0];

    if (/[a-zA-Z]/.test(token)) {
      command = token;
      index += 1;

      if (command === 'Z' || command === 'z') {
        x = startX;
        y = startY;
      }

      continue;
    }

    const upper = command.toUpperCase();
    const count = ARGUMENTS[upper];

    if (count === undefined || count === 0) {
      return null;
    }

    const slice = tokens.slice(index, index + count);

    if (slice.length < count) {
      return null;
    }

    const args = slice.map((match) => Number(match[0]));

    if (args.some((value) => !Number.isFinite(value))) {
      return null;
    }

    index += count;

    const relative = command !== upper;

    if (upper === 'A') {
      // Flags may be written as a single digit without a separator, which this
      // reader cannot tell from a coordinate. Giving up keeps it from pinning
      // the wrong token.
      if (slice[3][0].length !== 1 || slice[4][0].length !== 1) {
        return null;
      }

      const endX = relative ? x + args[5] : args[5];
      const endY = relative ? y + args[6] : args[6];

      if (
        args[0] === args[1] &&
        args[3] === 1 &&
        Math.hypot(endX - x, endY - y) === 2 * Math.abs(args[0])
      ) {
        positions.push(slice[3].index);
      }

      x = endX;
      y = endY;
    } else if (upper === 'H') {
      x = relative ? x + args[0] : args[0];
    } else if (upper === 'V') {
      y = relative ? y + args[0] : args[0];
    } else {
      x = relative ? x + args[count - 2] : args[count - 2];
      y = relative ? y + args[count - 1] : args[count - 1];
    }

    if (upper === 'M') {
      startX = x;
      startY = y;
      // A move is followed by implicit line commands, per the SVG grammar.
      command = relative ? 'l' : 'L';
    }
  }

  if (positions.length === 0) {
    return null;
  }

  // Split into UTF-16 units so the offsets from the tokenizer line up.
  const characters = d.split('');

  for (const position of positions) {
    characters[position] = '0';
  }

  return characters.join('');
}
