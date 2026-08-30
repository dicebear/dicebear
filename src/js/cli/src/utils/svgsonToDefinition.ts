import type { INode } from 'svgson';

import type {
  DefinitionAttributeValue,
  DefinitionElement,
} from './definition.js';
import {
  parseColorRef,
  parseComponentHref,
  parseVariableRef,
} from './naming.js';

/**
 * Converts an svgson tree back into a definition element tree, the exact
 * inverse of {@link definitionToSvgson}.
 *
 * Keys are written in the order the committed definition files already use
 * (`name`, `type`, `attributes`, `children` for elements; `type`, `value` for
 * text), and empty `attributes` / `children` are omitted, so re-serializing an
 * untouched tree reproduces the original bytes.
 *
 * Unlike the Studio's importer this does not collapse a transform-only `<g>`
 * around a component reference. That rewrite belongs to the Figma import path,
 * and here it would make the round-trip lossy.
 */
export function svgsonToDefinition(node: INode): DefinitionElement {
  if (node.type === 'text') {
    const variableName = parseVariableRef(node.value);

    return {
      type: 'text',
      value: variableName
        ? { type: 'variable', name: variableName }
        : node.value,
    };
  }

  if (node.type !== 'element') {
    throw new Error(`Unsupported SVG node type "${node.type}".`);
  }

  const attributes: Record<string, DefinitionAttributeValue> = {};

  for (const [key, value] of Object.entries(node.attributes ?? {})) {
    const colorName = parseColorRef(value);

    if (colorName) {
      attributes[key] = { type: 'color', name: colorName };
      continue;
    }

    const variableName = parseVariableRef(value);

    attributes[key] = variableName
      ? { type: 'variable', name: variableName }
      : value;
  }

  // The `data-dbanim` carrier attribute becomes the `animations` member
  // again. The sibling-index prefix in front of the payload is dropped.
  let animations: unknown[] | undefined;
  const rawAnimations = attributes['data-dbanim'];

  if (typeof rawAnimations === 'string') {
    delete attributes['data-dbanim'];

    animations = JSON.parse(
      decodeURIComponent(rawAnimations.slice(rawAnimations.indexOf(':') + 1)),
    ) as unknown[];
  }

  const children = (node.children ?? []).map(svgsonToDefinition);

  // `<use href="#component-X">` is a component reference, not an SVG element.
  if (node.name === 'use') {
    const href = node.attributes?.href;
    const componentName =
      typeof href === 'string' ? parseComponentHref(href) : null;

    if (componentName) {
      delete attributes.href;

      const result: DefinitionElement = {
        name: componentName,
        type: 'component',
      };

      if (Object.keys(attributes).length > 0) {
        result.attributes = attributes;
      }

      if (animations) {
        result.animations = animations;
      }

      return result;
    }
  }

  const result: DefinitionElement = { name: node.name, type: 'element' };

  if (Object.keys(attributes).length > 0) {
    result.attributes = attributes;
  }

  if (animations) {
    result.animations = animations;
  }

  if (children.length > 0) {
    result.children = children;
  }

  return result;
}
