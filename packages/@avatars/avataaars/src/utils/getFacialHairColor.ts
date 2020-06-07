import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let facialHairColor = [];

    if (options.get('facialHairColor', ['auburn']).includes('auburn')) {
        facialHairColor.push('Auburn');
    }

    if (options.get('facialHairColor', ['black']).includes('black')) {
        facialHairColor.push('Black');
    }

    if (options.get('facialHairColor', ['blonde']).includes('blonde')) {
        facialHairColor.push('Blonde', 'BlondeGolden');
    }

    if (options.get('facialHairColor', ['brown']).includes('brown')) {
        facialHairColor.push('Brown', 'BrownDark');
    }

    if (options.get('facialHairColor', ['platinum']).includes('platinum')) {
        facialHairColor.push('Platinum');
    }

    if (options.get('facialHairColor', ['red']).includes('red')) {
        facialHairColor.push('Red');
    }

    return random.pickone(facialHairColor);
}
