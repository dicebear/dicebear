import * as yup from 'yup';
import defaults from './defaults';

export default yup.object({
  ...defaults,
  style: yup.string().oneOf(['transparent', 'circle']),
  mode: yup.string().oneOf(['include', 'exclude']),
  top: yup.array().of(yup.string().oneOf(['longHair', 'shortHair', 'eyepatch', 'hat', 'hijab', 'turban'])),
  topChance: yup.number().min(0).max(100),
  hatColor: yup.array().of(yup.string().oneOf(['black', 'blue', 'gray', 'heather', 'pastel', 'pink', 'red', 'white'])),
  hairColor: yup
    .array()
    .of(yup.string().oneOf(['auburn', 'black', 'blonde', 'brown', 'pastel', 'platinum', 'red', 'gray'])),
  accessories: yup
    .array()
    .of(yup.string().oneOf(['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers'])),
  accessoriesChance: yup.number().min(0).max(100),
  accessoriesColor: yup
    .array()
    .of(yup.string().oneOf(['black', 'blue', 'gray', 'heather', 'pastel', 'pink', 'red', 'white'])),
  facialHair: yup.array().of(yup.string().oneOf(['medium', 'light', 'majestic', 'fancy', 'magnum', 'pastel', 'gray'])),
  facialHairChance: yup.number().min(0).max(100),
  facialHairColor: yup
    .array()
    .of(yup.string().oneOf(['auburn', 'black', 'blonde', 'brown', 'pastel', 'platinum', 'red', 'gray'])),
  clothes: yup.array().of(yup.string().oneOf(['blazer', 'sweater', 'shirt', 'hoodie', 'overall'])),
  clothesColor: yup
    .array()
    .of(yup.string().oneOf(['black', 'blue', 'gray', 'heather', 'pastel', 'pink', 'red', 'white'])),
  eyes: yup
    .array()
    .of(
      yup
        .string()
        .oneOf([
          'close',
          'cry',
          'default',
          'dizzy',
          'roll',
          'happy',
          'hearts',
          'side',
          'squint',
          'surprised',
          'wink',
          'winkWacky',
        ])
    ),
  eyebrow: yup.array().of(yup.string().oneOf(['angry', 'default', 'flat', 'raised', 'sad', 'unibrow', 'up', 'frown'])),
  mouth: yup
    .array()
    .of(
      yup
        .string()
        .oneOf([
          'concerned',
          'default',
          'disbelief',
          'eating',
          'grimace',
          'sad',
          'scream',
          'serious',
          'smile',
          'tongue',
          'twinkle',
          'vomit',
        ])
    ),
  skin: yup.array().of(yup.string().oneOf(['tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'])),
});
