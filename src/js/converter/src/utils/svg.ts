import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { Metadata } from '../types';

const MAX_SIZE = 2048;
const DEFAULT_SIZE = 512;
const MAX_METADATA_LENGTH = 1024;

const xmlRoundTripOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  preserveOrder: true,
  commentPropName: '#comment',
  allowBooleanAttributes: true,
  processEntities: false,
};

const xmlRoundTripParser = new XMLParser(xmlRoundTripOptions);
const xmlRoundTripBuilder = new XMLBuilder(xmlRoundTripOptions);

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
 * Re-emits the SVG with explicit `width`/`height` attributes set to the
 * sanitized size, so downstream rasterizers know how large to render.
 */
export function ensureSize(svg: string, size: number = DEFAULT_SIZE) {
  size = sanitizeSize(size);

  const parsed = xmlRoundTripParser.parse(svg);
  const svgNode = parsed.find((node: Record<string, unknown>) => 'svg' in node);

  if (svgNode) {
    svgNode[':@'] ??= {};
    svgNode[':@']['@_width'] = String(size);
    svgNode[':@']['@_height'] = String(size);
  }

  svg = xmlRoundTripBuilder.build(parsed);

  return { svg, size };
}

/**
 * A `<mask>` open tag. A `>` inside a quoted attribute value must not end the
 * match, or a rewrite would land inside that value. A raw `<` outside quotes
 * is invalid inside a tag, so bailing on it keeps a run of unterminated
 * `<mask` tokens from costing a forward scan each. On 128 KB of them that is
 * the difference between 2.3 seconds and a fraction of a millisecond, and this
 * runs on every raster conversion, including for caller-supplied SVG.
 */
const MASK_OPEN_TAG = /<mask\b(?:[^<>"']|"[^"]*"|'[^']*')*>/g;

/**
 * Any `mask-type` CSS declaration. Even `luminance` matters, because it has to
 * win over a presentation attribute that says otherwise.
 */
const HAS_MASK_TYPE_DECLARATION = /mask-type\s*:/i;

/** One `name="value"` pair, consuming the value whole so quotes cannot confuse it. */
const ATTRIBUTE = /([^\s=/>]+)\s*=\s*("[^"]*"|'[^']*'|[^\s/>]+)/g;

/** Reads an attribute off an open tag, case-insensitively, unquoted. */
function readAttribute(
  tag: string,
  name: string,
): { value: string; start: number; end: number } | undefined {
  ATTRIBUTE.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = ATTRIBUTE.exec(tag)) !== null) {
    if (match[1].toLowerCase() !== name) {
      continue;
    }

    const raw = match[2];
    const quoted = raw.startsWith('"') || raw.startsWith("'");

    return {
      value: quoted ? raw.slice(1, -1) : raw,
      start: match.index,
      end: match.index + match[0].length,
    };
  }

  return undefined;
}

/**
 * Brings the `mask-type` presentation attribute in line with a `style`
 * declaration of the same property.
 *
 * Both forms are valid and browsers honor either. resvg reads only the
 * attribute, and it renders every raster format this package produces. Where
 * the attribute disagrees with the declaration, or is missing while the
 * declaration says `alpha`, resvg falls back to the `luminance` default, and a
 * mask whose shape is drawn in black (luminance 0) then hides everything it
 * was meant to reveal. Figma writes the CSS form, so avatar styles
 * exported from it are affected: seven of the official ones ship such masks
 * today.
 *
 * The declaration always wins, because that is what a browser does: a
 * presentation attribute is an author-origin rule of specificity 0 that sits
 * before every other author rule, so `style` overrides it. Verified in Chrome.
 * That is why an existing attribute is corrected instead of left alone. A mask
 * carrying both `mask-type="luminance"` and `style="mask-type:alpha"` is
 * `alpha` on screen, and has to be `alpha` for resvg too.
 *
 * CSS keywords are case-insensitive while SVG attribute values are not, so a
 * declared `Alpha` is mirrored as `alpha`; copied verbatim it would be
 * rejected by resvg and silently fall back to the default.
 *
 * The declaration itself is left in place, so nothing that renders correctly
 * now changes. Once resvg reads `mask-type` from `style`, this becomes a no-op
 * and can go, though only in a major, since it is exported.
 *
 * Editing the markup rather than round-tripping it through the XML parser is
 * deliberate. This runs on every raster conversion, and therefore on every
 * HTTP API request: the parse cost is 10-16% of a `toPng` call for the styles
 * that carry masks, against 0.05-0.5% here. It is also more faithful. A round trip
 * reformats unrelated markup, expanding `<use href="#a"/>` to `<use href="#a">
 * </use>`, which contradicts the promise above of only touching what resvg
 * needs. Output was compared against the parser-based form across every
 * packaged style at 45 seeds each, with no differences. (The precedence rule
 * above is the one deliberate departure from it.)
 *
 * `toPng` and friends apply this themselves. It is exported, and documented on
 * the converter page, for callers that drive resvg directly instead of through
 * this package, so they do not have to rediscover the same limitation.
 */
export function normalizeMaskType(svg: string): string {
  if (!HAS_MASK_TYPE_DECLARATION.test(svg)) {
    return svg;
  }

  return svg.replace(MASK_OPEN_TAG, (tag) => {
    const style = readAttribute(tag, 'style');
    const declared = style?.value
      .match(/(?:^|;)\s*mask-type\s*:\s*([\w-]+)/i)?.[1]
      ?.toLowerCase();

    if (!declared) {
      return tag;
    }

    const attribute = readAttribute(tag, 'mask-type');

    if (attribute) {
      return attribute.value.toLowerCase() === declared
        ? tag
        : tag.slice(0, attribute.start) +
            `mask-type="${declared}"` +
            tag.slice(attribute.end);
    }

    // No attribute and the declaration only restates the default: nothing to do.
    if (declared === 'luminance') {
      return tag;
    }

    return tag.replace(
      /\s*\/?>$/,
      (close) => ` mask-type="${declared}"${close.trim()}`,
    );
  });
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
