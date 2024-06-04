import type { ObjectSchema } from 'superstruct/dist/utils';
import {
  Struct,
  array,
  assign,
  defaulted,
  enums,
  integer,
  nonempty,
  object,
} from 'superstruct';
import { Types } from '../structs/Types.js';
import { BaseOptionsStruct } from '../structs/BaseOptionsStruct.js';
import { StyleModel } from '../models/StyleModel.js';

export class StructHelper {
  static createOptionsStruct(
    style: StyleModel,
  ): Struct<{ [x: string]: unknown }, ObjectSchema> {
    const struct = assign(
      BaseOptionsStruct,
      this.createColorsOptionsStruct(style),
      this.createComponentsOptionsStruct(style),
    );

    return struct;
  }

  static createColorsOptionsStruct(
    style: StyleModel,
  ): Struct<{ [x: string]: unknown }, ObjectSchema> {
    return object(
      style.getColors().reduce((acc, color) => {
        const colorValue = defaulted(array(Types.color()), color.values);

        if (color.name === 'background') {
          acc[`${color.name}Color`] = colorValue;
        } else {
          acc[`${color.name}Color`] = nonempty(colorValue);
        }

        return acc;
      }, {} as ObjectSchema),
    );
  }

  static createComponentsOptionsStruct(
    style: StyleModel,
  ): Struct<{ [x: string]: unknown }, ObjectSchema> {
    return object(
      style.getComponents().reduce((acc, component) => {
        const { name, values, probability, rotation, offset } = component;

        const componentNameList = values.map((v) => v.name);
        const componentDefaultList = values
          .filter((v) => v.default)
          .map((v) => v.name);

        acc[name] = defaulted(
          array(enums(componentNameList)),
          componentDefaultList,
        );

        if (probability) {
          acc[`${name}Probability`] = defaulted(integer(), probability);
        }

        if (rotation) {
          acc[`${name}Rotation`] = defaulted(
            nonempty(array(Types.rotation())),
            rotation,
          );
        }

        if (offset) {
          const OffsetType = nonempty(array(integer()));

          if (offset.x) {
            acc[`${name}OffsetX`] = defaulted(OffsetType, offset.x);
          }

          if (offset.y) {
            acc[`${name}OffsetY`] = defaulted(OffsetType, offset.y);
          }
        }

        return acc;
      }, {} as ObjectSchema),
    );
  }
}
