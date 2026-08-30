import type { INode } from 'svgson';

import type { DefinitionElement } from './definition.js';
import { colorRef, componentHref, variableRef } from './naming.js';

/**
 * Converts a definition element tree into an svgson tree, ready for svgson's
 * `stringify`.
 *
 * The three object-valued shapes a definition can hold become plain strings, so
 * svgo sees ordinary SVG:
 *
 *  - `{ type: 'color', name }` attribute values -> `url(#color-name)`
 *  - `{ type: 'variable', name }` values        -> `var(#variable-name)`
 *  - `{ type: 'component', name }` elements     -> `<use href="#component-name"/>`
 *  - `animations` timelines                     -> a `data-dbanim` attribute
 *
 * {@link svgsonToDefinition} is the exact inverse.
 */
export function definitionToSvgson(
  element: DefinitionElement,
  index = 0,
): INode {
  const attributes: Record<string, string> = {};

  for (const [key, value] of Object.entries(element.attributes ?? {})) {
    if (typeof value === 'string') {
      attributes[key] = value;
    } else if (value.type === 'color') {
      attributes[key] = colorRef(value.name);
    } else {
      attributes[key] = variableRef(value.name);
    }
  }

  if (element.animations !== undefined) {
    // URI-encoded so svgo's numeric and transform rewrites can never touch the
    // payload. The sibling index prefix keeps identically-animated sibling
    // paths distinguishable, or `mergePaths` would fuse them into one element
    // and silently halve the animation. The decoder strips it again.
    attributes['data-dbanim'] =
      `${index}:${encodeURIComponent(JSON.stringify(element.animations))}`;
  }

  const children = (element.children ?? []).map(definitionToSvgson);

  // A component reference becomes `<use href="#component-name" ...>`. The href
  // comes first so an authored `transform` keeps its place among the rest.
  if (element.type === 'component') {
    return {
      name: 'use',
      type: 'element',
      value: '',
      attributes: { href: componentHref(element.name ?? ''), ...attributes },
      children,
    };
  }

  let value = '';

  if (typeof element.value === 'string') {
    value = element.value;
  } else if (element.value) {
    value = variableRef(element.value.name);
  }

  return {
    name: element.name ?? '',
    type: element.type,
    value,
    attributes,
    children,
  };
}
