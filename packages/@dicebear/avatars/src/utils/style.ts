import type { Style, StyleOptions } from '../types';
import { SpriteCollection } from '../core.legacy';
import * as prng from './prng';
import * as svg from './svg';
import { merge as mergeOptions } from './options';

export function createLegacyWrapper<O extends {}>(style: Style<O>): SpriteCollection<O> {
  return (random, options) => {
    options = Object.assign(options, mergeOptions(style, options as StyleOptions<O>));

    let result = style.create({
      prng: prng.create(random.seed),
      options: options as StyleOptions<O>,
    });

    return `
        <svg ${svg.createAttrString(result.attributes)}>
            ${svg.getMetadata(style)}
            ${result.head ?? ''}
            ${result.body}
        </svg>
    `;
  };
}
