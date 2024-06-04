import { AttributesCollection } from '../collections/AttributesCollection';
import { StyleModel } from '../models/StyleModel';

export class AttributesHelper {
  static getAttributes(style: StyleModel, size?: number): AttributesCollection {
    const attributes = new AttributesCollection();

    // Define attributes from style
    for (const { name, value } of style.getAttributes()) {
      attributes.set(name, value);
    }

    // Set xmlns if not defined
    if (!attributes.has('xmlns')) {
      attributes.set('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Set viewBox if not defined
    if (!attributes.has('viewBox')) {
      attributes.set(
        'viewBox',
        `0 0 ${style.getBody().width} ${style.getBody().height}`,
      );
    }

    // Set width and height
    if (typeof size === 'number') {
      const { width, height } = attributes.getViewBox();
      const aspectRatio = width / height;

      const newWidth = aspectRatio > 1 ? size : size * aspectRatio;
      const newHeight = aspectRatio > 1 ? size / aspectRatio : size;

      attributes.set('width', newWidth.toString());
      attributes.set('height', newHeight.toString());
    }

    return attributes;
  }
}
