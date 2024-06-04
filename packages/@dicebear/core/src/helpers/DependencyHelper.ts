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
}
