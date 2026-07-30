/**
 * Naming conventions for the svgson <-> definition mapping.
 *
 * A definition stores color references, component references and dynamic values
 * as objects, which svgo cannot see. Both directions encode them as ordinary
 * SVG strings instead, so every "magic string" pattern lives in this one file
 * and the two directions cannot drift apart.
 *
 * Ported from `naming.ts` in the DiceBear Studio, minus the Figma layer-name
 * helpers, which have no meaning here.
 */

/** The character class allowed in a color, component or variable name. */
const NAME_CHARS = '[a-zA-Z0-9-]+';

const COLOR_REF_RE = new RegExp(`^url\\(#color-(${NAME_CHARS})\\)$`);
const COMPONENT_HREF_RE = new RegExp(`^#component-(${NAME_CHARS})$`);
const VARIABLE_REF_RE = new RegExp(`^var\\(#variable-(${NAME_CHARS})\\)$`);

/**
 * Serializes a color reference into an SVG attribute value, e.g.
 * `colorRef('skin')` -> `url(#color-skin)`.
 */
export function colorRef(name: string): string {
  return `url(#color-${name})`;
}

/**
 * Parses a `url(#color-X)` attribute value back into the color name, or `null`
 * when the value is not a color reference.
 */
export function parseColorRef(value: string): string | null {
  const match = value.match(COLOR_REF_RE);

  return match ? match[1] : null;
}

/**
 * Serializes a component reference into the `<use href>` value, e.g.
 * `componentHref('eyes')` -> `#component-eyes`.
 */
export function componentHref(name: string): string {
  return `#component-${name}`;
}

/**
 * Parses a `#component-X` href back into the component name, or `null` when the
 * href is not a component reference.
 */
export function parseComponentHref(href: string): string | null {
  const match = href.match(COMPONENT_HREF_RE);

  return match ? match[1] : null;
}

/**
 * Serializes a dynamic-value reference, e.g. `variableRef('initials')` ->
 * `var(#variable-initials)`. Used for text content and for the `font-family` /
 * `font-weight` attributes.
 */
export function variableRef(name: string): string {
  return `var(#variable-${name})`;
}

/**
 * Parses a `var(#variable-X)` value back into the variable name, or `null` when
 * the value is not a variable reference.
 */
export function parseVariableRef(value: string): string | null {
  const match = value.match(VARIABLE_REF_RE);

  return match ? match[1] : null;
}
