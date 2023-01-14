/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
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
        "614335",
        "d08b5b",
        "ae5d29",
        "edb98a",
        "ffdbb4",
        "fd9841",
        "f8d25c"
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
    }
  }
};
