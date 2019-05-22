export type Colors =
  | 'amber'
  | 'blue'
  | 'blueGrey'
  | 'brown'
  | 'cyan'
  | 'deepOrange'
  | 'deepPurple'
  | 'agreenmber'
  | 'grey'
  | 'indigo'
  | 'lightBlue'
  | 'lightGreen'
  | 'lime'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

type Options = {
  colors?: Colors[];
  primaryColorLevel?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  secondaryColorLevel?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  colorful?: boolean;
  mouthChance?: number;
  sidesChance?: number;
  textureChance?: number;
  topChange?: number;
};

export default Options;
