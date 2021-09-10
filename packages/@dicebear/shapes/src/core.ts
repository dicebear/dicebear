import type { Style } from '@dicebear/core';
import type { Options } from './options';
import type {
  ComponentPickCollection,
  ColorPickCollection,
} from './static-types';

import { schema } from './schema';
import { pickComponent } from './utils/pickComponent';
import { pickColor } from './utils/pickColor';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';

export const style: Style<Options> = {
  meta: {
    title: 'Jdenticon',
    creator: 'Daniel Mester Pirttijärvi',
    contributor: 'Daniel Mester Pirttijärvi',
    source: 'https://github.com/dmester/jdenticon',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/main/packages/%40dicebear/shapes/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options });

    const centerModifierComponent = pickComponent(
      prng,
      'centerModifier',
      options.centerModifier
    );
    const cornersModifierComponent = pickComponent(
      prng,
      'cornersModifier',
      options.cornersModifier
    );
    const sidesModifierComponent = pickComponent(
      prng,
      'sidesModifier',
      options.sidesModifier
    );
    const sidesWrapperComponent = pickComponent(
      prng,
      'sidesWrapper',
      options.sidesWrapper
    );
    const sidesComponent = pickComponent(prng, 'sides', options.sides);
    const cornersWrapperComponent = pickComponent(
      prng,
      'cornersWrapper',
      options.cornersWrapper
    );
    const cornersComponent = pickComponent(prng, 'corners', options.corners);
    const centerWrapperComponent = pickComponent(
      prng,
      'centerWrapper',
      options.centerWrapper
    );
    const centerComponent = pickComponent(prng, 'center', options.center);

    const components: ComponentPickCollection = {
      centerModifier: centerModifierComponent,
      cornersModifier: cornersModifierComponent,
      sidesModifier: sidesModifierComponent,
      sidesWrapper: sidesWrapperComponent,
      sides: sidesComponent,
      cornersWrapper: cornersWrapperComponent,
      corners: cornersComponent,
      centerWrapper: centerWrapperComponent,
      center: centerComponent,
    };

    const colors: ColorPickCollection = {
      base: pickColor(prng, 'base', options.baseColor ?? []),
    };

    onPostCreate({ prng, options, components, colors });

    return {
      attributes: {
        viewBox: '0 0 48 48',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  ${components.centerModifier?.value(components, colors) ?? ''}
  ${components.cornersModifier?.value(components, colors) ?? ''}
  ${components.sidesModifier?.value(components, colors) ?? ''}
`,
    };
  },
};
