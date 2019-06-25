import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-initials-sprites';
import * as yup from 'yup';

let values: Array<any> = [];

export const options = yup
  .object({
    backgroundColors: yup
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
    backgroundColorLevel: yup
      .number()
      .oneOf((values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]))
      .meta({
        type: 'select',
        values: values,
        defaultValue: 600
      }),
    fontSize: yup
      .number()
      .min(1)
      .max(100)
      .meta({
        type: 'range',
        values: [1, 100],
        defaultValue: 50
      }),
    chars: yup
      .number()
      .min(0)
      .max(2)
      .meta({
        type: 'range',
        values: [0, 2],
        defaultValue: 2
      }),
    bold: yup
      .number()
      .oneOf([0, 1])
      .meta({
        type: 'switch',
        values: [0, 1],
        defaultValue: 0
      })
  })
  .noUnknown();

const handler = createHandler(SpriteCollection, options);

addEventListener('fetch', (event: any) => {
  event.respondWith(handler(event.request));
});
