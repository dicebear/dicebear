/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/oa0iScDLrh1tVFzSud2Dwc
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "body": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "squared",
          "rounded",
          "small",
          "checkered"
        ]
      },
      "default": [
        "squared",
        "rounded",
        "small",
        "checkered"
      ]
    },
    "clothingColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "456dff",
        "54d7c7",
        "7555ca",
        "6dbb58",
        "e24553",
        "f3b63a",
        "f55d81"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "open",
          "sleep",
          "wink",
          "glasses",
          "happy",
          "sunglasses"
        ]
      },
      "default": [
        "open",
        "sleep",
        "wink",
        "glasses",
        "happy",
        "sunglasses"
      ]
    },
    "facialHair": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "beardMustache",
          "pyramid",
          "walrus",
          "goatee",
          "shadow",
          "soulPatch"
        ]
      },
      "default": [
        "beardMustache",
        "pyramid",
        "walrus",
        "goatee",
        "shadow",
        "soulPatch"
      ]
    },
    "facialHairProbability": {
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
          "long",
          "sideShave",
          "shortCombover",
          "curlyHighTop",
          "bobCut",
          "curly",
          "pigtails",
          "curlyBun",
          "buzzcut",
          "bobBangs",
          "bald",
          "balding",
          "cap",
          "bunUndercut",
          "fade",
          "beanie",
          "straightBun",
          "extraLong",
          "shortComboverChops",
          "mohawk"
        ]
      },
      "default": [
        "long",
        "sideShave",
        "shortCombover",
        "curlyHighTop",
        "bobCut",
        "curly",
        "pigtails",
        "curlyBun",
        "buzzcut",
        "bobBangs",
        "bald",
        "balding",
        "cap",
        "bunUndercut",
        "fade",
        "beanie",
        "straightBun",
        "extraLong",
        "shortComboverChops",
        "mohawk"
      ]
    },
    "hairColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "362c47",
        "6c4545",
        "e15c66",
        "e16381",
        "f27d65",
        "f29c65",
        "dee1f5"
      ]
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "smile",
          "frown",
          "surprise",
          "pacifier",
          "bigSmile",
          "smirk",
          "lips"
        ]
      },
      "default": [
        "smile",
        "frown",
        "surprise",
        "pacifier",
        "bigSmile",
        "smirk",
        "lips"
      ]
    },
    "nose": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "mediumRound",
          "smallRound",
          "wrinkles"
        ]
      },
      "default": [
        "mediumRound",
        "smallRound",
        "wrinkles"
      ]
    },
    "skinColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "eeb4a4",
        "e7a391",
        "e5a07e",
        "d78774",
        "b16a5b",
        "92594b",
        "623d36"
      ]
    }
  }
};
