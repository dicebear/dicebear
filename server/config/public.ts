import * as yup from 'yup';
import { PublicConfig } from '../types/publicConfig';

let values: Array<any> = [];

let config: PublicConfig = {
  spriteCollections: {
    v3: [
      {
        id: 'male',
        name: '@dicebear/avatars-male-sprites',
        options: yup
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
          .noUnknown()
      },
      {
        id: 'female',
        name: '@dicebear/avatars-female-sprites',
        options: yup
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
          .noUnknown()
      },
      {
        id: 'identicon',
        name: '@dicebear/avatars-identicon-sprites',
        options: yup
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
              .matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
              .meta({
                type: 'switch',
                values: ['#fff', '#f0f0f0'],
                defaultValue: '#fff'
              })
          })
          .noUnknown()
      },
      {
        id: 'gridy',
        name: '@dicebear/avatars-gridy-sprites',
        options: yup
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
          .noUnknown()
      },
      {
        id: 'avataaars',
        name: '@dicebear/avatars-avataaars-sprites',
        options: yup
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
              .of(
                yup
                  .string()
                  .oneOf((values = ['auburn', 'black', 'blonde', 'brown', 'pastel', 'platinum', 'red', 'gray']))
              )
              .meta({
                type: 'checkbox',
                values: values,
                defaultValue: []
              }),
            accessories: yup
              .array()
              .of(
                yup
                  .string()
                  .oneOf((values = ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers']))
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
              .of(yup.string().oneOf((values = ['medium', 'light', 'magestic', 'fancy', 'magnum'])))
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
              .of(
                yup
                  .string()
                  .oneOf((values = ['auburn', 'black', 'blonde', 'brown', 'pastel', 'platinum', 'red', 'gray']))
              )
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
          .noUnknown()
      }
    ]
  }
};

export default config;
