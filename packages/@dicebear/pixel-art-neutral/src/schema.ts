/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "backgroundColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "ffdbac",
        "f5cfa0",
        "eac393",
        "e0b687",
        "cb9e6e",
        "b68655",
        "a26d3d",
        "8d5524"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
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
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "76778b",
        "697b94",
        "647b90",
        "5b7c8b",
        "588387",
        "876658"
      ]
    },
    "glasses": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "light07",
          "light06",
          "light05",
          "light04",
          "light03",
          "light02",
          "light01",
          "dark07",
          "dark06",
          "dark05",
          "dark04",
          "dark03",
          "dark02",
          "dark01"
        ]
      },
      "default": [
        "light07",
        "light06",
        "light05",
        "light04",
        "light03",
        "light02",
        "light01",
        "dark07",
        "dark06",
        "dark05",
        "dark04",
        "dark03",
        "dark02",
        "dark01"
      ]
    },
    "glassesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "4b4b4b",
        "323232",
        "191919",
        "43677d",
        "5f705c",
        "a04b5d"
      ]
    },
    "glassesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 10
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "sad10",
          "sad09",
          "sad08",
          "sad07",
          "sad06",
          "sad05",
          "sad04",
          "sad03",
          "sad02",
          "sad01",
          "happy13",
          "happy12",
          "happy11",
          "happy10",
          "happy09",
          "happy08",
          "happy07",
          "happy06",
          "happy05",
          "happy04",
          "happy03",
          "happy02",
          "happy01"
        ]
      },
      "default": [
        "sad10",
        "sad09",
        "sad08",
        "sad07",
        "sad06",
        "sad05",
        "sad04",
        "sad03",
        "sad02",
        "sad01",
        "happy13",
        "happy12",
        "happy11",
        "happy10",
        "happy09",
        "happy08",
        "happy07",
        "happy06",
        "happy05",
        "happy04",
        "happy03",
        "happy02",
        "happy01"
      ]
    },
    "mouthColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "d29985",
        "c98276",
        "e35d6a",
        "de0f0d"
      ]
    }
  }
};
