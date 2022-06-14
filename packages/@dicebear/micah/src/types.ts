export interface Options {
	  base?: ('standard')[];
	  mouth?: (
	    | 'surprised'
	    | 'laughing'
	    | 'nervous'
	    | 'smile'
	    | 'sad'
	    | 'pucker'
	    | 'frown'
	    | 'smirk'
	  )[];
	  eyebrows?: ('up' | 'down' | 'eyelashesUp' | 'eyelashesDown')[];
	  hair?: (
	    | 'fonze'
	    | 'mrT'
	    | 'dougFunny'
	    | 'mrClean'
	    | 'dannyPhantom'
	    | 'full'
	    | 'turban'
	    | 'pixie'
	  )[];
	  hairProbability?: number;
	  eyes?: ('eyes' | 'round' | 'eyesShadow' | 'smiling')[];
	  nose?: ('curve' | 'pointed' | 'tound')[];
	  ears?: ('attached' | 'detached')[];
	  shirt?: ('open' | 'crew' | 'collared')[];
	  earrings?: ('hoop' | 'stud')[];
	  earringsProbability?: number;
	  glasses?: ('round' | 'square')[];
	  glassesProbability?: number;
	  facialHair?: ('beard' | 'scruff')[];
	  facialHairProbability?: number;
	  baseColor?: string[];
	  earringColor?: string[];
	  eyeShadowColor?: string[];
	  eyebrowsColor?: string[];
	  facialHairColor?: string[];
	  glassesColor?: string[];
	  hairColor?: string[];
	  mouthColor?: string[];
	  shirtColor?: string[];
	  eyesColor?: string[];
	}
	export type ColorGroup = Record<string, ColorGroupItem>;
	export type ColorGroupCollection = Record<string, ColorGroup>;
	export type ColorGroupItem = string;
	export type ColorPickCollection = Record<string, string>;
	export type ComponentGroup = Record<string, ComponentGroupItem>;
	export type ComponentGroupCollection = Record<string, ComponentGroup>;
	export type ComponentGroupItem = (
	  components: ComponentPickCollection,
	  colors: ColorPickCollection
	) => string;
	export type ComponentPickCollection = Record<string, ComponentPick>;
	export type ComponentPick =
	  | { name: string; value: ComponentGroupItem }
	  | undefined;
