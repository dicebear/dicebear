/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "baseColor": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-fA-F0-9]{6}$"
      },
      "default": [
        "ffb300",
        "1e88e5",
        "546e7a",
        "6d4c41",
        "00acc1",
        "f4511e",
        "5e35b1",
        "43a047",
        "757575",
        "3949ab",
        "039be5",
        "7cb342",
        "c0ca33",
        "fb8c00",
        "d81b60",
        "8e24aa",
        "e53935",
        "00897b",
        "fdd835"
      ]
    },
    "eyes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "bulging",
          "dizzy",
          "eva",
          "frame1",
          "frame2",
          "glow",
          "happy",
          "hearts",
          "robocop",
          "round",
          "roundFrame01",
          "roundFrame02",
          "sensor",
          "shade01"
        ]
      },
      "default": [
        "bulging",
        "dizzy",
        "eva",
        "frame1",
        "frame2",
        "glow",
        "happy",
        "hearts",
        "robocop",
        "round",
        "roundFrame01",
        "roundFrame02",
        "sensor",
        "shade01"
      ]
    },
    "face": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "round01",
          "round02",
          "square01",
          "square02",
          "square03",
          "square04"
        ]
      },
      "default": [
        "round01",
        "round02",
        "square01",
        "square02",
        "square03",
        "square04"
      ]
    },
    "mouth": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "bite",
          "diagram",
          "grill01",
          "grill02",
          "grill03",
          "smile01",
          "smile02",
          "square01",
          "square02"
        ]
      },
      "default": [
        "bite",
        "diagram",
        "grill01",
        "grill02",
        "grill03",
        "smile01",
        "smile02",
        "square01",
        "square02"
      ]
    },
    "mouthProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 100
    },
    "sides": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "antenna01",
          "antenna02",
          "cables01",
          "cables02",
          "round",
          "square",
          "squareAssymetric"
        ]
      },
      "default": [
        "antenna01",
        "antenna02",
        "cables01",
        "cables02",
        "round",
        "square",
        "squareAssymetric"
      ]
    },
    "sidesProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 100
    },
    "texture": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "camo01",
          "camo02",
          "circuits",
          "dirty01",
          "dirty02",
          "dots",
          "grunge01",
          "grunge02"
        ]
      },
      "default": [
        "camo01",
        "camo02",
        "circuits",
        "dirty01",
        "dirty02",
        "dots",
        "grunge01",
        "grunge02"
      ]
    },
    "textureProbability": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 50
    },
    "top": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "antenna",
          "antennaCrooked",
          "bulb01",
          "glowingBulb01",
          "glowingBulb02",
          "horns",
          "lights",
          "pyramid",
          "radar"
        ]
      },
      "default": [
        "antenna",
        "antennaCrooked",
        "bulb01",
        "glowingBulb01",
        "glowingBulb02",
        "horns",
        "lights",
        "pyramid",
        "radar"
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
