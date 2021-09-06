import { getColorsByNode } from '../utils/getColorsByNode';

export function findAllNodesWithColor(node?: ChildrenMixin) {
  return (node ?? figma.root).findAll((v) => getColorsByNode(v).size > 0);
}
