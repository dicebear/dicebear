import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let hairColor = [];

    if (options.get('hairColor', ['auburn']).includes('auburn')) {
        hairColor.push('Auburn');
    }

    if (options.get('hairColor', ['black']).includes('black')) {
        hairColor.push('Black');
    }

    if (options.get('hairColor', ['blonde']).includes('blonde')) {
        hairColor.push('Blonde', 'BlondeGolden');
    }

    if (options.get('hairColor', ['brown']).includes('brown')) {
        hairColor.push('Brown', 'BrownDark');
    }

    if (options.get('hairColor', ['pastel']).includes('pastel')) {
        hairColor.push('PastelPink');
    }

    if (options.get('hairColor', ['platinum']).includes('platinum')) {
        hairColor.push('Platinum');
    }

    if (options.get('hairColor', ['red']).includes('red')) {
        hairColor.push('Red');
    }

    if (options.get('hairColor', ['gray']).includes('gray')) {
        hairColor.push('SilverGray');
    }

    return random.pickone(hairColor);
}
