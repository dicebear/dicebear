export type Color =
  | 'black'
  /** @deprecated use `blue01`, `blue02` and `blue03` instead */
  | 'blue'
  | 'blue01'
  | 'blue02'
  | 'blue03'
  /** @deprecated use `gray01` and `gray02` instead */
  | 'gray'
  | 'gray01'
  | 'gray02'
  | 'heather'
  /** @deprecated use `pastelBlue`, `pastelGreen`, `pastelOrange`, `pastelRed` and `pastelYellow` instead */
  | 'pastel'
  | 'pastelBlue'
  | 'pastelGreen'
  | 'pastelOrange'
  | 'pastelRed'
  | 'pastelYellow'
  | 'pink'
  | 'red'
  | 'white';
export type HairColor =
  | 'auburn'
  | 'black'
  | 'blonde'
  | 'blondeGolden'
  | 'brown'
  | 'brownDark'
  /** @deprecated use `pastelPink` instead */
  | 'pastel'
  | 'pastelPink'
  | 'platinum'
  | 'red'
  /** @deprecated use `silverGray` instead */
  | 'gray'
  | 'silverGray';
export type Accessories = 'kurt' | 'prescription01' | 'prescription02' | 'round' | 'sunglasses' | 'wayfarers';
export type Top =
  /** @deprecated use `bigHair`, `bob`, `bun`, `curly`, `curvy`, `dreads`, `frida`, `fro`, `froAndBand`, `miaWallace`, `longButNotTooLong`, `shavedSides`, `straight01`, `straight02` and `straightAndStrand` instead */
  | 'longHair'
  /** @deprecated use `dreads01`,`dreads02`,`frizzle`,`shaggy`,`shaggyMullet`,`shortCurly`,`shortFlat`,`shortRound`,`shortWaved`,`sides`,`theCaesar` and `theCaesarAndSidePart` */
  | 'shortHair'
  | 'eyepatch'
  | 'hat'
  | 'hijab'
  | 'turban'
  | 'bigHair'
  | 'bob'
  | 'bun'
  | 'curly'
  | 'curvy'
  | 'dreads'
  | 'frida'
  | 'fro'
  | 'froAndBand'
  | 'miaWallace'
  | 'longButNotTooLong'
  | 'shavedSides'
  | 'straight01'
  | 'straight02'
  | 'straightAndStrand'
  | 'dreads01'
  | 'dreads02'
  | 'frizzle'
  | 'shaggy'
  | 'shaggyMullet'
  | 'shortCurly'
  | 'shortFlat'
  | 'shortRound'
  | 'shortWaved'
  | 'sides'
  | 'theCaesar'
  | 'theCaesarAndSidePart'
  | 'winterHat01'
  | 'winterHat02'
  | 'winterHat03'
  | 'winterHat04';
export type FacialHair =
  /** @deprecated use `beardMedium` instead */
  | 'medium'
  | 'beardMedium'
  /** @deprecated use `beardLight` instead */
  | 'light'
  | 'beardLight'
  /** @deprecated use `beardMagestic` instead */
  | 'majestic'
  | 'beardMagestic'
  /** @deprecated use `moustaceFancy` instead */
  | 'fancy'
  | 'moustaceFancy'
  /** @deprecated use `moustacheMagnum` instead */
  | 'magnum'
  | 'moustacheMagnum';
export type Clothes =
  /** @deprecated use `blazerAndShirt` and `blazerAndSweater` instead */
  | 'blazer'
  | 'blazerAndShirt'
  | 'blazerAndSweater'
  /** @deprecated use `collarAndSweater` instead */
  | 'sweater'
  | 'collarAndSweater'
  /** @deprecated use `graphicShirt`, `shirtCrewNeck`, `shirtScoopNeck` and `shirtVNeck` instead */
  | 'shirt'
  | 'graphicShirt'
  | 'shirtCrewNeck'
  | 'shirtScoopNeck'
  | 'shirtVNeck'
  | 'hoodie'
  | 'overall';
export type Eyebrow =
  | 'angry'
  | 'angryNatural'
  | 'default'
  | 'defaultNatural'
  /** @deprecated use `flatNatural` instead */
  | 'flat'
  | 'flatNatural'
  /** @deprecated use `raisedExcited` and `raisedExcitedNatural` instead */
  | 'raised'
  | 'raisedExcited'
  | 'raisedExcitedNatural'
  /** @deprecated use `sadConcerned` and `sadConcernedNatural` instead */
  | 'sad'
  | 'sadConcerned'
  | 'sadConcernedNatural'
  /** @deprecated use `unibrowNatural` instead */
  | 'unibrow'
  | 'unibrowNatural'
  /** @deprecated use `upDown` and `upDownNatural` instead */
  | 'up'
  | 'upDown'
  | 'upDownNatural'
  /** @deprecated use `frownNatural` instead */
  | 'frown'
  | 'frownNatural';
export type Eyes =
  /** @deprecated use `closed` instead */
  | 'close'
  | 'closed'
  | 'cry'
  | 'default'
  /** @deprecated use `xDizzy` instead */
  | 'dizzy'
  | 'xDizzy'
  /** @deprecated use `eyeRoll` instead */
  | 'roll'
  | 'eyeRoll'
  | 'happy'
  | 'hearts'
  | 'side'
  | 'squint'
  | 'surprised'
  | 'wink'
  | 'winkWacky';
export type Mouth =
  | 'concerned'
  | 'default'
  | 'disbelief'
  | 'eating'
  | 'grimace'
  | 'sad'
  /** @deprecated use `screamOpen` instead */
  | 'scream'
  | 'screamOpen'
  | 'serious'
  | 'smile'
  | 'tongue'
  | 'twinkle'
  | 'vomit';
export type Skin = 'tanned' | 'yellow' | 'pale' | 'light' | 'brown' | 'darkBrown' | 'black';
export type ClotheGraphics =
  | 'skullOutline'
  | 'skull'
  | 'resist'
  | 'pizza'
  | 'hola'
  | 'diamond'
  | 'deer'
  | 'cumbia'
  | 'bear'
  | 'bat';

export type Options = {
  background?: string;
  /** @deprecated Default will be `include` starting with version 5.0 */
  mode?: 'include' | 'exclude';
  style?: 'transparent' | 'circle';
  top?: Top[];
  topChance?: number;
  hatColor?: Color[];
  hairColor?: HairColor[];
  accessories?: Accessories[];
  accessoriesChance?: number;
  accessoriesColor?: Color[];
  facialHair?: FacialHair[];
  facialHairChance?: number;
  facialHairColor?: HairColor[];
  clothes?: Clothes[];
  clothesColor?: Color[];
  clotheGraphics?: ClotheGraphics[];
  eyes?: Eyes[];
  eyebrow?: Eyebrow[];
  mouth?: Mouth[];
  skin?: Skin[];
};

export default Options;
