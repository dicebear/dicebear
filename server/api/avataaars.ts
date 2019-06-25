import { createHandler } from '../api';
import SpriteCollection from '@dicebear/avatars-avataaars-sprites';
import * as yup from 'yup';

let values: Array<any> = [];

export const options = yup
  .object({
    style: yup
      .string()
      .oneOf((values = ['transparent', 'circle']))
      .meta({
        type: 'select',
        values: values,
        defaultValue: values[0]
      }),
    mode: yup
      .string()
      .oneOf((values = ['include', 'exclude']))
      .meta({
        type: 'select',
        values: values,
        defaultValue: values[0]
      }),
    top: yup
      .array()
      .of(yup.string().oneOf((values = ['longHair', 'shortHair', 'eyepatch', 'hat', 'hijab', 'turban'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    topChance: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 90
      }),
    hatColor: yup
      .array()
      .of(yup.string().oneOf((values = ['black', 'blue', 'gray', 'heather', 'pastel', 'pink', 'red', 'white'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    hairColor: yup
      .array()
      .of(yup.string().oneOf((values = ['auburn', 'black', 'blonde', 'brown', 'pastel', 'platinum', 'red', 'gray'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    accessories: yup
      .array()
      .of(
        yup.string().oneOf((values = ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers']))
      )
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    accessoriesChance: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 10
      }),
    facialHair: yup
      .array()
      .of(yup.string().oneOf((values = ['medium', 'light', 'majestic', 'fancy', 'magnum'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    facialHairChance: yup
      .number()
      .min(0)
      .max(100)
      .meta({
        type: 'range',
        values: [0, 100],
        defaultValue: 10
      }),
    facialHairColor: yup
      .array()
      .of(yup.string().oneOf((values = ['auburn', 'black', 'blonde', 'brown', 'pastel', 'platinum', 'red', 'gray'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    clothes: yup
      .array()
      .of(yup.string().oneOf((values = ['blazer', 'sweater', 'shirt', 'hoodie', 'overall'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    clothesColor: yup
      .array()
      .of(yup.string().oneOf((values = ['black', 'blue', 'gray', 'heather', 'pastel', 'pink', 'red', 'white'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    eyes: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            (values = [
              'close',
              'cry',
              'defaultValue',
              'dizzy',
              'roll',
              'happy',
              'hearts',
              'side',
              'squint',
              'surprised',
              'wink',
              'winkWacky'
            ])
          )
      )
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    eyebrow: yup
      .array()
      .of(yup.string().oneOf((values = ['angry', 'defaultValue', 'flat', 'raised', 'sad', 'unibrow', 'up'])))
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    mouth: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            (values = [
              'concerned',
              'defaultValue',
              'disbelief',
              'eating',
              'grimace',
              'sad',
              'scream',
              'serious',
              'smile',
              'tongue',
              'twinkle',
              'vomit'
            ])
          )
      )
      .meta({
        type: 'checkbox',
        values: values,
        defaultValue: []
      }),
    skin: yup
      .array()
      .of(yup.string().oneOf((values = ['tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'])))
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
