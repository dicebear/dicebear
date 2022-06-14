export interface Options {
	  face?: ('base')[];
	  mouth?: (
	    | 'openedSmile'
	    | 'unimpressed'
	    | 'gapSmile'
	    | 'openSad'
	    | 'teethSmile'
	    | 'awkwardSmile'
	    | 'braces'
	    | 'kawaii'
	  )[];
	  eyes?: (
	    | 'cheery'
	    | 'normal'
	    | 'confused'
	    | 'starstruck'
	    | 'winking'
	    | 'sleepy'
	    | 'sad'
	    | 'angry'
	  )[];
	  hair?: (
	    | 'shortHair'
	    | 'mohawk'
	    | 'wavyBob'
	    | 'bowlCutHair'
	    | 'curlyBob'
	    | 'straightHair'
	    | 'braids'
	    | 'shavedHead'
	    | 'bunHair'
	    | 'froBun'
	    | 'bangs'
	    | 'halfShavedHead'
	    | 'curlyShortHair'
	  )[];
	  accessories?: (
	    | 'catEars'
	    | 'glasses'
	    | 'sailormoonCrown'
	    | 'clownNose'
	    | 'sleepMask'
	    | 'sunglasses'
	    | 'faceMask'
	    | 'mustache'
	  )[];
	  accessoriesProbability?: number;
	  skinColor?: string[];
	  hairColor?: string[];
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
