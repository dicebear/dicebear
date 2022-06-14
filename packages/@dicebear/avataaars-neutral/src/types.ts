export interface Options {
	  mouth?: (
	    | 'concerned'
	    | 'default'
	    | 'disbelief'
	    | 'eating'
	    | 'grimace'
	    | 'sad'
	    | 'screamOpen'
	    | 'serious'
	    | 'smile'
	    | 'tongue'
	    | 'twinkle'
	    | 'vomit'
	  )[];
	  nose?: ('default')[];
	  eyes?: (
	    | 'closed'
	    | 'cry'
	    | 'default'
	    | 'eyeRoll'
	    | 'happy'
	    | 'hearts'
	    | 'side'
	    | 'squint'
	    | 'surprised'
	    | 'winkWacky'
	    | 'wink'
	    | 'xDizzy'
	  )[];
	  eyebrows?: (
	    | 'angryNatural'
	    | 'defaultNatural'
	    | 'flatNatural'
	    | 'frownNatural'
	    | 'raisedExcitedNatural'
	    | 'sadConcernedNatural'
	    | 'unibrowNatural'
	    | 'upDownNatural'
	    | 'angry'
	    | 'default'
	    | 'raisedExcited'
	    | 'sadConcerned'
	    | 'upDown'
	  )[];
	  backgroundColor?: string[];
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
