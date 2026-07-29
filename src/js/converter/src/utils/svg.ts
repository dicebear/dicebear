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
 * Sets `width`/`height` on the root `<svg>` of a parsed tree, so downstream
 * rasterizers know how large to render.
 */
function setSizeAttributes(parsed: XmlNode[], size: number): void {
  const svgNode = parsed.find((node) => 'svg' in node);

  if (svgNode) {
    const attributes = (svgNode[':@'] ??= {});

    attributes['@_width'] = String(size);
    attributes['@_height'] = String(size);
  }
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
    for (const [key, children] of Object.entries(node)) {
      if (key === ':@' || key.startsWith('#') || !Array.isArray(children)) {
        continue;
      }

      visit(key, node);
      visitElements(children, visit);
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
 * Parses the SVG once, sets the size attributes, optionally applies the
 * mask fix on the same tree, and re-emits it.
 */
function rebuild(svg: string, size: number, normalizeMasks: boolean): string {
  const parsed: XmlNode[] = xmlRoundTripParser.parse(svg);

  setSizeAttributes(parsed, size);

  if (normalizeMasks) {
    normalizeMaskNodes(parsed);
  }

  return xmlRoundTripBuilder.build(parsed);
}

/**
 * Re-emits the SVG with explicit `width`/`height` attributes set to the
 * sanitized size, so downstream rasterizers know how large to render.
 */
export function ensureSize(svg: string, size: number = DEFAULT_SIZE) {
  size = sanitizeSize(size);

  return { svg: rebuild(svg, size, false), size };
}

/**
 * One-pass preparation of an SVG for resvg: sets the sanitized
 * `width`/`height` and mirrors `mask-type` style declarations onto the
 * presentation attribute. Both edits happen on the same parsed tree, so each
 * raster conversion parses and re-emits the SVG exactly once. The function
 * skips the mask walk when the raw string contains no `mask-type`
 * declaration.
 */
export function prepareForResvg(
  svg: string,
  size: number = DEFAULT_SIZE,
): { svg: string; size: number } {
  size = sanitizeSize(size);

  return {
    svg: rebuild(svg, size, HAS_MASK_TYPE_DECLARATION.test(svg)),
    size,
  };
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
