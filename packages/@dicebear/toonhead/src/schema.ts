/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "backhair": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "longStraight",
          "longWavy",
          "shoulderHigh",
          "neckHigh"
        ]
      },
      "default": [
        "longStraight",
        "longWavy",
        "shoulderHigh",
        "neckHigh"
      ]
    },
    "backhairProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 50
    },
    "beards": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "moustacheTwirl",
          "fullbeard",
          "chin",
          "chinMoustache",
          "longbeard"
        ]
      },
      "default": [
        "moustacheTwirl",
        "fullbeard",
        "chin",
        "chinMoustache",
        "longbeard"
      ]
    },
    "beardsProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 50
    },
    "body": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "body"
        ]
      },
      "default": [
        "body"
      ]
    },
    "clothes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "turtleNeck",
          "openJacket",
          "dress",
          "shirt",
          "tShirt"
        ]
      },
      "default": [
        "turtleNeck",
        "openJacket",
        "dress",
        "shirt",
        "tShirt"
      ]
    },
    "clothesColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "545454",
        "b11f1f",
        "0b3286",
        "147f3c",
        "eab308",
        "731ac3",
        "ec4899",
        "f97316",
        "151613",
        "e8e9e6"
      ]
    },
    "eyebrows": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "raised",
          "angry",
          "happy",
          "sad",
          "neutral"
        ]
      },
      "default": [
        "raised",
        "angry",
        "happy",
        "sad",
        "neutral"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "happy",
          "wide",
          "bow",
          "humble",
          "wink"
        ]
      },
      "default": [
        "happy",
        "wide",
        "bow",
        "humble",
        "wink"
      ]
    },
    "hair": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "sideComed",
          "undercut",
          "spiky",
          "bun"
        ]
      },
      "default": [
        "sideComed",
        "undercut",
        "spiky",
        "bun"
      ]
    },
    "hairColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "2c1b18",
        "a55728",
        "b58143",
        "d6b370",
        "724133"
      ]
    },
    "head": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "head"
        ]
      },
      "default": [
        "head"
      ]
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "laugh",
          "angry",
          "agape",
          "smile",
          "sad"
        ]
      },
      "default": [
        "laugh",
        "angry",
        "agape",
        "smile",
        "sad"
      ]
    },
    "skinColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "f1c3a5",
        "c68e7a",
        "b98e6a",
        "a36b4f",
        "5c3829"
      ]
    }
  }
};
