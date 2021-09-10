import { INode } from 'svgson';
import { NodeExportInfo } from '../types';
import { decodeNodeNameData } from './decodeNodeNameData';
import { decodeHtmlEntitites } from './decodeHtmlEntities';

export function readNodeExportInfo(node: PageNode | SceneNode | INode): NodeExportInfo {
  const nodeNameData =
    'attributes' in node
      ? decodeNodeNameData(decodeHtmlEntitites(node.attributes.id ?? ''))
      : decodeNodeNameData(node.name);

  return JSON.parse(nodeNameData.get('_export') ?? '{}');
}
