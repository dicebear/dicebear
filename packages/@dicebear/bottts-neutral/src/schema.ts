import type { StyleSchema } from '@dicebear/core';
	export const schema: StyleSchema = {
	  title: 'Options',
	  $schema: 'http://json-schema.org/draft-07/schema#',
	  properties: {
	    backgroundColor: {
	      type: 'array',
	      items: {
	        type: 'string',
	        pattern:
	          '^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
	      },
	      default: [
	        'ffb300',
	        '1e88e5',
	        '546e7a',
	        '6d4c41',
	        '00acc1',
	        'f4511e',
	        '5e35b1',
	        '43a047',
	        '757575',
	        '3949ab',
	        '039be5',
	        '7cb342',
	        'c0ca33',
	        'fb8c00',
	        'd81b60',
	        '8e24aa',
	        'e53935',
	        '00897b',
	        'fdd835',
	      ],
	    },
	    eyes: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'bulging',
	          'dizzy',
	          'eva',
	          'frame1',
	          'frame2',
	          'glow',
	          'happy',
	          'hearts',
	          'robocop',
	          'round',
	          'roundFrame01',
	          'roundFrame02',
	          'sensor',
	          'shade01',
	        ],
	      },
	      default: [
	        'bulging',
	        'dizzy',
	        'eva',
	        'frame1',
	        'frame2',
	        'glow',
	        'happy',
	        'hearts',
	        'robocop',
	        'round',
	        'roundFrame01',
	        'roundFrame02',
	        'sensor',
	        'shade01',
	      ],
	      examples: [
	        ['bulging'],
	        ['dizzy'],
	        ['eva'],
	        ['frame1'],
	        ['frame2'],
	        ['glow'],
	        ['happy'],
	        ['hearts'],
	        ['robocop'],
	        ['round'],
	        ['roundFrame01'],
	        ['roundFrame02'],
	        ['sensor'],
	        ['shade01'],
	      ],
	    },
	    mouth: {
	      type: 'array',
	      items: {
	        type: 'string',
	        enum: [
	          'bite',
	          'diagram',
	          'grill01',
	          'grill02',
	          'grill03',
	          'smile01',
	          'smile02',
	          'square01',
	          'square02',
	        ],
	      },
	      default: [
	        'bite',
	        'diagram',
	        'grill01',
	        'grill02',
	        'grill03',
	        'smile01',
	        'smile02',
	        'square01',
	        'square02',
	      ],
	      examples: [
	        ['bite'],
	        ['diagram'],
	        ['grill01'],
	        ['grill02'],
	        ['grill03'],
	        ['smile01'],
	        ['smile02'],
	        ['square01'],
	        ['square02'],
	      ],
	    },
	  },
	  additionalProperties: false,
	};