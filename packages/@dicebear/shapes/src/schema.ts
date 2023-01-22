/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic/%40dicebear%2Fshapes
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
        "0a5b83",
        "1c799f",
        "69d2e7",
        "f1f4dc",
        "f88c49"
      ]
    },
    "shape1": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "rectangle",
          "rectangleFilled",
          "ellipseFilled",
          "ellipse",
          "polygonFilled",
          "polygon",
          "line"
        ]
      },
      "default": [
        "rectangleFilled",
        "ellipseFilled",
        "polygonFilled"
      ]
    },
    "shape1Color": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "0a5b83",
        "1c799f",
        "69d2e7",
        "f1f4dc",
        "f88c49"
      ]
    },
    "shape1OffsetX": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -35,
        "maximum": 35
      },
      "default": [
        -35,
        35
      ]
    },
    "shape1OffsetY": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -35,
        "maximum": 35
      },
      "default": [
        -35,
        35
      ]
    },
    "shape1Rotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -160,
        "maximum": 160
      },
      "default": [
        -160,
        160
      ]
    },
    "shape2": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "rectangle",
          "rectangleFilled",
          "ellipseFilled",
          "ellipse",
          "polygonFilled",
          "polygon",
          "line"
        ]
      },
      "default": [
        "rectangle",
        "rectangleFilled",
        "ellipseFilled",
        "ellipse",
        "polygonFilled",
        "polygon",
        "line"
      ]
    },
    "shape2Color": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "0a5b83",
        "1c799f",
        "69d2e7",
        "f1f4dc",
        "f88c49"
      ]
    },
    "shape2OffsetX": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -25,
        "maximum": 25
      },
      "default": [
        -25,
        25
      ]
    },
    "shape2OffsetY": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -25,
        "maximum": 25
      },
      "default": [
        -25,
        25
      ]
    },
    "shape2Rotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "default": [
        -180,
        180
      ]
    },
    "shape3": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "rectangle",
          "rectangleFilled",
          "ellipseFilled",
          "ellipse",
          "polygonFilled",
          "polygon",
          "line"
        ]
      },
      "default": [
        "rectangle",
        "rectangleFilled",
        "ellipseFilled",
        "ellipse",
        "polygonFilled",
        "polygon",
        "line"
      ]
    },
    "shape3Color": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^(transparent|[a-fA-F0-9]{6})$"
      },
      "default": [
        "0a5b83",
        "1c799f",
        "69d2e7",
        "f1f4dc",
        "f88c49"
      ]
    },
    "shape3OffsetX": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -25,
        "maximum": 25
      },
      "default": [
        -25,
        25
      ]
    },
    "shape3OffsetY": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -25,
        "maximum": 25
      },
      "default": [
        -25,
        25
      ]
    },
    "shape3Rotation": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": -180,
        "maximum": 180
      },
      "default": [
        -180,
        180
      ]
    }
  }
};
