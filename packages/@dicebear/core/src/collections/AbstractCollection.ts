export abstract class AbstractCollection {
  protected abstract readonly collection: Map<string, unknown>;

  get(name: string): unknown {
    return this.collection.get(name);
  }

  has(name: string): boolean {
    return this.collection.has(name);
  }

  merge(properties: AbstractCollection): void {
    for (const [name, value] of properties.collection) {
      this.collection.set(name, value);
    }
  }

  all(): [string, unknown][] {
    return Array.from(this.collection.entries());
  }

  getString(name: string): string {
    const value = this.get(name);

    if (typeof value !== 'string') {
      throw new Error(`Property "${name}" must be a string`);
    }

    return value;
  }

  getBoolean(name: string): boolean {
    const value = this.get(name);

    if (typeof value !== 'boolean') {
      throw new Error(`Property "${name}" must be a boolean`);
    }

    return value;
  }

  getNumber(name: string): number {
    const value = this.get(name);

    if (typeof value !== 'number') {
      throw new Error(`Property "${name}" must be a number`);
    }

    return value;
  }

  getArray(name: string): unknown[] {
    const value = this.get(name);

    if (!Array.isArray(value)) {
      throw new Error(`Property "${name}" must be an array`);
    }

    return value;
  }
}
