import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-gridy-sprites';
import * as yup from 'yup';

export const options = yup
  .object({
    colorful: yup
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
