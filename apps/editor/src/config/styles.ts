import type { ConfigStyleCollection } from '@/types';
import { Style } from '@dicebear/core';
import getSchemaOptions from '@/utils/getSchemaOptions';

import adventurerDef from '@dicebear/styles/adventurer.json';
import adventurerNeutralDef from '@dicebear/styles/adventurer-neutral.json';
import avataaars from '@dicebear/styles/avataaars.json';
import avataaarsNeutralDef from '@dicebear/styles/avataaars-neutral.json';
import bigEarsDef from '@dicebear/styles/big-ears.json';
import bigEarsNeutralDef from '@dicebear/styles/big-ears-neutral.json';
import bigSmileDef from '@dicebear/styles/big-smile.json';
import botttsDef from '@dicebear/styles/bottts.json';
import botttsNeutralDef from '@dicebear/styles/bottts-neutral.json';
import clayDef from '@dicebear/styles/clay.json';
import crittersDef from '@dicebear/styles/critters.json';
import croodlesDef from '@dicebear/styles/croodles.json';
import croodlesNeutralDef from '@dicebear/styles/croodles-neutral.json';
import dylanDef from '@dicebear/styles/dylan.json';
import funEmojiDef from '@dicebear/styles/fun-emoji.json';
import loreleiDef from '@dicebear/styles/lorelei.json';
import loreleiNeutralDef from '@dicebear/styles/lorelei-neutral.json';
import micahDef from '@dicebear/styles/micah.json';
import mininavsDef from '@dicebear/styles/miniavs.json';
import moodsDef from '@dicebear/styles/moods.json';
import notionistsDef from '@dicebear/styles/notionists.json';
import notionistsNeutralDef from '@dicebear/styles/notionists-neutral.json';
import openPeepsDef from '@dicebear/styles/open-peeps.json';
import personasDef from '@dicebear/styles/personas.json';
import pixelArtDef from '@dicebear/styles/pixel-art.json';
import pixelArtNeutralDef from '@dicebear/styles/pixel-art-neutral.json';
import pixelbotDef from '@dicebear/styles/pixelbot.json';
import sproutsDef from '@dicebear/styles/sprouts.json';
import thumbsDef from '@dicebear/styles/thumbs.json';
import toonHeadDef from '@dicebear/styles/toon-head.json';
import voxelArtDef from '@dicebear/styles/voxel-art.json';
import voxelBotDef from '@dicebear/styles/voxel-bot.json';

function createStyle(definition: unknown): {
  style: Style;
  options: ReturnType<typeof getSchemaOptions>;
} {
  const style = new Style(definition);

  return { style, options: getSchemaOptions(style) };
}

const availableStyles: ConfigStyleCollection = {
  adventurer: createStyle(adventurerDef),
  adventurerNeutral: createStyle(adventurerNeutralDef),
  avataaars: createStyle(avataaars),
  avataaarsNeutral: createStyle(avataaarsNeutralDef),
  bigEars: createStyle(bigEarsDef),
  bigEarsNeutral: createStyle(bigEarsNeutralDef),
  bigSmile: createStyle(bigSmileDef),
  bottts: createStyle(botttsDef),
  botttsNeutral: createStyle(botttsNeutralDef),
  clay: createStyle(clayDef),
  critters: createStyle(crittersDef),
  croodles: createStyle(croodlesDef),
  croodlesNeutral: createStyle(croodlesNeutralDef),
  dylan: createStyle(dylanDef),
  funEmoji: createStyle(funEmojiDef),
  lorelei: createStyle(loreleiDef),
  loreleiNeutral: createStyle(loreleiNeutralDef),
  micah: createStyle(micahDef),
  miniavs: createStyle(mininavsDef),
  moods: createStyle(moodsDef),
  notionists: createStyle(notionistsDef),
  notionistsNeutral: createStyle(notionistsNeutralDef),
  openPeeps: createStyle(openPeepsDef),
  personas: createStyle(personasDef),
  pixelArt: createStyle(pixelArtDef),
  pixelArtNeutral: createStyle(pixelArtNeutralDef),
  pixelbot: createStyle(pixelbotDef),
  sprouts: createStyle(sproutsDef),
  thumbs: createStyle(thumbsDef),
  toonHead: createStyle(toonHeadDef),
  voxelArt: createStyle(voxelArtDef),
  voxelBot: createStyle(voxelBotDef),
};

export default availableStyles;
