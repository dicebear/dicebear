import { PropertiesCollection } from '../collections/PropertiesCollection.js';
import { StyleModel } from '../models/StyleModel.js';
import type { Dependencies } from '../types.js';

export class DependencyHelper {
  static getFromSvg(svg: string): Dependencies {
    const dependencies: Dependencies = {
      components: new Set(),
      colors: new Set(),
    };

    const matches = svg.matchAll(/#(component|color)-([a-z0-9-]+)/gi);

    for (const match of matches) {
      if (match[1] === 'component') {
        dependencies.components.add(match[2]);
      } else if (match[1] === 'color') {
        dependencies.colors.add(match[2]);
      }
    }

    return dependencies;
  }

  static getFromProperties(
    style: StyleModel,
    properties: PropertiesCollection,
  ): Dependencies {
    const bodyDependencies = style.getBodyDependencies();

    const dependencies: Dependencies = {
      components: new Set(bodyDependencies.components),
      colors: new Set(bodyDependencies.colors),
    };

    const unprocessed = [...bodyDependencies.components];

    while (unprocessed.length > 0) {
      const component = unprocessed.pop()!;
      const componentValue = properties.get(component);

      // May not be a string if hidden component.
      if (typeof componentValue !== 'string') {
        continue;
      }

      const componentValueDependencies = style.getComponentValueDependencies(
        component,
        componentValue,
      )!;

      for (const dependency of componentValueDependencies.components) {
        if (dependencies.components.has(dependency)) {
          continue;
        }

        dependencies.components.add(dependency);
        unprocessed.push(dependency);
      }

      for (const dependency of componentValueDependencies.colors) {
        dependencies.colors.add(dependency);
      }
    }

    return dependencies;
  }
}
