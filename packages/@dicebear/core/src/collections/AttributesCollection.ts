import { ViewBox } from '../types.js';
import { AbstractCollection } from './AbstractCollection.js';

export class AttributesCollection extends AbstractCollection {
  protected readonly collection: Map<string, string> = new Map();

  protected viewBox?: ViewBox;

  set(name: string, value: string): void {
    this.collection.set(name, value);
  }

  getViewBox(): ViewBox {
    if (!this.viewBox) {
      const viewBox = this.getString('viewBox');

      const [x, y, width, height] = viewBox
        .split(' ')
        .map((value) => Number(value));

      this.viewBox = { x, y, width, height };
    }

    return this.viewBox;
  }
}
