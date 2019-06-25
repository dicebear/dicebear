import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-jdenticon-sprites';
import * as yup from 'yup';

export const options = yup
  .object({
    padding: yup
      .number()
      .min(0)
      .max(0.2)
      .meta({
        type: 'switch',
        values: [0, 0.05],
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
    hues: yup.array().of(
      yup
        .number()
        .min(0)
        .max(360)
    ),
    colorLightness: yup
      .array()
      .min(2)
      .max(2)
      .of(
        yup
          .number()
          .min(0)
          .max(100)
      ),
    grayscaleLightness: yup
      .array()
      .min(2)
      .max(2)
      .of(
        yup
          .number()
          .min(0)
          .max(100)
      ),
    colorSaturation: yup
      .number()
      .min(0)
      .max(100),
    grayscaleSaturation: yup
      .number()
      .min(0)
      .max(100)
  })
  .noUnknown();

const handler = createHandler(SpriteCollection, options);

addEventListener('fetch', (event: any) => {
  event.respondWith(handler(event.request));
});
