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
    "backgroundColor": {
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
    }
  }
};
