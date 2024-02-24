/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "ring": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "container"
        ]
      },
      "default": [
        "container"
      ]
    },
    "ringColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "ffd54f",
        "64b5f6",
        "4dd0e1",
        "ff8a65",
        "9575cd",
        "81c784",
        "7986cb",
        "4fc3f7",
        "aed581",
        "dce775",
        "ffb74d",
        "f06292",
        "ba68c8",
        "e57373",
        "4db6ac",
        "fff176"
      ]
    },
    "ringFive": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eighth",
          "quarter",
          "half",
          "full"
        ]
      },
      "default": [
        "full"
      ]
    },
    "ringFiveRotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "maxItems": 2,
      "default": [
        -180,
        180
      ]
    },
    "ringFour": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eighth",
          "quarter",
          "half",
          "full"
        ]
      },
      "default": [
        "quarter",
        "half"
      ]
    },
    "ringFourRotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "maxItems": 2,
      "default": [
        -180,
        180
      ]
    },
    "ringOne": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "half",
          "quarter",
          "eighth",
          "full"
        ]
      },
      "default": [
        "half",
        "quarter"
      ]
    },
    "ringOneRotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "maxItems": 2,
      "default": [
        -180,
        180
      ]
    },
    "ringRotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "maxItems": 2,
      "default": [
        -180,
        180
      ]
    },
    "ringThree": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eighth",
          "quarter",
          "half",
          "full"
        ]
      },
      "default": [
        "quarter",
        "half"
      ]
    },
    "ringThreeRotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "maxItems": 2,
      "default": [
        -180,
        180
      ]
    },
    "ringTwo": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eighth",
          "quarter",
          "half",
          "full"
        ]
      },
      "default": [
        "quarter",
        "half"
      ]
    },
    "ringTwoRotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "maxItems": 2,
      "default": [
        -180,
        180
      ]
    }
  }
};
