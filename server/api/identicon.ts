import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-identicon-sprites';
import * as yup from 'yup';

let values: Array<any> = [];

export const options = yup
  .object({
    padding: yup
      .number()
      .min(0)
      .max(1)
      .meta({
        type: 'switch',
        values: [0, 0.4],
        defaultValue: 0
      }),
    background: yup
      .string()
      .matches(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
      .meta({
        type: 'switch',
        values: ['#fff', '#f0f0f0'],
        defaultValue: '#fff'
      }),
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
    colorLevel: yup
      .number()
      .oneOf((values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]))
      .meta({
        type: 'select',
        values: values,
        defaultValue: 600
      })
  })
  .noUnknown();

const handler = createHandler(SpriteCollection, options);

addEventListener('fetch', (event: any) => {
  event.respondWith(handler(event.request));
});
