import defaults from './defaults';
import { avataaars as style } from '@dicebear/collection';

const schema = style.schema;

export default {
  ...defaults,
  style: {
    type: 'select',
    // @ts-ignore
    values: schema.properties.style.enum,
    defaultValue: 'transparent',
  },
  top: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.top.items.enum,
    defaultValue: [],
  },
  topChance: {
    type: 'range',
    values: [0, 100],
    defaultValue: 90,
  },
  hatColor: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.hatColor.items.enum,
    defaultValue: [],
  },
  hairColor: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.hairColor.items.enum,
    defaultValue: [],
  },
  accessories: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.accessories.items.enum,
    defaultValue: [],
  },
  accessoriesChance: {
    type: 'range',
    values: [0, 100],
    defaultValue: 10,
  },
  accessoriesColor: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.accessoriesColor.items.enum,
    defaultValue: [],
  },
  facialHair: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.facialHair.items.enum,
    defaultValue: [],
  },
  facialHairChance: {
    type: 'range',
    values: [0, 100],
    defaultValue: 10,
  },
  facialHairColor: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.facialHairColor.items.enum,
    defaultValue: [],
  },
  clothes: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.clothes.items.enum,
    defaultValue: [],
  },
  clothesColor: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.clothesColor.items.enum,
    defaultValue: [],
  },
  eyes: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.eyes.items.enum,
    defaultValue: [],
  },
  eyebrow: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.eyebrow.items.enum,
    defaultValue: [],
  },
  mouth: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.mouth.items.enum,
    defaultValue: [],
  },
  skin: {
    type: 'checkbox',
    // @ts-ignore
    values: schema.properties.skin.items.enum,
    defaultValue: [],
  },
};
