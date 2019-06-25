type Options = {
  mode?: 'include' | 'exclude';
  style?: 'transparent' | 'circle';
  top?: 'longHair' | 'shortHair' | 'eyepatch' | 'hat' | 'hijab' | 'turban';
  topChance?: 100;
  hatColor?: 'black' | 'blue' | 'gray' | 'heather' | 'pastel' | 'pink' | 'red' | 'white';
  hairColor?: 'auburn' | 'black' | 'blonde' | 'brown' | 'pastel' | 'platinum' | 'red' | 'gray';
  accessories?: 'kurt' | 'prescription01' | 'prescription02' | 'round' | 'sunglasses' | 'wayfarers';
  accessoriesChance?: number;
  facialHair?: 'medium' | 'light' | 'majestic' | 'fancy' | 'magnum';
  facialHairChance?: number;
  facialHairColor?: 'auburn' | 'black' | 'blonde' | 'brown' | 'platinum' | 'red';
  clothes?: 'blazer' | 'sweater' | 'shirt' | 'hoodie' | 'overall';
  clothesColor?: 'black' | 'blue' | 'gray' | 'heather' | 'pastel' | 'pink' | 'red' | 'white';
  eyes?:
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
    | 'winkWacky';
  eyebrow?: 'angry' | 'default' | 'flat' | 'raised' | 'sad' | 'unibrow' | 'up';
  mouth?:
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
    | 'vomit';
  skin?: 'tanned' | 'yellow' | 'pale' | 'light' | 'brown' | 'darkBrown' | 'black';
};

export default Options;
