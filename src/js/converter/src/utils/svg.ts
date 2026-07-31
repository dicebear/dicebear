import { XMLParser } from 'fast-xml-parser';
import XMLBuilder from 'fast-xml-builder';
import { Metadata } from '../types';

const MAX_SIZE = 2048;
const DEFAULT_SIZE = 512;
const MAX_METADATA_LENGTH = 1024;

const xmlRoundTripOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  preserveOrder: true,
  commentPropName: '#comment',
  cdataPropName: '#cdata',
  allowBooleanAttributes: true,
  processEntities: false,
  // Keep text nodes byte-exact. Without these two, the round trip trims
  // whitespace and coerces numeric-looking text ("0123" becomes "123"),
  // and that visibly changes rendered <text> content.
  trimValues: false,
  parseTagValue: false,
  // The parser default of 100 rejects valid documents that resvg renders
  // fine. The cap stays finite because parser, walker, and builder all
  // recurse once per nesting level, and an unbounded value would trade a
  // clean error for a stack overflow on pathological input.
  maxNestedTags: 1024,
};

const xmlRoundTripParser = new XMLParser(xmlRoundTripOptions);
const xmlRoundTripBuilder = new XMLBuilder(xmlRoundTripOptions);

/**
 * A node in a `preserveOrder` parse result: one key holding the child list,
 * named after the tag, plus the attribute map under `:@`.
 */
type XmlNode = {
  ':@'?: Record<string, unknown>;
  [tagName: string]: unknown;
};

/**
 * Clamps a requested size into a sane integer range, falling back to
 * `DEFAULT_SIZE` for non-finite or non-positive inputs.
 */
function sanitizeSize(size: number): number {
  if (!Number.isFinite(size) || size <= 0) {
    return DEFAULT_SIZE;
  }

  return Math.floor(Math.min(size, MAX_SIZE));
}

/**
 * Sets `width`/`height` on the root `<svg>` node, so downstream rasterizers
 * know how large to render.
 */
function setSizeAttributes(svgNode: XmlNode | undefined, size: number): void {
  if (svgNode) {
    const attributes = (svgNode[':@'] ??= {});

    attributes['@_width'] = String(size);
    attributes['@_height'] = String(size);
  }
}

/**
 * The tag names of a `preserveOrder` node — every key that is not the
 * attribute map or a text/comment/cdata entry. This is the one place that
 * encodes the parser's node shape.
 */
function elementTags(node: XmlNode): string[] {
  return Object.keys(node).filter(
    (key) => key !== ':@' && !key.startsWith('#') && Array.isArray(node[key]),
  );
}

/**
 * The element children of a `preserveOrder` child list, with text and
 * comment nodes skipped.
 */
function elementChildren(
  children: XmlNode[],
): Array<{ tagName: string; node: XmlNode }> {
  return children.flatMap((node) =>
    elementTags(node).map((tagName) => ({ tagName, node })),
  );
}

/**
 * Depth-first visit of every element in a `preserveOrder` parse result.
 * Text and comment nodes are skipped.
 */
function visitElements(
  nodes: XmlNode[],
  visit: (tagName: string, node: XmlNode) => void,
): void {
  for (const node of nodes) {
    for (const tagName of elementTags(node)) {
      visit(tagName, node);
      visitElements(node[tagName] as XmlNode[], visit);
    }
  }
}

/**
 * The value of the last `mask-type` declaration in a `style` attribute. The
 * last one wins, as it does in CSS. The value comes back lowercased: CSS
 * keywords are case-insensitive while SVG attribute values are not, and
 * resvg would reject a verbatim `Alpha` and silently fall back to the
 * default.
 */
