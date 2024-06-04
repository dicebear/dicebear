import { ViewBox } from '../types.js';
import { AbstractCollection } from './AbstractCollection.js';

export class AttributesCollection extends AbstractCollection {
  protected readonly collection: Map<string, string> = new Map();

  set(name: string, value: string): void {
    this.collection.set(name, value);
  }

  getViewBox(): ViewBox {
    const viewBox = this.getString('viewBox');

    const [x, y, width, height] = viewBox
      .split(' ')
      .map((value) => Number(value));

    return { x, y, width, height };
  }
}
