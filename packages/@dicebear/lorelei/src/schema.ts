/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/FCwwMBxsRND9Mbtpg5PUic/%40dicebear%2Florelei?node-id=23%3A2194
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "beard": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant01",
          "variant02"
        ]
      },
      "default": [
        "variant01",
        "variant02"
      ]
    },
    "beardProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 5
    },
    "earrings": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant01",
          "variant02",
          "variant03"
        ]
      },
      "default": [
        "variant01",
        "variant02",
        "variant03"
      ]
    },
    "earringsColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "earringsProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 10
    },
    "eyebrows": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant13",
          "variant12",
          "variant11",
          "variant10",
          "variant09",
          "variant08",
          "variant07",
          "variant06",
          "variant05",
          "variant04",
          "variant03",
          "variant02",
          "variant01"
        ]
      },
      "default": [
        "variant13",
        "variant12",
        "variant11",
        "variant10",
        "variant09",
        "variant08",
        "variant07",
        "variant06",
        "variant05",
        "variant04",
        "variant03",
        "variant02",
        "variant01"
      ]
    },
    "eyebrowsColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant24",
          "variant23",
          "variant22",
          "variant21",
          "variant20",
          "variant19",
          "variant18",
          "variant17",
          "variant16",
          "variant15",
          "variant14",
          "variant13",
          "variant12",
          "variant11",
          "variant10",
          "variant09",
          "variant08",
          "variant07",
          "variant06",
          "variant05",
          "variant04",
          "variant03",
          "variant02",
          "variant01"
        ]
      },
      "default": [
        "variant24",
        "variant23",
        "variant22",
        "variant21",
        "variant20",
        "variant19",
        "variant18",
        "variant17",
        "variant16",
        "variant15",
        "variant14",
        "variant13",
        "variant12",
        "variant11",
        "variant10",
        "variant09",
        "variant08",
        "variant07",
        "variant06",
        "variant05",
        "variant04",
        "variant03",
        "variant02",
        "variant01"
      ]
    },
    "eyesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "freckles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant01"
        ]
      },
      "default": [
        "variant01"
      ]
    },
    "frecklesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "frecklesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 5
    },
    "glasses": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant01",
          "variant02",
          "variant03",
          "variant04",
          "variant05"
        ]
      },
      "default": [
        "variant01",
        "variant02",
        "variant03",
        "variant04",
        "variant05"
      ]
    },
    "glassesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "glassesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 10
    },
    "hair": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant48",
          "variant47",
          "variant46",
          "variant45",
          "variant44",
          "variant43",
          "variant42",
          "variant41",
          "variant40",
          "variant39",
          "variant38",
          "variant37",
          "variant36",
          "variant35",
          "variant34",
          "variant33",
          "variant32",
          "variant31",
          "variant30",
          "variant29",
          "variant28",
          "variant27",
          "variant26",
          "variant25",
          "variant24",
          "variant23",
          "variant22",
          "variant21",
          "variant20",
          "variant19",
          "variant18",
          "variant17",
          "variant16",
          "variant15",
          "variant14",
          "variant13",
          "variant12",
          "variant11",
          "variant10",
          "variant09",
          "variant08",
          "variant07",
          "variant06",
          "variant05",
          "variant04",
          "variant03",
          "variant02",
          "variant01"
        ]
      },
      "default": [
        "variant48",
        "variant47",
        "variant46",
        "variant45",
        "variant44",
        "variant43",
        "variant42",
        "variant41",
        "variant40",
        "variant39",
        "variant38",
        "variant37",
        "variant36",
        "variant35",
        "variant34",
        "variant33",
        "variant32",
        "variant31",
        "variant30",
        "variant29",
        "variant28",
        "variant27",
        "variant26",
        "variant25",
        "variant24",
        "variant23",
        "variant22",
        "variant21",
        "variant20",
        "variant19",
        "variant18",
        "variant17",
        "variant16",
        "variant15",
        "variant14",
        "variant13",
        "variant12",
        "variant11",
        "variant10",
        "variant09",
        "variant08",
        "variant07",
        "variant06",
        "variant05",
        "variant04",
        "variant03",
        "variant02",
        "variant01"
      ]
    },
    "hairAccessories": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "flowers"
        ]
      },
      "default": [
        "flowers"
      ]
    },
    "hairAccessoriesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "hairAccessoriesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 5
    },
    "hairColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "head": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant04",
          "variant03",
          "variant02",
          "variant01"
        ]
      },
      "default": [
        "variant04",
        "variant03",
        "variant02",
        "variant01"
      ]
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "happy01",
          "happy02",
          "happy03",
          "happy04",
          "happy05",
          "happy06",
          "happy07",
          "happy08",
          "happy18",
          "happy09",
          "happy10",
          "happy11",
          "happy12",
          "happy13",
          "happy14",
          "happy17",
          "happy15",
          "happy16",
          "sad01",
          "sad02",
          "sad03",
          "sad04",
          "sad05",
          "sad06",
          "sad07",
          "sad08",
          "sad09"
        ]
      },
      "default": [
        "happy01",
        "happy02",
        "happy03",
        "happy04",
        "happy05",
        "happy06",
        "happy07",
        "happy08",
        "happy18",
        "happy09",
        "happy10",
        "happy11",
        "happy12",
        "happy13",
        "happy14",
        "happy17",
        "happy15",
        "happy16",
        "sad01",
        "sad02",
        "sad03",
        "sad04",
        "sad05",
        "sad06",
        "sad07",
        "sad08",
        "sad09"
      ]
    },
    "mouthColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "nose": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "variant01",
          "variant02",
          "variant03",
          "variant04",
          "variant05",
          "variant06"
        ]
      },
      "default": [
        "variant01",
        "variant02",
        "variant03",
        "variant04",
        "variant05",
        "variant06"
      ]
    },
    "noseColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "000000"
      ]
    },
    "skinColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "ffffff"
      ]
    }
  }
};