function declaredMaskType(style: unknown): string | undefined {
  if (typeof style !== 'string') {
    return undefined;
  }

  let declared: string | undefined;

  for (const declaration of style.split(';')) {
    const colon = declaration.indexOf(':');

    if (colon === -1) {
      continue;
    }

    const property = declaration.slice(0, colon).trim().toLowerCase();

    if (property !== 'mask-type') {
      continue;
    }

    // A single keyword, optionally with !important. A browser drops anything
    // else as an invalid declaration, and copied into the attribute it would
    // make resvg fall back to the default.
    const value = declaration
      .slice(colon + 1)
      .match(/^\s*([\w-]+)\s*(?:!\s*important\s*)?$/i);

    if (value) {
      declared = value[1].toLowerCase();
    }
  }

  return declared;
}

/**
 * Applies the {@link normalizeMaskType} fix to a parsed tree: every `<mask>`
 * whose `style` declares a `mask-type` gets the matching presentation
 * attribute.
 *
 * The declaration always wins, because that is what a browser does: a
 * presentation attribute is an author-origin rule of specificity 0 that sits
 * before every other author rule, so `style` overrides it. Verified in
 * Chrome. That is why an existing attribute is corrected instead of left
 * alone. A mask carrying both `mask-type="luminance"` and
 * `style="mask-type:alpha"` is `alpha` on screen, and has to be `alpha` for
 * resvg too.
 *
 * The declaration itself is left in place, so nothing that renders correctly
 * now changes. Once resvg reads `mask-type` from `style`, this becomes a
 * no-op and can go, though only in a major, since `normalizeMaskType` is
 * exported.
 */
function normalizeMaskNodes(parsed: XmlNode[]): boolean {
  let changed = false;

  visitElements(parsed, (tagName, node) => {
    if (tagName !== 'mask') {
      return;
    }

    const attributes = node[':@'];

    if (!attributes) {
      return;
    }

    const declared = declaredMaskType(attributes['@_style']);

    if (!declared) {
      return;
    }

    // No attribute and the declaration only restates the default: nothing to do.
    if (declared === 'luminance' && !('@_mask-type' in attributes)) {
      return;
    }

    if (attributes['@_mask-type'] !== declared) {
      attributes['@_mask-type'] = declared;
      changed = true;
    }
  });

  return changed;
}

/**
 * Any `mask-type` CSS declaration. Even `luminance` matters, because it has
 * to win over a presentation attribute that says otherwise. As a substring
 * test it can false-positive (the string may occur in text content), which
 * only costs a tree walk that then changes nothing.
 */
const HAS_MASK_TYPE_DECLARATION = /mask-type\s*:/i;

/**
 * A `clip-path` attribute value referencing a local id, with any of the
 * quote styles the `url()` syntax allows.
 */
const CLIP_PATH_REFERENCE =
  /^url\(\s*(?:'#([^']*)'|"#([^"]*)"|#([^)\s]*))\s*\)$/;

/**
 * Rounded-corner radii of a stripped full-canvas clip, as fractions of the
 * canvas size. The raster pipeline multiplies them by the output dimensions
 * and re-applies the crop after rendering.
 */
export type CornerRadius = {
  rx: number;
  ry: number;
};

/**
 * The numeric value of a geometric attribute, or `undefined` when the
 * attribute is absent or not a plain number (percentages, `auto`, junk).
 */
function attributeNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * The `viewBox` of the root `<svg>`, but only in the origin-anchored form
 * the clip strip can reason about. Any other origin makes the full-canvas
 * comparison meaningless, so it counts as "no viewBox".
 */
function parseViewBox(
  attributes: Record<string, unknown> | undefined,
): { width: number; height: number } | undefined {
  const raw = attributes?.['@_viewBox'];

  if (typeof raw !== 'string') {
    return undefined;
  }

  const parts = raw
    .trim()
    .split(/[\s,]+/)
    .map(attributeNumber);

  if (parts.length !== 4 || parts.some((part) => part === undefined)) {
    return undefined;
  }

  const [minX, minY, width, height] = parts as number[];

  if (minX !== 0 || minY !== 0 || width <= 0 || height <= 0) {
    return undefined;
  }

  return { width, height };
}

/**
 * Reads a `<clipPath>` as a full-canvas rectangle clip: exactly one `<rect>`
 * at the origin covering the whole viewBox, in user space, with nothing
 * (transforms, units, percentages) that could move the crop away from the
 * viewport. Returns its corner radii, or `undefined` when the clip is
 * anything else.
 */
