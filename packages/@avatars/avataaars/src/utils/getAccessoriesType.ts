import type { Random } from '@avatars/core';
import type Options from '../options';

export default function (options: Options, random: Random) {
    let accessoriesType = [];

    if (options.get('accessories', ['kurt']).includes('kurt')) {
        accessoriesType.push('Kurt');
    }

    if (options.get('accessories', ['prescription01']).includes('prescription01')) {
        accessoriesType.push('Prescription01');
    }

    if (options.get('accessories', ['prescription02']).includes('prescription02')) {
        accessoriesType.push('Prescription02');
    }

    if (options.get('accessories', ['round']).includes('round')) {
        accessoriesType.push('Round');
    }

    if (options.get('accessories', ['sunglasses']).includes('sunglasses')) {
        accessoriesType.push('Sunglasses');
    }

    if (options.get('accessories', ['wayfarers']).includes('wayfarers')) {
        accessoriesType.push('Wayfarers');
    }

    let pickedAccessoriesType = random.pickone(accessoriesType);

    if (false === random.bool(options.get('accessoriesChance'))) {
        return 'Blank';
    }

    return pickedAccessoriesType;
}
