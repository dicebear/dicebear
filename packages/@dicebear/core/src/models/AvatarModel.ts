import type { DefinitionMetadata } from '../types.js';
import { ColorModel } from '../models/ColorModel.js';

export class AvatarModel {
  constructor(
    private readonly svg: string,
    private readonly metadata: Exclude<DefinitionMetadata, undefined>,
    private readonly properties: [string, unknown][],
  ) {
    this.svg = svg;
    this.metadata = metadata;
    this.properties = properties;
  }

  toString(): string {
    return this.svg;
  }

  toDataUri(): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(this.svg)}`;
  }

  toJson(): string {
    return JSON.stringify(
      {
        svg: this.svg,
        metadata: this.metadata,
        properties: this.properties,
      },
      (k, v) => (v instanceof ColorModel ? v.getHex() : v),
    );
  }
}