function fullCanvasClip(
  node: XmlNode,
  viewBox: { width: number; height: number },
): { rx: number; ry: number } | undefined {
  const attributes = node[':@'] ?? {};
  const units = attributes['@_clipPathUnits'];

  if (units !== undefined && units !== 'userSpaceOnUse') {
    return undefined;
  }

  // A clip on the clip narrows the crop, and `transform` moves it.
  if ('@_transform' in attributes || '@_clip-path' in attributes) {
    return undefined;
  }

  const children = elementChildren(node['clipPath'] as XmlNode[]);

  if (children.length !== 1 || children[0].tagName !== 'rect') {
    return undefined;
  }

  const rect = children[0].node[':@'] ?? {};

  // `display:none` on a clip shape drops it from the clip, which makes the
  // clip empty rather than full-canvas, and `style` can carry that as well as
  // a transform. Both are rare enough to just disqualify the clip.
  if (
    '@_transform' in rect ||
    '@_clip-path' in rect ||
    '@_display' in rect ||
    '@_style' in rect
  ) {
    return undefined;
  }

  // Every geometric attribute must either be absent or parse cleanly; a
  // present-but-unparsable value (say `rx="50%"`) means the crop is not the
  // one this code would reproduce, so the clip stays.
  const geometry: Record<string, number | undefined> = {};

  for (const name of ['x', 'y', 'width', 'height', 'rx', 'ry']) {
    const value = rect[`@_${name}`];

    if (value === undefined) {
      continue;
    }

    const parsed = attributeNumber(value);

    if (parsed === undefined) {
      return undefined;
    }

    geometry[name] = parsed;
  }

  if ((geometry.x ?? 0) !== 0 || (geometry.y ?? 0) !== 0) {
    return undefined;
  }

  if (geometry.width !== viewBox.width || geometry.height !== viewBox.height) {
    return undefined;
  }

  // The SVG auto rules: a missing radius takes the other one's value.
  const rx = geometry.rx ?? geometry.ry ?? 0;
  const ry = geometry.ry ?? geometry.rx ?? 0;

  if (rx < 0 || ry < 0) {
    return undefined;
  }

  return { rx, ry };
}

/**
 * Removes full-canvas `clip-path` references from the root level of a parsed
 * tree.
 *
 * The resvg version bundled by resvg-js (0.42 line) computes the isolation
 * layer of an opacity group in the wrong coordinate space when the group
 * sits under both a `clip-path` and a large rotation, and silently drops or
 * cuts the group's content (styles with free rotation and translucent
 * layers, such as waves, lose half the image). Current resvg has the fix,
 * but resvg-js pins an old fork, so the converter routes around it: a clip
 * that covers exactly the viewBox crops nothing the viewport does not crop
 * anyway and can be dropped before rasterizing.
 *
 * Only references that provably mean "crop to the canvas" are touched: the
 * root `<svg>` must have an origin-anchored viewBox, the `<clipPath>` must
 * be a plain full-canvas rectangle, and the referencing element must be a
 * direct child of the root without its own transform (a transform would
 * re-anchor the clip away from the viewport). Everything else keeps its
 * clip.
 *
 * A rounded clip is stripped too, and its radii are returned so the caller
 * can re-apply the rounded crop on the raster. When several distinct rounded
 * clips match, none of them is stripped: one returned radius could not
 * represent them all.
 *
 * The emitter this shadows is `Renderer#applyBorderRadius` in
 * `@dicebear/core`, which wraps every avatar in exactly this clip. Should
 * core ever stop emitting it for `borderRadius: 0`, most of this code can
 * go.
 */
