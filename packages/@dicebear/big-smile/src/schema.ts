import type { StyleSchema } from '@dicebear/core';
	export const schema: StyleSchema = {
	  title: 'Options',
	  $schema: 'http://json-schema.org/draft-07/schema#',
	  properties: {
	    accessories: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'catEars',
	          'glasses',
	          'sailormoonCrown',
	          'clownNose',
	          'sleepMask',
	          'sunglasses',
	          'faceMask',
	          'mustache',
	        ],
	      },
	      default: [
	        'catEars',
	        'glasses',
	        'sailormoonCrown',
	        'clownNose',
	        'sleepMask',
	        'sunglasses',
	        'faceMask',
	        'mustache',
	      ],
	      examples: [
	        ['catEars'],
	        ['glasses'],
	        ['sailormoonCrown'],
	        ['clownNose'],
	        ['sleepMask'],
	        ['sunglasses'],
	        ['faceMask'],
	        ['mustache'],
	      ],
	    },
	    accessoriesProbability: {
	      type: 'integer',
	      minimum: 0,
	      maximum: 100,
	      default: 50,
	      examples: [0, 100],
	    },
	    eyes: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'cheery',
	          'normal',
	          'confused',
	          'starstruck',
	          'winking',
	          'sleepy',
	          'sad',
	          'angry',
	        ],
	      },
	      default: [
	        'cheery',
	        'normal',
	        'confused',
	        'starstruck',
	        'winking',
	        'sleepy',
	        'sad',
	        'angry',
	      ],
	      examples: [
	        ['cheery'],
	        ['normal'],
	        ['confused'],
	        ['starstruck'],
	        ['winking'],
	        ['sleepy'],
	        ['sad'],
	        ['angry'],
	      ],
	    },
	    face: {
	      type: 'array',
	      items: { type: 'string', enum: ['base'] },
	      default: ['base'],
	      examples: [['base']],
	    },
	    hair: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'shortHair',
	          'mohawk',
	          'wavyBob',
	          'bowlCutHair',
	          'curlyBob',
	          'straightHair',
	          'braids',
	          'shavedHead',
	          'bunHair',
	          'froBun',
	          'bangs',
	          'halfShavedHead',
	          'curlyShortHair',
	        ],
	      },
	      default: [
	        'shortHair',
	        'mohawk',
	        'wavyBob',
	        'bowlCutHair',
	        'curlyBob',
	        'straightHair',
	        'braids',
	        'shavedHead',
	        'bunHair',
	        'froBun',
	        'bangs',
	        'halfShavedHead',
	        'curlyShortHair',
	      ],
	      examples: [
	        ['shortHair'],
	        ['mohawk'],
	        ['wavyBob'],
	        ['bowlCutHair'],
	        ['curlyBob'],
	        ['straightHair'],
	        ['braids'],
	        ['shavedHead'],
	        ['bunHair'],
	        ['froBun'],
	        ['bangs'],
	        ['halfShavedHead'],
	        ['curlyShortHair'],
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
	        '220f00',
	        '3a1a00',
	        '71472d',
	        'e2ba87',
	        '605de4',
	        '238d80',
	        'd56c0c',
	        'e9b729',
	      ],
	    },
	    mouth: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'openedSmile',
	          'unimpressed',
	          'gapSmile',
	          'openSad',
	          'teethSmile',
	          'awkwardSmile',
	          'braces',
	          'kawaii',
	        ],
	      },
	      default: [
	        'openedSmile',
	        'unimpressed',
	        'gapSmile',
	        'openSad',
	        'teethSmile',
	        'awkwardSmile',
	        'braces',
	        'kawaii',
	      ],
	      examples: [
	        ['openedSmile'],
	        ['unimpressed'],
	        ['gapSmile'],
	        ['openSad'],
	        ['teethSmile'],
	        ['awkwardSmile'],
	        ['braces'],
	        ['kawaii'],
	      ],
	    },
	    skinColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: [
	        'ffe4c0',
	        'f5d7b1',
	        'efcc9f',
	        'e2ba87',
	        'c99c62',
	        'a47539',
	        '8c5a2b',
	        '643d19',
	      ],
	    },
	  },
	  additionalProperties: false,
	};