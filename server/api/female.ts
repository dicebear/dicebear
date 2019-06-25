import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-female-sprites';
import * as yup from 'yup';

let values: Array<any> = [];

export const options = yup
  .object({
    mood: yup
      .array()
      .of(yup.string().oneOf((values = ['happy', 'sad', 'surprised'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      })
  })
  .noUnknown();

const handler = createHandler(SpriteCollection, options);

addEventListener('fetch', (event: any) => {
  event.respondWith(handler(event.request));
});
