import { Options, StyleOptions } from '../types.js';
import { AbstractCollection } from './AbstractCollection.js';

export class OptionsCollection<
  S extends StyleOptions = StyleOptions,
> extends AbstractCollection {
  protected readonly collection: Map<string, unknown>;

  constructor(options: Partial<Options<S>>) {
    super();

    this.collection = new Map(Object.entries(options));
  }
}
