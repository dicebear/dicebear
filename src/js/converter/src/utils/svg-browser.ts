import { DEFAULT_SIZE, sanitizeSize } from './size.js';
import { HAS_MASK_TYPE_DECLARATION, declaredMaskType } from './mask-type.js';

/**
 * Browser counterparts of the SVG helpers in `svg.ts`, built on the native
 * `DOMParser` and `XMLSerializer` instead of the fast-xml-parser stack. The
 * node helpers pull that stack in because node has no XML machinery of its
 * own; bundled for the browser it made up nine tenths of the package, spent
 * on what the platform already ships. This module must not import anything
 * that is not dependency-free, or the stack comes back.
 */

/**
 * The parsed document, or `undefined` when the input is not well-formed XML.
 * `DOMParser` never throws; it reports failure as a `<parsererror>` element
 * in the returned document.
 */
function parseSvg(svg: string): Document | undefined {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');

  if (doc.getElementsByTagName('parsererror').length > 0) {
    return undefined;
  }

  return doc;
}

/**
 * Re-emits the SVG with explicit `width`/`height` attributes set to the
 * sanitized size, so the `<canvas>` rasterization renders it at a reliable
 * intrinsic size across browsers. The whole document is serialized, so
 * comments outside the root element survive.
 */
export function ensureSize(svg: string, size: number = DEFAULT_SIZE) {
  size = sanitizeSize(size);

  const doc = parseSvg(svg);

  if (!doc) {
    throw new Error('The avatar is not a well-formed SVG document');
  }

  doc.documentElement.setAttribute('width', String(size));
  doc.documentElement.setAttribute('height', String(size));

  return { svg: new XMLSerializer().serializeToString(doc), size };
}

/**
 * Brings the `mask-type` presentation attribute in line with a `style`
 * declaration of the same property, for callers that drive a rasterizer
 * reading only the attribute. Same contract as the node implementation in
 * `svg.ts`, where the precedence rules are documented: input that needs no
 * change, including input the parser rejects, comes back verbatim.
 */
export function normalizeMaskType(svg: string): string {
  if (!HAS_MASK_TYPE_DECLARATION.test(svg)) {
    return svg;
  }

  const doc = parseSvg(svg);

  if (!doc) {
    return svg;
  }

  let changed = false;

  for (const mask of doc.getElementsByTagName('mask')) {
    const declared = declaredMaskType(mask.getAttribute('style'));

    if (!declared) {
      continue;
    }

    // No attribute and the declaration only restates the default: nothing to do.
    if (declared === 'luminance' && !mask.hasAttribute('mask-type')) {
      continue;
    }

    if (mask.getAttribute('mask-type') !== declared) {
      mask.setAttribute('mask-type', declared);
      changed = true;
    }
  }

  return changed ? new XMLSerializer().serializeToString(doc) : svg;
}
