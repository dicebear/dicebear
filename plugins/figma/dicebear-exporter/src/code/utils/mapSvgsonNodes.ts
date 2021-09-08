import type { INode } from 'svgson';

export function mapSvgsonNodes(node: INode, cb: (value: INode) => INode) {
  const result = cb({ ...node });

  for (const key in result.children) {
    if (false === result.children.hasOwnProperty(key)) {
      continue;
    }

    result.children[key] = mapSvgsonNodes(result.children[key], cb);
  }

  return result;
}
