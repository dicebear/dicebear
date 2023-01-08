/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/TArMPV7hXUhdCbfEFs3Pfm
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
          "eyepatch",
          "glasses",
          "glasses2",
          "glasses3",
          "glasses4",
          "glasses5",
          "sunglasses",
          "sunglasses2"
        ]
      },
      "default": [
        "eyepatch",
        "glasses",
        "glasses2",
        "glasses3",
        "glasses4",
        "glasses5",
        "sunglasses",
        "sunglasses2"
      ]
    },
    "accessoriesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 20
    },
    "clothingColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "e78276",
        "ffcf77",
        "fdea6b",
        "78e185",
        "9ddadb",
        "8fa7df",
        "e279c7"
      ]
    },
    "face": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "angryWithFang",
          "awe",
          "blank",
          "calm",
          "cheeky",
          "concerned",
          "concernedFear",
          "contempt",
          "cute",
          "cyclops",
          "driven",
          "eatingHappy",
          "explaining",
          "eyesClosed",
          "fear",
          "hectic",
          "lovingGrin1",
          "lovingGrin2",
          "monster",
          "old",
          "rage",
          "serious",
          "smile",
          "smileBig",
          "smileLOL",
          "smileTeethGap",
          "solemn",
          "suspicious",
          "tired",
          "veryAngry"
        ]
      },
      "default": [
        "angryWithFang",
        "awe",
        "blank",
        "calm",
        "cheeky",
        "concerned",
        "concernedFear",
        "contempt",
        "cute",
        "cyclops",
        "driven",
        "eatingHappy",
        "explaining",
        "eyesClosed",
        "fear",
        "hectic",
        "lovingGrin1",
        "lovingGrin2",
        "monster",
        "old",
        "rage",
        "serious",
        "smile",
        "smileBig",
        "smileLOL",
        "smileTeethGap",
        "solemn",
        "suspicious",
        "tired",
        "veryAngry"
      ]
    },
    "facialHair": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "chin",
          "full",
          "full2",
          "full3",
          "full4",
          "goatee1",
          "goatee2",
          "moustache1",
          "moustache2",
          "moustache3",
          "moustache4",
          "moustache5",
          "moustache6",
          "moustache7",
          "moustache8",
          "moustache9"
        ]
      },
      "default": [
        "chin",
        "full",
        "full2",
        "full3",
        "full4",
        "goatee1",
        "goatee2",
        "moustache1",
        "moustache2",
        "moustache3",
        "moustache4",
        "moustache5",
        "moustache6",
        "moustache7",
        "moustache8",
        "moustache9"
      ]
    },
    "facialHairProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 10
    },
    "head": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "afro",
          "bangs",
          "bangs2",
          "bantuKnots",
          "bear",
          "bun",
          "bun2",
          "buns",
          "cornrows",
          "cornrows2",
          "dreads1",
          "dreads2",
          "flatTop",
          "flatTopLong",
          "grayBun",
          "grayMedium",
          "grayShort",
          "hatBeanie",
          "hatHip",
          "hijab",
          "long",
          "longAfro",
          "longBangs",
          "longCurly",
          "medium1",
          "medium2",
          "medium3",
          "mediumBangs",
          "mediumBangs2",
          "mediumBangs3",
          "mediumStraight",
          "mohawk",
          "mohawk2",
          "noHair1",
          "noHair2",
          "noHair3",
          "pomp",
          "shaved1",
          "shaved2",
          "shaved3",
          "short1",
          "short2",
          "short3",
          "short4",
          "short5",
          "turban",
          "twists",
          "twists2"
        ]
      },
      "default": [
        "afro",
        "bangs",
        "bangs2",
        "bantuKnots",
        "bear",
        "bun",
        "bun2",
        "buns",
        "cornrows",
        "cornrows2",
        "dreads1",
        "dreads2",
        "flatTop",
        "flatTopLong",
        "grayBun",
        "grayMedium",
        "grayShort",
        "hatBeanie",
        "hatHip",
        "hijab",
        "long",
        "longAfro",
        "longBangs",
        "longCurly",
        "medium1",
        "medium2",
        "medium3",
        "mediumBangs",
        "mediumBangs2",
        "mediumBangs3",
        "mediumStraight",
        "mohawk",
        "mohawk2",
        "noHair1",
        "noHair2",
        "noHair3",
        "pomp",
        "shaved1",
        "shaved2",
        "shaved3",
        "short1",
        "short2",
        "short3",
        "short4",
        "short5",
        "turban",
        "twists",
        "twists2"
      ]
    },
    "headContrastColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "2c1b18",
        "e8e1e1",
        "ecdcbf",
        "d6b370",
        "f59797",
        "b58143",
        "a55728",
        "724133",
        "4a312c",
        "c93305"
      ]
    },
    "mask": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "medicalMask",
          "respirator"
        ]
      },
      "default": [
        "medicalMask",
        "respirator"
      ]
    },
    "maskProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 5
    },
    "skinColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "ffdbb4",
        "edb98a",
        "d08b5b",
        "ae5d29",
        "694d3d"
      ]
    }
  }
};
