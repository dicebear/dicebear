export interface Options {
	  head?: ('normal' | 'wide' | 'thin')[];
	  body?: ('tShirt' | 'golf')[];
	  hair?: (
	    | 'balndess'
	    | 'slaughter'
	    | 'ponyTail'
	    | 'long'
	    | 'curly'
	    | 'stylish'
	    | 'elvis'
	    | 'classic02'
	    | 'classic01'
	  )[];
	  mouth?: ('default' | 'missingTooth')[];
	  eyes?: ('normal' | 'confident' | 'happy')[];
	  glasses?: ('normal')[];
	  glassesProbability?: number;
	  mustache?: ('pencilThinBeard' | 'pencilThin' | 'horshoe' | 'freddy')[];
	  mustacheProbability?: number;
	  blushes?: ('default')[];
	  blushesProbability?: number;
	  skinColor?: string[];
	  hairColor?: string[];
	  bodyColor?: string[];
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
