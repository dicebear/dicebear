export interface Options {
	  row1?: (
	    | 'xooox'
	    | 'xxoxx'
	    | 'xoxox'
	    | 'oxxxo'
	    | 'xxxxx'
	    | 'oxoxo'
	    | 'ooxoo'
	  )[];
	  row2?: (
	    | 'xooox'
	    | 'xxoxx'
	    | 'xoxox'
	    | 'oxxxo'
	    | 'xxxxx'
	    | 'oxoxo'
	    | 'ooxoo'
	  )[];
	  row3?: (
	    | 'xooox'
	    | 'xxoxx'
	    | 'xoxox'
	    | 'oxxxo'
	    | 'xxxxx'
	    | 'oxoxo'
	    | 'ooxoo'
	  )[];
	  row4?: (
	    | 'xooox'
	    | 'xxoxx'
	    | 'xoxox'
	    | 'oxxxo'
	    | 'xxxxx'
	    | 'oxoxo'
	    | 'ooxoo'
	  )[];
	  row5?: (
	    | 'xooox'
	    | 'xxoxx'
	    | 'xoxox'
	    | 'oxxxo'
	    | 'xxxxx'
	    | 'oxoxo'
	    | 'ooxoo'
	  )[];
	  rowColor?: string[];
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
