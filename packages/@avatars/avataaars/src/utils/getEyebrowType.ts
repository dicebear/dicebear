import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let eyebrowType = [];

    if (options.get('eyebrow', ['angry']).includes('angry')) {
        eyebrowType.push('Angry', 'AngryNatural');
    }

    if (options.get('eyebrow', ['default']).includes('default')) {
        eyebrowType.push('Default', 'DefaultNatural');
    }

    if (options.get('eyebrow', ['flat']).includes('flat')) {
        eyebrowType.push('FlatNatural');
    }

    if (options.get('eyebrow', ['raised']).includes('raised')) {
        eyebrowType.push('RaisedExcited', 'RaisedExcitedNatural');
    }

    if (options.get('eyebrow', ['sad']).includes('sad')) {
        eyebrowType.push('SadConcerned', 'SadConcernedNatural');
    }

    if (options.get('eyebrow', ['unibrow']).includes('unibrow')) {
        eyebrowType.push('UnibrowNatural');
    }

    if (options.get('eyebrow', ['up']).includes('up')) {
        eyebrowType.push('UpDown', 'UpDownNatural');
    }

    return random.pickone(eyebrowType);
}
