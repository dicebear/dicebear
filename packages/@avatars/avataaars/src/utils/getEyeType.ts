import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let eyeType = [];

    if (options.get('eyes', ['close']).includes('close')) {
        eyeType.push('Close');
    }

    if (options.get('eyes', ['cry']).includes('cry')) {
        eyeType.push('Cry');
    }

    if (options.get('eyes', ['default']).includes('default')) {
        eyeType.push('Default');
    }

    if (options.get('eyes', ['dizzy']).includes('dizzy')) {
        eyeType.push('Dizzy');
    }

    if (options.get('eyes', ['roll']).includes('roll')) {
        eyeType.push('EyeRoll');
    }

    if (options.get('eyes', ['happy']).includes('happy')) {
        eyeType.push('Happy');
    }

    if (options.get('eyes', ['hearts']).includes('hearts')) {
        eyeType.push('Hearts');
    }

    if (options.get('eyes', ['side']).includes('side')) {
        eyeType.push('Side');
    }

    if (options.get('eyes', ['squint']).includes('squint')) {
        eyeType.push('Squint');
    }

    if (options.get('eyes', ['surprised']).includes('surprised')) {
        eyeType.push('Surprised');
    }

    if (options.get('eyes', ['wink']).includes('wink')) {
        eyeType.push('Wink');
    }

    if (options.get('eyes', ['winkWacky']).includes('winkWacky')) {
        eyeType.push('WinkWacky');
    }

    return random.pickone(eyeType);
}
