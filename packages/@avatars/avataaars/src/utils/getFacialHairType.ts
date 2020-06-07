import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let facialHairType = [];

    if (options.get('facialHair', ['medium']).includes('medium')) {
        facialHairType.push('BeardMedium');
    }

    if (options.get('facialHair', ['light']).includes('light')) {
        facialHairType.push('BeardLight');
    }

    if (options.get('facialHair', ['majestic']).includes('majestic')) {
        facialHairType.push('BeardMajestic');
    }

    if (options.get('facialHair', ['fancy']).includes('fancy')) {
        facialHairType.push('MoustacheFancy');
    }

    if (options.get('facialHair', ['magnum']).includes('magnum')) {
        facialHairType.push('MoustacheMagnum');
    }

    let pickedFacialHairType = random.pickone(facialHairType);

    if (false === random.bool(options.get('facialHairChance'))) {
        return 'Blank';
    }

    return pickedFacialHairType;
}
