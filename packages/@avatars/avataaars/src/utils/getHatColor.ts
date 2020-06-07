import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let hatColor = [];

    if (options.get('hatColor', ['black']).includes('black')) {
        hatColor.push('black');
    }

    if (options.get('hatColor', ['blue']).includes('blue')) {
        hatColor.push('Blue01', 'Blue02', 'Blue03');
    }

    if (options.get('hatColor', ['gray']).includes('gray')) {
        hatColor.push('Gray01', 'Gray02');
    }

    if (options.get('hatColor', ['heather']).includes('heather')) {
        hatColor.push('Heather');
    }

    if (options.get('hatColor', ['pastel']).includes('pastel')) {
        hatColor.push('PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow');
    }

    if (options.get('hatColor', ['pink']).includes('pink')) {
        hatColor.push('Pink');
    }

    if (options.get('hatColor', ['red']).includes('red')) {
        hatColor.push('Red');
    }

    if (options.get('hatColor', ['white']).includes('white')) {
        hatColor.push('White');
    }

    return random.pickone(hatColor);
}
