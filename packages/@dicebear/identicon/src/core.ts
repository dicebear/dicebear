import type { Style } from '@dicebear/core';
import type { Options } from './options';
import type { ComponentPickCollection, ColorPickCollection } from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Identicon',
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const row1Component = pickComponent(prng, 'row1', options.row1);
    const row2Component = pickComponent(prng, 'row2', options.row2);
    const row3Component = pickComponent(prng, 'row3', options.row3);
    const row4Component = pickComponent(prng, 'row4', options.row4);
    const row5Component = pickComponent(prng, 'row5', options.row5);

    const components: ComponentPickCollection = {
      row1: prng.bool(options.row1Probability) ? row1Component : undefined,
      row2: prng.bool(options.row2Probability) ? row2Component : undefined,
      row3: prng.bool(options.row3Probability) ? row3Component : undefined,
      row4: prng.bool(options.row4Probability) ? row4Component : undefined,
      row5: prng.bool(options.row5Probability) ? row5Component : undefined,
    };

    const colors: ColorPickCollection = {
      row: pickColor(prng, 'row', options.rowColor ?? []),
    };

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 5 5',
        fill: 'none',
        'shape-rendering': 'crispEdges',
      },
      body: `
  ${components.row1?.value(components, colors) ?? ''}
  ${components.row2?.value(components, colors) ?? ''}
  ${components.row3?.value(components, colors) ?? ''}
  ${components.row4?.value(components, colors) ?? ''}
  ${components.row5?.value(components, colors) ?? ''}
`,
    };
  },
};
