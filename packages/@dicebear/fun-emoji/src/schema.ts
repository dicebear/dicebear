/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/tyuOazZuFlU6tAF9xmJTSM
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
        "fcbc34",
        "d84be5",
        "d9915b",
        "f6d594",
        "059ff2",
        "71cf62"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "sad",
          "tearDrop",
          "pissed",
          "cute",
          "wink",
          "wink2",
          "plain",
          "glasses",
          "closed",
          "love",
          "stars",
          "shades",
          "closed2",
          "crying",
          "sleepClose"
        ]
      },
      "default": [
        "sad",
        "tearDrop",
        "pissed",
        "cute",
        "wink",
        "wink2",
        "plain",
        "glasses",
        "closed",
        "love",
        "stars",
        "shades",
        "closed2",
        "crying",
        "sleepClose"
      ]
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "plain",
          "lilSmile",
          "sad",
          "shy",
          "cute",
          "wideSmile",
          "shout",
          "smileTeeth",
          "smileLol",
          "pissed",
          "drip",
          "tongueOut",
          "kissHeart",
          "sick",
          "faceMask"
        ]
      },
      "default": [
        "plain",
        "lilSmile",
        "sad",
        "shy",
        "cute",
        "wideSmile",
        "shout",
        "smileTeeth",
        "smileLol",
        "pissed",
        "drip",
        "tongueOut",
        "kissHeart",
        "sick",
        "faceMask"
      ]
    }
  }
};