function stripFullCanvasClips(
  parsed: XmlNode[],
  svgNode: XmlNode | undefined,
): CornerRadius | undefined {
  if (!svgNode) {
    return undefined;
  }

  const viewBox = parseViewBox(svgNode[':@']);

  if (!viewBox) {
    return undefined;
  }

  // `setSizeAttributes` writes a square viewport. A viewBox of a different
  // aspect is then letterboxed inside it, and the viewport reaches past the
  // viewBox on two sides: the clip does crop content the viewport keeps, and
  // one square corner mask cannot describe the crop either. Leave it alone.
  if (viewBox.width !== viewBox.height) {
    return undefined;
  }

  // Root-level references first: they are cheap to find, and without any
  // there is nothing to do — no full-tree walk.
  const references: Array<{ attributes: Record<string, unknown>; id: string }> =
    [];

  for (const { node } of elementChildren(svgNode['svg'] as XmlNode[])) {
    const attributes = node[':@'];

    if (!attributes || '@_transform' in attributes) {
      continue;
    }

    const reference = attributes['@_clip-path'];

    if (typeof reference !== 'string') {
      continue;
    }

    const match = reference.match(CLIP_PATH_REFERENCE);
    const id = match?.[1] ?? match?.[2] ?? match?.[3];

    if (id !== undefined) {
      references.push({ attributes, id });
    }
  }

  if (references.length === 0) {
    return undefined;
  }

  // Resolve the referenced defs. The walk still covers the whole tree so a
  // duplicated id is caught — that is ambiguous and drops the candidate.
  const wanted = new Set(references.map((entry) => entry.id));
  const clips = new Map<string, { rx: number; ry: number }>();
  const seen = new Set<string>();

  visitElements(parsed, (tagName, node) => {
    if (tagName !== 'clipPath') {
      return;
    }

    const id = node[':@']?.['@_id'];

    if (typeof id !== 'string' || !wanted.has(id)) {
      return;
    }

    if (seen.has(id)) {
      clips.delete(id);
      return;
    }

    seen.add(id);

    const clip = fullCanvasClip(node, viewBox);

    if (clip) {
      clips.set(id, clip);
    }
  });

  let roundedId: string | undefined;
  let roundedMixed = false;
  const roundedAttributes: Array<Record<string, unknown>> = [];

  for (const { attributes, id } of references) {
    const clip = clips.get(id);

    if (!clip) {
      continue;
    }

    if (clip.rx === 0 && clip.ry === 0) {
      delete attributes['@_clip-path'];
      continue;
    }

    if (roundedId !== undefined && roundedId !== id) {
      roundedMixed = true;
      continue;
    }

    roundedId = id;
    roundedAttributes.push(attributes);
  }

  if (roundedId === undefined || roundedMixed) {
    return undefined;
  }

  for (const attributes of roundedAttributes) {
    delete attributes['@_clip-path'];
  }

  const { rx, ry } = clips.get(roundedId)!;

  return { rx: rx / viewBox.width, ry: ry / viewBox.height };
}

/**
 * An edit applied to the parsed tree between parsing and re-emitting.
 * Receives the whole tree plus the already-resolved root `<svg>` node.
 */
type TreePass = (parsed: XmlNode[], svgNode: XmlNode | undefined) => void;

/**
 * Parses the SVG once, sets the size attributes, applies the given passes on
 * the same tree, and re-emits it. Keeping the passes as parameters (instead
 * of flags) leaves this function unaware of the individual fixes, so a
 * caller only pulls in the fixes it actually uses.
 */
function rebuild(svg: string, size: number, passes: TreePass[]): string {
  const parsed: XmlNode[] = xmlRoundTripParser.parse(svg);
  const svgNode = parsed.find((node) => 'svg' in node);

  setSizeAttributes(svgNode, size);

  for (const pass of passes) {
    pass(parsed, svgNode);
  }

  return xmlRoundTripBuilder.build(parsed);
}

/**
 * Re-emits the SVG with explicit `width`/`height` attributes set to the
 * sanitized size, so downstream rasterizers know how large to render.
 */
export function ensureSize(svg: string, size: number = DEFAULT_SIZE) {
  size = sanitizeSize(size);

  return { svg: rebuild(svg, size, []), size };
}

