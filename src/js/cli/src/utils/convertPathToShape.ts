import type { CustomPlugin } from 'svgo';

interface Point {
  x: number;
  y: number;
}

/** One arc segment, with its end point already made absolute. */
interface Arc extends Point {
  kind: 'arc';
  rx: number;
  ry: number;
  rotation: number;
  largeArc: number;
  sweep: number;
}

/** One cubic segment, with all four points absolute. */
interface Curve extends Point {
  kind: 'curve';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

type Segment = Arc | Curve;

/** An axis-aligned ellipse. `rx === ry` makes it a circle. */
interface Ellipse {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const TOKENS = /[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g;

const ARGUMENTS: Record<string, number> = { C: 6, S: 4, A: 7 };

/**
 * Attributes that tie the rendering to the path's own start point and
 * direction. Markers only render on a path, and a dash pattern begins where
 * the path begins, while a circle's stroke begins at its three o'clock point.
 */
const PATH_BOUND_ATTRIBUTES = [
  'marker-start',
  'marker-mid',
  'marker-end',
  'stroke-dasharray',
  'stroke-dashoffset',
  'pathLength',
];

/**
 * Reads a single subpath made of arcs and cubics into absolute segments, which
 * are the two shapes a circle takes once it has been through a vector editor.
 * Returns null for everything else, including a straight edge, a second
 * subpath and the shorthand that writes the two arc flags without a separator.
 */
function parsePath(d: string): { start: Point; segments: Segment[] } | null {
  const tokens = d.match(TOKENS);

  if (tokens === null || tokens.length < 3) {
    return null;
  }

  if (tokens[0] !== 'M' && tokens[0] !== 'm') {
    return null;
  }

  const start = { x: Number(tokens[1]), y: Number(tokens[2]) };

  if (!Number.isFinite(start.x) || !Number.isFinite(start.y)) {
    return null;
  }

  const segments: Segment[] = [];
  // A move is followed by implicit line commands, per the SVG grammar, and a
  // line is not part of any shape this rule rebuilds.
  let command = '';
  let x = start.x;
  let y = start.y;
  let index = 3;

  while (index < tokens.length) {
    const token = tokens[index];

    if (/^[a-zA-Z]$/.test(token)) {
      // A close is only allowed as the last command, and a second move would
      // open a subpath this rule cannot express as one element.
      if (token === 'Z' || token === 'z') {
        return index === tokens.length - 1 ? { start, segments } : null;
      }

      if (ARGUMENTS[token.toUpperCase()] === undefined) {
        return null;
      }

      command = token;
      index += 1;

      continue;
    }

    if (command === '') {
      return null;
    }

    const upper = command.toUpperCase();
    const relative = command !== upper;
    const count = ARGUMENTS[upper];
    const raw = tokens.slice(index, index + count);
    const args = raw.map(Number);

    if (args.length < count || args.some((value) => !Number.isFinite(value))) {
      return null;
    }

    index += count;

    if (upper === 'A') {
      // Flags are single digits and may be written without a separator, which
      // this reader cannot tell apart from a coordinate. Bailing out keeps it
      // from misreading `a7 7 0 110 0-14` as a radius of 110, and the length
      // check keeps a fused `00.5` from shifting the whole argument frame.
      if (
        raw[3].length !== 1 ||
        raw[4].length !== 1 ||
        args[3] > 1 ||
        args[4] > 1
      ) {
        return null;
      }

      x = relative ? x + args[5] : args[5];
      y = relative ? y + args[6] : args[6];

      segments.push({
        kind: 'arc',
        rx: Math.abs(args[0]),
        ry: Math.abs(args[1]),
        rotation: args[2],
        largeArc: args[3],
        sweep: args[4],
        x,
        y,
      });

      continue;
    }

    const previous = segments[segments.length - 1];
    const offsetX = relative ? x : 0;
    const offsetY = relative ? y : 0;
    let x1: number;
    let y1: number;

    if (upper === 'S') {
      // The first handle of a shorthand mirrors the previous one, and stands on
      // the point itself when there is nothing to mirror.
      const mirror = previous?.kind === 'curve' ? previous : undefined;

      x1 = mirror ? 2 * x - mirror.x2 : x;
      y1 = mirror ? 2 * y - mirror.y2 : y;
    } else {
      x1 = offsetX + args[0];
      y1 = offsetY + args[1];
    }

    const rest = upper === 'S' ? args : args.slice(2);

    segments.push({
      kind: 'curve',
      x1,
      y1,
      x2: offsetX + rest[0],
      y2: offsetY + rest[1],
      x: offsetX + rest[2],
      y: offsetY + rest[3],
    });

    x = offsetX + rest[2];
    y = offsetY + rest[3];
  }

  return { start, segments };
}

/** Signed angle from one vector to another. */
function angleBetween(ux: number, uy: number, vx: number, vy: number): number {
  const dot = ux * vx + uy * vy;
  const length = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  const result = Math.acos(Math.min(1, Math.max(-1, dot / length)));

  return ux * vy - uy * vx < 0 ? -result : result;
}

/**
 * Center, swept angle and effective radii of one arc, from the endpoint
 * parameterization the SVG specification describes. Radii too small for the
 * two end points are scaled up the way a renderer would, so the result
 * describes what the arc actually draws.
 */
function arcCenter(
  from: Point,
  arc: Arc,
): { cx: number; cy: number; rx: number; ry: number; delta: number } | null {
  if (arc.rx === 0 || arc.ry === 0) {
    return null;
  }

  const phi = (arc.rotation * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (from.x - arc.x) / 2;
  const dy = (from.y - arc.y) / 2;
  const px = cos * dx + sin * dy;
  const py = -sin * dx + cos * dy;

  let { rx, ry } = arc;
  const lambda = (px * px) / (rx * rx) + (py * py) / (ry * ry);

  if (lambda > 1) {
    const scale = Math.sqrt(lambda);

    rx *= scale;
    ry *= scale;
  }

  const numerator = rx * rx * ry * ry - rx * rx * py * py - ry * ry * px * px;
  const denominator = rx * rx * py * py + ry * ry * px * px;

  if (denominator === 0) {
    return null;
  }

  const factor =
    (arc.largeArc === arc.sweep ? -1 : 1) *
    Math.sqrt(Math.max(0, numerator / denominator));
  const cxp = (factor * rx * py) / ry;
  const cyp = (-factor * ry * px) / rx;

  let delta = angleBetween(
    (px - cxp) / rx,
    (py - cyp) / ry,
    (-px - cxp) / rx,
    (-py - cyp) / ry,
  );

  if (arc.sweep === 0 && delta > 0) {
    delta -= 2 * Math.PI;
  }

  if (arc.sweep === 1 && delta < 0) {
    delta += 2 * Math.PI;
  }

  return {
    cx: cos * cxp - sin * cyp + (from.x + arc.x) / 2,
    cy: sin * cxp + cos * cyp + (from.y + arc.y) / 2,
    rx,
    ry,
    delta,
  };
}

/**
 * The shape one closed run of arcs draws around a common center, together with
 * the middle point of every arc.
 *
 * The centers are averaged rather than compared: a center computed from
 * rounded coordinates drifts by several thousandths on a chord that comes close
 * to the diameter, and whether the average really describes the path is settled
 * afterwards, by putting every point back on it. The endpoints alone cannot do
 * that: on a two-arc circle they all lie on one chord, so only the middles pin
 * the center in the other direction, and only they reveal an egg drawn around
 * two centers.
 *
 * Rotated ellipses are left alone. Expressing one needs a transform, and the
 * path is already the shorter way to write it.
 */
function fitFromArcs(
  start: Point,
  arcs: Arc[],
  tolerance: number,
): { shape: Ellipse; midpoints: Point[] } | null {
  if (arcs.length < 2) {
    return null;
  }

  let from: Point = start;
  let sumX = 0;
  let sumY = 0;
  let sumDelta = 0;
  const midpoints: Point[] = [];

  for (const arc of arcs) {
    if (arc.rotation % 180 !== 0) {
      return null;
    }

    if (
      Math.abs(arc.rx - arcs[0].rx) > tolerance ||
      Math.abs(arc.ry - arcs[0].ry) > tolerance
    ) {
      return null;
    }

    const center = arcCenter(from, arc);

    if (center === null) {
      return null;
    }

    const phi = (arc.rotation * Math.PI) / 180;
    const cos = Math.cos(phi);
    const sin = Math.sin(phi);
    const theta =
      Math.atan2(
        (-sin * (from.x - center.cx) + cos * (from.y - center.cy)) / center.ry,
        (cos * (from.x - center.cx) + sin * (from.y - center.cy)) / center.rx,
      ) +
      center.delta / 2;

    midpoints.push({
      x:
        center.cx +
        cos * center.rx * Math.cos(theta) -
        sin * center.ry * Math.sin(theta),
      y:
        center.cy +
        sin * center.rx * Math.cos(theta) +
        cos * center.ry * Math.sin(theta),
    });

    sumX += center.cx;
    sumY += center.cy;
    sumDelta += center.delta;

    from = arc;
  }

  if (
    Math.abs(from.x - start.x) > tolerance ||
    Math.abs(from.y - start.y) > tolerance
  ) {
    return null;
  }

  // Each arc contributes the angle around its own center, so a few rounded
  // coordinates already put the sum a thousandth of a radian off a full turn.
  // The check only has to tell a closed shape from a lens, where the two arcs
  // run against each other and the sum is nowhere near one.
  if (Math.abs(Math.abs(sumDelta) - 2 * Math.PI) > 0.01) {
    return null;
  }

  return {
    shape: {
      cx: sumX / arcs.length,
      cy: sumY / arcs.length,
      rx: arcs.reduce((sum, arc) => sum + arc.rx, 0) / arcs.length,
      ry: arcs.reduce((sum, arc) => sum + arc.ry, 0) / arcs.length,
    },
    midpoints,
  };
}

/**
 * True when every cubic segment is the standard approximation of an elliptical
 * arc on the given shape.
 *
 * Scaling the points by the radii turns the shape into a unit circle and leaves
 * the curves cubic, so each segment can be held against the handle length a
 * quarter-turn approximation would use, `4/3 · tan(sweep/4)`. That is a far
 * tighter statement than measuring how close the curve passes the outline: a
 * bezier bulges inwards by up to three ten-thousandths of the radius, which on
 * a large circle is wider than the rounding this rule is meant to undo.
 */
function curvesMatch(
  shape: Ellipse,
  start: Point,
  curves: Curve[],
  tolerance: number,
): boolean {
  if (curves.length < 3) {
    return false;
  }

  const radius = Math.min(shape.rx, shape.ry);
  const unit = (x: number, y: number) => ({
    x: (x - shape.cx) / shape.rx,
    y: (y - shape.cy) / shape.ry,
  });

  let from = unit(start.x, start.y);
  let sum = 0;

  for (const curve of curves) {
    const to = unit(curve.x, curve.y);

    if (
      Math.abs(Math.hypot(from.x, from.y) - 1) * radius > tolerance ||
      Math.abs(Math.hypot(to.x, to.y) - 1) * radius > tolerance
    ) {
      return false;
    }

    const delta = angleBetween(from.x, from.y, to.x, to.y);

    // A cubic cannot carry half a turn or more, and a run that changes
    // direction is not a closed shape.
    if (
      Math.abs(delta) < 1e-6 ||
      (sum !== 0 && Math.sign(delta) !== Math.sign(sum))
    ) {
      return false;
    }

    const handle = (4 / 3) * Math.tan(delta / 4);
    const expected = [
      { x: from.x - handle * from.y, y: from.y + handle * from.x },
      { x: to.x + handle * to.y, y: to.y - handle * to.x },
    ];
    const actual = [unit(curve.x1, curve.y1), unit(curve.x2, curve.y2)];

    for (let i = 0; i < 2; i++) {
      if (
        Math.abs(actual[i].x - expected[i].x) * shape.rx > tolerance ||
        Math.abs(actual[i].y - expected[i].y) * shape.ry > tolerance
      ) {
        return false;
      }
    }

    sum += delta;
    from = to;
  }

  return Math.abs(Math.abs(sum) - 2 * Math.PI) < 0.01;
}

/** Radial distance between a point and an ellipse, near enough for a check. */
function ellipseDistance(shape: Ellipse, point: Point): number {
  const dx = (point.x - shape.cx) / shape.rx;
  const dy = (point.y - shape.cy) / shape.ry;

  return Math.abs(Math.hypot(dx, dy) - 1) * Math.min(shape.rx, shape.ry);
}

/**
 * The shortest way to write a fitted shape that the path still agrees with.
 *
 * A fit computed from rounded coordinates lands a few thousandths beside the
 * shape the path was drawn from, so writing it out at full precision would
 * carry that error into the definition and hand the next export a slightly
 * different shape again. Trying the short forms first turns a center of 10.003
 * back into 10 whenever the path allows it, which is what makes the result
 * reproducible.
 */
function shortestForm<T extends object>(
  values: T,
  precision: number,
  agrees: (candidate: T) => boolean,
): T | null {
  for (let digits = 0; digits <= precision; digits++) {
    const candidate = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        Number((value as number).toFixed(digits)),
      ]),
    ) as T;

    if (agrees(candidate)) {
      return candidate;
    }
  }

