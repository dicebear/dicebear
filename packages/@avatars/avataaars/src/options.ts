type Options = {
  background?: string;
  mode?: 'include' | 'exclude';
  style?: 'transparent' | 'circle';
  top?: Array<'longHair' | 'shortHair' | 'eyepatch' | 'hat' | 'hijab' | 'turban'>;
  topProbability?: 100;
  hatColor?: Array<'black' | 'blue' | 'gray' | 'heather' | 'pastel' | 'pink' | 'red' | 'white'>;
  hairColor?: Array<
    | 'auburn'
    | 'black'
    | 'blonde'
    | 'blondeGolden'
    | 'brown'
    | 'brownDark'
    | 'pastelPink'
    | 'platinum'
    | 'red'
    | 'graySilver'
  >;
  accessories?: Array<'kurt' | 'prescription01' | 'prescription02' | 'round' | 'sunglasses' | 'wayfarers'>;
  accessoriesProbability?: number;
  facialHair?: Array<
    | 'auburn'
    | 'black'
    | 'blonde'
    | 'blondeGolden'
    | 'brown'
    | 'brownDark'
    | 'pastelPink'
    | 'platinum'
    | 'red'
    | 'graySilver'
  >;
  facialHairProbability?: number;
  facialHairColor?: Array<'auburn' | 'black' | 'blonde' | 'brown' | 'platinum' | 'red'>;
  clothing?: Array<
    | 'blazerAndShirt'
    | 'blazerAndSweater'
    | 'collarAndSweater'
    | 'graphicShirt'
    | 'shirtCrewNeck'
    | 'shirtScoopNeck'
    | 'shirtVNeck'
    | 'hoodie'
    | 'overall'
  >;
  clothingColor?: Array<
    | 'black'
    | 'blue01'
    | 'blue02'
    | 'blue03'
    | 'gray01'
    | 'gray02'
    | 'heather'
    | 'pastelBlue'
    | 'pastelGreen'
    | 'pastelOrange'
    | 'pastelRed'
    | 'pastelYellow'
    | 'pink'
    | 'red'
    | 'white'
  >;
  eyes?: Array<
    | 'close'
    | 'cry'
    | 'default'
    | 'dizzy'
    | 'roll'
    | 'happy'
    | 'hearts'
    | 'side'
    | 'squint'
    | 'surprised'
    | 'wink'
    | 'winkWacky'
  >;
  eyebrows?: Array<
    | 'angry'
    | 'angryNatural'
    | 'default'
    | 'defaultNatural'
    | 'flatNatural'
    | 'raisedExcited'
    | 'raisedExcitedNatural'
    | 'sadConcerned'
    | 'sadConcernedNatural'
    | 'upDown'
    | 'upDownNatural'
    | 'frownNatural'
    | 'unibrowNatural'
  >;
  mouth?: Array<
    | 'concerned'
    | 'default'
    | 'disbelief'
    | 'eating'
    | 'grimace'
    | 'sad'
    | 'scream'
    | 'serious'
    | 'smile'
    | 'tongue'
    | 'twinkle'
    | 'vomit'
  >;
  skinColor?: Array<'tanned' | 'yellow' | 'pale' | 'light' | 'brown' | 'darkBrown' | 'black'>;
};

export default Options;
