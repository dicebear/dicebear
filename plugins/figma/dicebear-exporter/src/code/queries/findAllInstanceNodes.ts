import { fastFindAll } from '../utils/fastFindAll';
import { isSupportedComponent } from '../utils/isSupportedComponent';

export function findAllInstanceNodes(node?: ChildrenMixin): InstanceNode[] {
  return fastFindAll(
    (node ?? figma.root).children,
    (v) => v !== undefined && v.type === 'INSTANCE' && null !== v.mainComponent && isSupportedComponent(v.mainComponent)
  ) as InstanceNode[];
}
