import { SpriteCollection, StyleOptions, utils } from "@dicebear/avatars";
import { style } from './core';
import type { Options } from './options';

/** @deprecated will be removed in Version 5.0 */
export const legacyStyle: SpriteCollection<Options> = (random, options) => {
    let result = style.create({
        prng: utils.prng.create(random.seed),
        options: options as StyleOptions<Options>
    })

    return `
        <svg ${utils.svg.createAttrString(result.attributes)}>
            ${utils.svg.getMetadata(style)}
            ${result.head ?? ''}
            ${result.body}
        </svg>
    `;
}
