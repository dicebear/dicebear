/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h/%40dicebear%2Favataaars?node-id=10%3A108
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "accessories": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "kurt",
          "prescription01",
          "prescription02",
          "round",
          "sunglasses",
          "wayfarers"
        ]
      },
      "default": [
        "kurt",
        "prescription01",
        "prescription02",
        "round",
        "sunglasses",
        "wayfarers"
      ]
    },
    "accessoriesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "262e33",
        "65c9ff",
        "5199e4",
        "25557c",
        "e6e6e6",
        "929598",
        "3c4f5c",
        "b1e2ff",
        "a7ffc4",
        "ffdeb5",
        "ffafb9",
        "ffffb1",
        "ff488e",
        "ff5c5c",
        "ffffff"
      ]
    },
    "accessoriesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 10
    },
    "backgroundColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "65c9ff"
      ]
    },
    "clothesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "262e33",
        "65c9ff",
        "5199e4",
        "25557c",
        "e6e6e6",
        "929598",
        "3c4f5c",
        "b1e2ff",
        "a7ffc4",
        "ffdeb5",
        "ffafb9",
        "ffffb1",
        "ff488e",
        "ff5c5c",
        "ffffff"
      ]
    },
    "clothing": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "blazerAndShirt",
          "blazerAndSweater",
          "collarAndSweater",
          "graphicShirt",
          "hoodie",
          "overall",
          "shirtCrewNeck",
          "shirtScoopNeck",
          "shirtVNeck"
        ]
      },
      "default": [
        "blazerAndShirt",
        "blazerAndSweater",
        "collarAndSweater",
        "graphicShirt",
        "hoodie",
        "overall",
        "shirtCrewNeck",
        "shirtScoopNeck",
        "shirtVNeck"
      ]
    },
    "clothingGraphic": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "bat",
          "bear",
          "cumbia",
          "deer",
          "diamond",
          "hola",
          "pizza",
          "resist",
          "skull",
          "skullOutline"
        ]
      },
      "default": [
        "bat",
        "bear",
        "cumbia",
        "deer",
        "diamond",
        "hola",
        "pizza",
        "resist",
        "skull",
        "skullOutline"
      ]
    },
    "eyebrows": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "angryNatural",
          "defaultNatural",
          "flatNatural",
          "frownNatural",
          "raisedExcitedNatural",
          "sadConcernedNatural",
          "unibrowNatural",
          "upDownNatural",
          "angry",
          "default",
          "raisedExcited",
          "sadConcerned",
          "upDown"
        ]
      },
      "default": [
        "angryNatural",
        "defaultNatural",
        "flatNatural",
        "frownNatural",
        "raisedExcitedNatural",
        "sadConcernedNatural",
        "unibrowNatural",
        "upDownNatural",
        "angry",
        "default",
        "raisedExcited",
        "sadConcerned",
        "upDown"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "closed",
          "cry",
          "default",
          "eyeRoll",
          "happy",
          "hearts",
          "side",
          "squint",
          "surprised",
          "winkWacky",
          "wink",
          "xDizzy"
        ]
      },
      "default": [
        "closed",
        "cry",
        "default",
        "eyeRoll",
        "happy",
        "hearts",
        "side",
        "squint",
        "surprised",
        "winkWacky",
        "wink",
        "xDizzy"
      ]
    },
    "facialHair": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "beardLight",
          "beardMagestic",
          "beardMedium",
          "moustacheFancy",
          "moustacheMagnum"
        ]
      },
      "default": [
        "beardLight",
        "beardMagestic",
        "beardMedium",
        "moustacheFancy",
        "moustacheMagnum"
      ]
    },
    "facialHairColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "a55728",
        "2c1b18",
        "b58143",
        "d6b370",
        "724133",
        "4a312c",
        "f59797",
        "ecdcbf",
        "c93305",
        "e8e1e1"
      ]
    },
    "facialHairProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 10
    },
    "hairColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "a55728",
        "2c1b18",
        "b58143",
        "d6b370",
        "724133",
        "4a312c",
        "f59797",
        "ecdcbf",
        "c93305",
        "e8e1e1"
      ]
    },
    "hatColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "262e33",
        "65c9ff",
        "5199e4",
        "25557c",
        "e6e6e6",
        "929598",
        "3c4f5c",
        "b1e2ff",
        "a7ffc4",
        "ffdeb5",
        "ffafb9",
        "ffffb1",
        "ff488e",
        "ff5c5c",
        "ffffff"
      ]
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "concerned",
          "default",
          "disbelief",
          "eating",
          "grimace",
          "sad",
          "screamOpen",
          "serious",
          "smile",
          "tongue",
          "twinkle",
          "vomit"
        ]
      },
      "default": [
        "concerned",
        "default",
        "disbelief",
        "eating",
        "grimace",
        "sad",
        "screamOpen",
        "serious",
        "smile",
        "tongue",
        "twinkle",
        "vomit"
      ]
    },
    "nose": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "default"
        ]
      },
      "default": [
        "default"
      ]
    },
    "skinColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "614335",
        "d08b5b",
        "ae5d29",
        "edb98a",
        "ffdbb4",
        "fd9841",
        "f8d25c"
      ]
    },
    "style": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "circle",
          "default"
        ]
      },
      "default": [
        "default"
      ]
    },
    "top": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eyepatch",
          "hat",
          "hijab",
          "turban",
          "winterHat1",
          "winterHat02",
          "winterHat03",
          "winterHat04",
          "bob",
          "bun",
          "curly",
          "curvy",
          "dreads",
          "frida",
          "fro",
          "froBand",
          "longButNotTooLong",
          "miaWallace",
          "shavedSides",
          "straight02",
          "straight01",
          "straightAndStrand",
          "dreads01",
          "dreads02",
          "frizzle",
          "shaggy",
          "shaggyMullet",
          "shortCurly",
          "shortFlat",
          "shortRound",
          "shortWaved",
          "sides",
          "theCaesar",
          "theCaesarAndSidePart",
          "bigHair"
        ]
      },
      "default": [
        "eyepatch",
        "hat",
        "hijab",
        "turban",
        "winterHat1",
        "winterHat02",
        "winterHat03",
        "winterHat04",
        "bob",
        "bun",
        "curly",
        "curvy",
        "dreads",
        "frida",
        "fro",
        "froBand",
        "longButNotTooLong",
        "miaWallace",
        "shavedSides",
        "straight02",
        "straight01",
        "straightAndStrand",
        "dreads01",
        "dreads02",
        "frizzle",
        "shaggy",
        "shaggyMullet",
        "shortCurly",
        "shortFlat",
        "shortRound",
        "shortWaved",
        "sides",
        "theCaesar",
        "theCaesarAndSidePart",
        "bigHair"
      ]
    },
    "topProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 100
    }
  }
};
