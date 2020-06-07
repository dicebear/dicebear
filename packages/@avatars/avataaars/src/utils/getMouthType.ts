import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let mouthType = [];

    if (options.get('mouth', ['concerned']).includes('concerned')) {
        mouthType.push('Concerned');
    }

    if (options.get('mouth', ['default']).includes('default')) {
        mouthType.push('Default');
    }

    if (options.get('mouth', ['disbelief']).includes('disbelief')) {
        mouthType.push('Disbelief');
    }

    if (options.get('mouth', ['eating']).includes('eating')) {
        mouthType.push('Eating');
    }

    if (options.get('mouth', ['grimace']).includes('grimace')) {
        mouthType.push('Grimace');
    }

    if (options.get('mouth', ['sad']).includes('sad')) {
        mouthType.push('Sad');
    }

    if (options.get('mouth', ['scream']).includes('scream')) {
        mouthType.push('ScreamOpen');
    }

    if (options.get('mouth', ['serious']).includes('serious')) {
        mouthType.push('Serious');
    }

    if (options.get('mouth', ['smile']).includes('smile')) {
        mouthType.push('Smile');
    }

    if (options.get('mouth', ['tongue']).includes('tongue')) {
        mouthType.push('Tongue');
    }

    if (options.get('mouth', ['twinkle']).includes('twinkle')) {
        mouthType.push('Twinkle');
    }

    if (options.get('mouth', ['vomit']).includes('vomit')) {
        mouthType.push('Vomit');
    }

    return random.pickone(mouthType);
}
