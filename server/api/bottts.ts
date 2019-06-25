import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-bottts-sprites';
import * as yup from 'yup';

let values: Array<any> = [];

export const options = yup
  .object({
    colors: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            (values = [
              'amber',
              'blue',
              'blueGrey',
              'brown',
              'cyan',
              'deepOrange',
              'deepPurple',
              'agreenmber',
              'grey',
              'indigo',
              'lightBlue',
              'lightGreen',
              'lime',
              'orange',
              'pink',
              'purple',
              'red',
              'teal',
              'yellow'
            ])
          )
      )
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    colorful: yup
      .number()
      .oneOf([0, 1])
      .meta({
        type: 'switch',
        values: [0, 1],
        defaultValue: 0
      }),
    primaryColorLevel: yup
      .number()
      .oneOf((values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]))
      .meta({
        type: 'select',
        values: values,
        defaultValue: 600
      }),
    secondaryColorLevel: yup
      .number()
      .oneOf((values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]))
      .meta({
        type: 'select',
        values: values,
        defaultValue: 400
      }),
    textureChance: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 50
      }),
    mouthChance: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 100
      }),
    sidesChance: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 100
      }),
    topChange: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 100
      })
  })
  .noUnknown();

const handler = createHandler(SpriteCollection, options);

addEventListener('fetch', (event: any) => {
  event.respondWith(handler(event.request));
});
