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
          .noUnknown()
      },
      {
        id: 'bottts',
        name: '@dicebear/avatars-bottts-sprites',
        options: yup
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
      },
      {
        id: 'jdenticon',
        name: '@dicebear/avatars-jdenticon-sprites',
        options: yup
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
      }
    ]
  }
};

export default config;
