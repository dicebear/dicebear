import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let topType = [];

    if (options.get('top', ['longHair']).includes('longHair')) {
        topType.push(
            'LongHairBigHair',
            'LongHairBob',
            'LongHairBun',
            'LongHairCurly',
            'LongHairCurvy',
            'LongHairDreads',
            'LongHairFrida',
            'LongHairFro',
            'LongHairFroBand',
            'LongHairMiaWallace',
            'LongHairNotTooLong',
            'LongHairShavedSides',
            'LongHairStraight',
            'LongHairStraight2',
            'LongHairStraightStrand'
        );
    }

    if (options.get('top', ['shortHair']).includes('shortHair')) {
        topType.push(
            'ShortHairDreads01',
            'ShortHairDreads02',
            'ShortHairFrizzle',
            'ShortHairShaggy',
            'ShortHairShaggyMullet',
            'ShortHairShortCurly',
            'ShortHairShortFlat',
            'ShortHairShortRound',
            'ShortHairShortWaved',
            'ShortHairSides',
            'ShortHairTheCaesar',
            'ShortHairTheCaesarSidePart'
        );
    }

    if (options.get('top', ['eyepatch']).includes('eyepatch')) {
        topType.push('Eyepatch');
    }

    if (options.get('top', ['hat']).includes('hat')) {
        topType.push('Hat', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4');
    }

    if (options.get('top', ['hijab']).includes('hijab')) {
        topType.push('Hijab');
    }

    if (options.get('top', ['turban']).includes('turban')) {
        topType.push('Turban');
    }

    let pickedTopType = random.pickone(topType);

    if (false === random.bool(options.get('topChance'))) {
        return 'NoHair';
    }

    return pickedTopType;
}
