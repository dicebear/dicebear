import type { ConfigStyleCollection } from '@/types';
import getSchemaOptions from '@/utils/getSchemaOptions';
import * as collection from '@dicebear/collection';

const availableStyles: ConfigStyleCollection = {
  adventurer: {
    style: collection.adventurer,
    options: getSchemaOptions(collection.adventurer.schema ?? {}),
  },
  adventurerNeutral: {
    style: collection.adventurerNeutral,
    options: getSchemaOptions(collection.adventurerNeutral.schema ?? {}),
  },
  avataaars: {
    style: collection.avataaars,
    options: getSchemaOptions(collection.avataaars.schema ?? {}),
  },
  avataaarsNeutral: {
    style: collection.avataaarsNeutral,
    options: getSchemaOptions(collection.avataaarsNeutral.schema ?? {}),
  },
  bigEars: {
    style: collection.bigEars,
    options: getSchemaOptions(collection.bigEars.schema ?? {}),
  },
  bigEarsNeutral: {
    style: collection.bigEarsNeutral,
    options: getSchemaOptions(collection.bigEarsNeutral.schema ?? {}),
  },
  bigSmile: {
    style: collection.bigSmile,
    options: getSchemaOptions(collection.bigSmile.schema ?? {}),
  },
  bottts: {
    style: collection.bottts,
    options: getSchemaOptions(collection.bottts.schema ?? {}),
  },
  botttsNeutral: {
    style: collection.botttsNeutral,
    options: getSchemaOptions(collection.botttsNeutral.schema ?? {}),
  },
  croodles: {
    style: collection.croodles,
    options: getSchemaOptions(collection.croodles.schema ?? {}),
  },
  croodlesNeutral: {
    style: collection.croodlesNeutral,
    options: getSchemaOptions(collection.croodlesNeutral.schema ?? {}),
  },
  funEmoji: {
    style: collection.funEmoji,
    options: getSchemaOptions(collection.funEmoji.schema ?? {}),
  },
  lorelei: {
    style: collection.lorelei,
    options: getSchemaOptions(collection.lorelei.schema ?? {}),
  },
  loreleiNeutral: {
    style: collection.loreleiNeutral,
    options: getSchemaOptions(collection.loreleiNeutral.schema ?? {}),
  },
  micah: {
    style: collection.micah,
    options: getSchemaOptions(collection.micah.schema ?? {}),
  },
  miniavs: {
    style: collection.miniavs,
    options: getSchemaOptions(collection.miniavs.schema ?? {}),
  },
  notionists: {
    style: collection.notionists,
    options: getSchemaOptions(collection.notionists.schema ?? {}),
  },
  notionistsNeutral: {
    style: collection.notionistsNeutral,
    options: getSchemaOptions(collection.notionistsNeutral.schema ?? {}),
  },
  openPeeps: {
    style: collection.openPeeps,
    options: getSchemaOptions(collection.openPeeps.schema ?? {}),
  },
  personas: {
    style: collection.personas,
    options: getSchemaOptions(collection.personas.schema ?? {}),
  },
  pixelArt: {
    style: collection.pixelArt,
    options: getSchemaOptions(collection.pixelArt.schema ?? {}),
  },
  pixelArtNeutral: {
    style: collection.pixelArtNeutral,
    options: getSchemaOptions(collection.pixelArtNeutral.schema ?? {}),
  },
};

export default availableStyles;