  return null;
}

/** Replaces a path element in place with the shape it draws. */
function rewrite(
  node: { name: string; attributes: Record<string, string> },
  name: string,
  geometry: object,
): void {
  const attributes: Record<string, string> = {};

  // Rebuilt in place of `d` so the attribute order of the definition survives
  // the rewrite.
  for (const [key, value] of Object.entries(node.attributes)) {
    if (key !== 'd') {
      attributes[key] = value;

      continue;
    }

    for (const [name, number] of Object.entries(geometry)) {
      attributes[name] = String(number);
    }
  }

  node.name = name;
  node.attributes = attributes;
}

/**
 * Turns a path that draws a circle, an axis-aligned ellipse or a rectangle back
 * into the element it was, the counterpart to svgo's `convertShapeToPath`.
 *
 * Vector editors have no primitives to export: a circle drawn in one comes back
 * either fitted to arcs or written as the curves it is made of, and neither
 * form is exact. A definition that keeps its circles as paths therefore picks
 * up a fresh set of thousandths on every trip, and the repeated `cx`/`cy`/`r`
 * of a real shape also compress better than the unique blob of a path.
 * Rewriting them here ends both: the next import hands the editor a primitive
 * again, and the export of a primitive is exact.
 *
 * Rectangles are deliberately not rebuilt. Their edges are straight lines that
 * survive an editor unchanged, so they carry none of the drift this rule exists
 * for, and a path is the shorter way to store them.
 *
 * DiceBear Studio for Figma carries the same rule in its exporter. Changes
 * belong in both.
 */
export function convertPathToShape(params: {
  floatPrecision: number;
}): CustomPlugin {
  const { floatPrecision } = params;
  // A path that came back from an editor was fitted to arcs by svgo's
  // `makeArcs`, which allows itself 2.5 units of the last written decimal. The
  // radii of such a path therefore have to be compared with that much room,
  // while the points themselves, being rounded values on the drawn shape, are
  // held to a single unit.
  const matchTolerance = 2.5 * 10 ** -floatPrecision;
  const pointTolerance = 10 ** -floatPrecision;

  return {
    name: 'convertPathToShape',
    fn: () => ({
      element: {
        enter: (node) => {
          if (node.name !== 'path' || typeof node.attributes.d !== 'string') {
            return;
          }

          // Rewriting such a path would move its markers or its dash
          // pattern, so it stays a path.
          if (
            PATH_BOUND_ATTRIBUTES.some(
              (attribute) => node.attributes[attribute] !== undefined,
            )
          ) {
            return;
          }

          const path = parsePath(node.attributes.d);

          if (path === null || path.segments.length < 2) {
            return;
          }

          const { start, segments } = path;
          const ellipse = fitEllipse(
            start,
            segments,
            floatPrecision,
            matchTolerance,
            pointTolerance,
          );

          if (ellipse === null) {
            return;
          }

          const circle = ellipse.rx === ellipse.ry;

          rewrite(
            node,
            circle ? 'circle' : 'ellipse',
            circle
              ? { cx: ellipse.cx, cy: ellipse.cy, r: ellipse.rx }
              : ellipse,
          );
        },
      },
    }),
  };
}

/** The ellipse a run of arcs or a run of cubics draws, if it draws one. */
function fitEllipse(
  start: Point,
  segments: Segment[],
  precision: number,
  matchTolerance: number,
  pointTolerance: number,
): Ellipse | null {
  const withinRadius = (candidate: Ellipse, fitted: Ellipse) =>
    Math.abs(candidate.rx - fitted.rx) <=
      Math.min(matchTolerance, fitted.rx * 0.05) &&
    Math.abs(candidate.ry - fitted.ry) <=
      Math.min(matchTolerance, fitted.ry * 0.05);

  if (segments.every((segment): segment is Arc => segment.kind === 'arc')) {
    const fitted = fitFromArcs(start, segments, matchTolerance);

    if (fitted === null) {
      return null;
    }

    const nodes: Point[] = [start, ...segments];

    // Points alone would allow a wider circle through the same two ends, so the
    // radius is held to the fit as well. Together they bound how far any part
    // of the shape can move. The relative share keeps a small radius from being
    // rounded to a multiple of itself at a coarse precision. The arc middles
    // get twice the room of the radii: a center computed from rounded
    // endpoints sits a few units of the last decimal beside the drawn shape
    // on a near-diameter chord, and the middles carry that drift on top of
    // the radius rounding.
    return shortestForm(
      fitted.shape,
      precision,
      (candidate) =>
        candidate.rx > 0 &&
        candidate.ry > 0 &&
        withinRadius(candidate, fitted.shape) &&
        nodes.every(
          (node) => ellipseDistance(candidate, node) <= pointTolerance,
        ) &&
        fitted.midpoints.every(
          (point) => ellipseDistance(candidate, point) <= 2 * matchTolerance,
        ),
    );
  }

  if (
    !segments.every((segment): segment is Curve => segment.kind === 'curve')
  ) {
    return null;
  }

  const last = segments[segments.length - 1];

  // The arcs close over fitFromArcs; a run of cubics has to end on its start
  // as well, or an open arc of almost a full turn would come back closed.
  if (
    Math.abs(last.x - start.x) > matchTolerance ||
    Math.abs(last.y - start.y) > matchTolerance
  ) {
    return null;
  }

  const nodes: Point[] = [start, ...segments];

  const xs = nodes.map((node) => node.x);
  const ys = nodes.map((node) => node.y);
  const fitted = {
    cx: (Math.min(...xs) + Math.max(...xs)) / 2,
    cy: (Math.min(...ys) + Math.max(...ys)) / 2,
    rx: (Math.max(...xs) - Math.min(...xs)) / 2,
    ry: (Math.max(...ys) - Math.min(...ys)) / 2,
  };

  return shortestForm(
    fitted,
    precision,
    (candidate) =>
      candidate.rx > 0 &&
      candidate.ry > 0 &&
      withinRadius(candidate, fitted) &&
      curvesMatch(candidate, start, segments, matchTolerance),
  );
}
