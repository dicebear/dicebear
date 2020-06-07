import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let skinColor = [];

    if (options.get('skin', ['tanned']).includes('tanned')) {
        skinColor.push('Tanned');
    }

    if (options.get('skin', ['yellow']).includes('yellow')) {
        skinColor.push('Yellow');
    }

    if (options.get('skin', ['pale']).includes('pale')) {
        skinColor.push('Pale');
    }

    if (options.get('skin', ['light']).includes('light')) {
        skinColor.push('Light');
    }

    if (options.get('skin', ['brown']).includes('brown')) {
        skinColor.push('Brown');
    }

    if (options.get('skin', ['darkBrown']).includes('darkBrown')) {
        skinColor.push('DarkBrown');
    }

    if (options.get('skin', ['black']).includes('black')) {
        skinColor.push('Black');
    }

    return random.pickone(skinColor);
}
