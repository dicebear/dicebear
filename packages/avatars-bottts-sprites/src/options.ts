type Options = {
  mode?: 'include' | 'exclude';
  primaryColorLevel?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  secondaryColorLevel?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  colorful?: boolean;
  eyes?:
    | 'bulging'
    | 'dizzy'
    | 'eva'
    | 'frame'
    | 'glow'
    | 'hal'
    | 'happy'
    | 'round-frame'
    | 'round'
    | 'sensor'
    | 'shade';
  face?: 'round' | 'square';
  mouth?: 'bite' | 'diagram' | 'grill' | 'smile' | 'square';
  mouthChance?: number;
  sides?: 'antenna' | 'cables' | 'round' | 'square';
  sidesChance?: number;
  texture?: 'camo' | 'circuits' | 'dirty';
  textureChance?: number;
  top?: 'antenna' | 'bulb' | 'glowing-bulb' | 'horns' | 'lights' | 'pyramid' | 'radar';
  topChange?: number;
};

export default Options;
