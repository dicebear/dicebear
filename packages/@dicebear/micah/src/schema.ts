import type { StyleSchema } from '@dicebear/core';
	export const schema: StyleSchema = {
	  title: 'Options',
	  $schema: 'http://json-schema.org/draft-07/schema#',
	  properties: {
	    base: {
	      type: 'array',
	      items: { type: 'string', enum: ['standard'] },
	      default: ['standard'],
	      examples: [['standard']],
	    },
	    baseColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: ['f9c9b6', 'ac6651', '77311d'],
	    },
	    earringColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: [
	        'f9c9b6',
	        'd2eff3',
	        '000000',
	        'e0ddff',
	        'f4d150',
	        'ac6651',
	        '9287ff',
	        'ffeba4',
	        'fc909f',
	        'ffedef',
	        '6bd9e9',
	        '77311d',
	        'ffffff',
	      ],
	    },
	    earrings: {
	      type: 'array',
	      items: { type: 'string', enum: ['hoop', 'stud'] },
	      default: ['hoop', 'stud'],
	      examples: [['hoop'], ['stud']],
	    },
	    earringsProbability: {
	      type: 'integer',
	      minimum: 0,
	      maximum: 100,
	      default: 30,
	      examples: [0, 100],
	    },
	    ears: {
	      type: 'array',
	      items: { type: 'string', enum: ['attached', 'detached'] },
	      default: ['attached', 'detached'],
	      examples: [['attached'], ['detached']],
	    },
	    eyeShadowColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: ['d2eff3', 'e0ddff', 'ffeba4', 'ffedef', 'ffffff'],
	    },
	    eyebrows: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: ['up', 'down', 'eyelashesUp', 'eyelashesDown'],
	      },
	      default: ['up', 'down', 'eyelashesUp', 'eyelashesDown'],
	      examples: [['up'], ['down'], ['eyelashesUp'], ['eyelashesDown']],
	    },
	    eyebrowsColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: ['000000'],
	    },
	    eyes: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: ['eyes', 'round', 'eyesShadow', 'smiling'],
	      },
	      default: ['eyes', 'round', 'eyesShadow', 'smiling'],
	      examples: [['eyes'], ['round'], ['eyesShadow'], ['smiling']],
	    },
	    eyesColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: ['000000'],
	    },
	    facialHair: {
	      type: 'array',
	      items: { type: 'string', enum: ['beard', 'scruff'] },
	      default: ['beard', 'scruff'],
	      examples: [['beard'], ['scruff']],
	    },
	    facialHairColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: ['77311d'],
	    },
	    facialHairProbability: {
	      type: 'integer',
	      minimum: 0,
	      maximum: 100,
	      default: 10,
	      examples: [0, 100],
	    },
	    glasses: {
	      type: 'array',
	      items: { type: 'string', enum: ['round', 'square'] },
	      default: ['round', 'square'],
	      examples: [['round'], ['square']],
	    },
	    glassesColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: [
	        'f9c9b6',
	        'd2eff3',
	        '000000',
	        'e0ddff',
	        'f4d150',
	        'ac6651',
	        '9287ff',
	        'ffeba4',
	        'fc909f',
	        'ffedef',
	        '6bd9e9',
	        '77311d',
	        'ffffff',
	      ],
	    },
	    glassesProbability: {
	      type: 'integer',
	      minimum: 0,
	      maximum: 100,
	      default: 30,
	      examples: [0, 100],
	    },
	    hair: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'fonze',
	          'mrT',
	          'dougFunny',
	          'mrClean',
	          'dannyPhantom',
	          'full',
	          'turban',
	          'pixie',
	        ],
	      },
	      default: [
	        'fonze',
	        'mrT',
	        'dougFunny',
	        'mrClean',
	        'dannyPhantom',
	        'full',
	        'turban',
	        'pixie',
	      ],
	      examples: [
	        ['fonze'],
	        ['mrT'],
	        ['dougFunny'],
	        ['mrClean'],
	        ['dannyPhantom'],
	        ['full'],
	        ['turban'],
	        ['pixie'],
	      ],
	    },
	    hairColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: [
	        'f9c9b6',
	        'd2eff3',
	        '000000',
	        'e0ddff',
	        'f4d150',
	        'ac6651',
	        '9287ff',
	        'ffeba4',
	        'fc909f',
	        'ffedef',
	        '6bd9e9',
	        '77311d',
	        'ffffff',
	      ],
	    },
	    hairProbability: {
	      type: 'integer',
	      minimum: 0,
	      maximum: 100,
	      default: 100,
	      examples: [0, 100],
	    },
	    mouth: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'surprised',
	          'laughing',
	          'nervous',
	          'smile',
	          'sad',
	          'pucker',
	          'frown',
	          'smirk',
	        ],
	      },
	      default: [
	        'surprised',
	        'laughing',
	        'nervous',
	        'smile',
	        'sad',
	        'pucker',
	        'frown',
	        'smirk',
	      ],
	      examples: [
	        ['surprised'],
	        ['laughing'],
	        ['nervous'],
	        ['smile'],
	        ['sad'],
	        ['pucker'],
	        ['frown'],
	        ['smirk'],
	      ],
	    },
	    mouthColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: ['000000'],
	    },
	    nose: {
	      type: 'array',
	      items: { type: 'string', enum: ['curve', 'pointed', 'tound'] },
	      default: ['curve', 'pointed', 'tound'],
	      examples: [['curve'], ['pointed'], ['tound']],
	    },
	    shirt: {
	      type: 'array',
	      items: { type: 'string', enum: ['open', 'crew', 'collared'] },
	      default: ['open', 'crew', 'collared'],
	      examples: [['open'], ['crew'], ['collared']],
	    },
	    shirtColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: [
	        'f9c9b6',
	        'd2eff3',
	        '000000',
	        'e0ddff',
	        'f4d150',
	        'ac6651',
	        '9287ff',
	        'ffeba4',
	        'fc909f',
	        'ffedef',
	        '6bd9e9',
	        '77311d',
	        'ffffff',
	      ],
	    },
	  },
	  additionalProperties: false,
	};
