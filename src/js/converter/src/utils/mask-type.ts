/**
 * Any `mask-type` CSS declaration. Even `luminance` matters, because it has
 * to win over a presentation attribute that says otherwise. As a substring
 * test it can false-positive (the string may occur in text content), which
 * only costs a parse that then changes nothing.
 */
export const HAS_MASK_TYPE_DECLARATION = /mask-type\s*:/i;

/**
 * The value of the last `mask-type` declaration in a `style` attribute. The
 * last one wins, as it does in CSS. The value comes back lowercased: CSS
 * keywords are case-insensitive while SVG attribute values are not, and
 * resvg would reject a verbatim `Alpha` and silently fall back to the
 * default.
 */
export function declaredMaskType(style: unknown): string | undefined {
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