/**
 * One-pass preparation of an SVG for resvg: sets the sanitized
 * `width`/`height`, mirrors `mask-type` style declarations onto the
 * presentation attribute, and strips full-canvas clips that the bundled
 * resvg mishandles (see {@link stripFullCanvasClips}). All edits happen on
 * the same parsed tree, so each raster conversion parses and re-emits the
 * SVG exactly once. Passes are skipped when the raw string cannot contain
 * their target ("clip-path" needs no case folding: XML attribute names are
 * case-sensitive, so differently-cased occurrences would not be acted on
 * anyway).
 *
 * When a stripped clip had rounded corners, `cornerRadius` carries its radii
 * as fractions of the canvas size; the caller has to re-apply the rounded
 * crop to the rendered raster.
 */
export function prepareForResvg(
  svg: string,
  size: number = DEFAULT_SIZE,
): { svg: string; size: number; cornerRadius?: CornerRadius } {
  size = sanitizeSize(size);

  let cornerRadius: CornerRadius | undefined;
  const passes: TreePass[] = [];

  if (HAS_MASK_TYPE_DECLARATION.test(svg)) {
    passes.push((parsed) => normalizeMaskNodes(parsed));
  }

  if (svg.includes('clip-path')) {
    passes.push((parsed, svgNode) => {
      cornerRadius = stripFullCanvasClips(parsed, svgNode);
    });
  }

  return { svg: rebuild(svg, size, passes), size, cornerRadius };
}

/**
 * Brings the `mask-type` presentation attribute in line with a `style`
 * declaration of the same property.
 *
 * Both forms are valid and browsers honor either. resvg reads only the
 * attribute, and it renders every raster format this package produces. Where
 * the attribute disagrees with the declaration, or is missing while the
 * declaration says `alpha`, resvg falls back to the `luminance` default, and
 * a mask whose shape is drawn in black (luminance 0) then hides everything
 * it was meant to reveal. Figma writes the CSS form, so avatar styles
 * exported from it are affected, including official ones. See
 * {@link normalizeMaskNodes} for the precedence rules.
 *
 * Input that needs no change comes back verbatim. That includes input the
 * XML parser rejects: resvg would reject such a document anyway, so the
 * function hands it back unchanged instead of throwing. Only a mask that
 * actually needs fixing triggers a re-emit from the parsed tree, which may
 * normalize formatting details such as quote style or self-closing tags. The
 * rendered image stays the same.
 *
 * `toPng` and friends apply the same fix during their single parser pass
 * (see {@link prepareForResvg}). This standalone form is exported, and
 * documented on the converter page, for callers that drive resvg directly
 * instead of through this package, so they do not have to rediscover the
 * same limitation.
 */
export function normalizeMaskType(svg: string): string {
  if (!HAS_MASK_TYPE_DECLARATION.test(svg)) {
    return svg;
  }

  let parsed: XmlNode[];

  try {
    parsed = xmlRoundTripParser.parse(svg);
  } catch {
    return svg;
  }

  return normalizeMaskNodes(parsed) ? xmlRoundTripBuilder.build(parsed) : svg;
}

/**
 * Returns a non-empty string truncated to {@link MAX_METADATA_LENGTH}, or
 * `undefined` for non-string or empty input.
 */
function sanitizeMetadataValue(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }

  return value.slice(0, MAX_METADATA_LENGTH);
}

/**
 * Extracts the embedded RDF/Dublin Core metadata block from an avatar SVG
 * into a flat {@link Metadata} object. Missing fields become `undefined`.
 */
export function getMetadata(svg: string): Metadata {
  const parser = new XMLParser();
  const xml = parser.parse(svg);

  const rdfDescription = xml.svg.metadata?.['rdf:RDF']?.['rdf:Description'];

  return {
    title: sanitizeMetadataValue(rdfDescription?.['dc:title']),
    source: sanitizeMetadataValue(rdfDescription?.['dc:source']),
    creator: sanitizeMetadataValue(rdfDescription?.['dc:creator']),
    license: sanitizeMetadataValue(rdfDescription?.['dcterms:license']),
    copyright: sanitizeMetadataValue(rdfDescription?.['dc:rights']),
  };
}
