import type { Style, StyleSchema } from '@dicebear/core';
import type { Options } from './options';

import schema from './schema.json';
import { getComponents } from './utils/getComponents';
import { getColors } from './utils/getColors';
import { onPreCreate } from './hooks/onPreCreate';
import { onPostCreate } from './hooks/onPostCreate';
import { dimensions } from './meta/components';

export const style: Style<Options> = {
  meta: {
    title: 'Face Generator',
    creator: 'The Visual Team',
    source: 'https://www.figma.com/community/file/986078800058673824',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    onPreCreate({ prng, options, preview: false });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: false });

    options.backgroundColor = [colors.background.value];

    return {
      attributes: {
        viewBox: '0 0 210 210',
        fill: 'none',
        'shape-rendering': 'auto',
      },
      body: `
  <path d="M129.141 158.999c0 12.298-9.97 22.268-22.268 22.268s-22.268-9.97-22.268-22.268 9.97-22.268 22.268-22.268 22.268 9.97 22.268 22.268Z" fill="#DE8383"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M90.225 173.819c4.065-5.38 10.515-8.857 17.778-8.857 6.607 0 12.542 2.878 16.62 7.448-4.065 5.38-10.515 8.857-17.778 8.857-6.607 0-12.542-2.878-16.62-7.448Z" fill="#C06E6E"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M127.423 150.069H86.524c3.45-7.853 11.307-13.338 20.449-13.338 9.143 0 17.001 5.485 20.45 13.338Z" fill="#F9F9F9"/>
  <path d="M130.217 48.903c2.664-2.095 6.764-6.286 14.759-6.286 6.793 0 12.505 4.61 13.53 6.286M50.42 48.903c2.665-2.095 6.765-6.286 14.76-6.286 6.792 0 12.504 4.61 13.53 6.286" stroke="#000" stroke-width="2.642" stroke-linecap="round"/>
  <circle cx="65.545" cy="76.218" r="20.431" fill="#fff"/>
  <circle cx="144.756" cy="76.218" r="20.431" fill="#fff"/>
  <circle cx="65.545" cy="76.218" r="11.001" fill="#000"/>
  <circle cx="144.756" cy="76.218" r="11.001" fill="#000"/>
  <g fill="#000" fill-opacity=".19">
    <rect x="38.647" y="116.831" width="9.24" height="9.24" rx="4.62"/>
    <rect x="55.972" y="106.436" width="9.24" height="10.396" rx="4.62"/>
    <rect x="69.833" y="116.831" width="9.24" height="9.24" rx="4.62"/>
    <rect x="134.517" y="116.831" width="9.24" height="9.24" rx="4.62"/>
    <rect x="151.842" y="106.436" width="9.24" height="10.396" rx="4.62"/>
    <rect x="165.703" y="116.831" width="9.24" height="9.24" rx="4.62"/>
  </g>
  <path fill-rule="evenodd" clip-rule="evenodd" d="m98.012 108.119-.179 1.87c-.592 6.185 4.271 11.537 10.485 11.537 6.346 0 11.251-5.572 10.448-11.867l-.177-1.382c-1.06 4.632-5.207 8.18-10.271 8.18-5.108 0-9.303-3.615-10.306-8.338Z" fill="#000" fill-opacity=".19"/>
`,
    };
  },
  preview: ({ prng, options, property }) => {
    const componentGroup = property.toString();
    const colorGroup = property.toString().replace(/Color$/, '');

    onPreCreate({ prng, options, preview: true });

    const components = getComponents({ prng, options });
    const colors = getColors({ prng, options });

    onPostCreate({ prng, options, components, colors, preview: true });

    if (componentGroup in components) {
      const { width, height } = dimensions[componentGroup]!;

      return {
        attributes: {
          viewBox: `0 0 ${width} ${height}`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: components[componentGroup]?.value(components, colors) ?? '',
      };
    }

    if (colorGroup in colors) {
      return {
        attributes: {
          viewBox: `0 0 1 1`,
          fill: 'none',
          'shape-rendering': 'auto',
        },
        body: `<rect width="1" height="1" fill="${colors[colorGroup].value}" />`,
      };
    }

    return undefined;
  },
};
