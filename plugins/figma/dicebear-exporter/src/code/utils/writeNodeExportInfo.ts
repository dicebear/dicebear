import { INode } from 'svgson';
import { NodeExportInfo } from '../types';
import { decodeNodeNameData } from './decodeNodeNameData';
import { encodeNodeNameData } from './encodeNodeNameData';
import { decodeHtmlEntitites } from './decodeHtmlEntities';
import { encodeHtmlEntities } from './encodeHtmlEntities';

export function writeNodeExportInfo(node: PageNode | SceneNode | INode, exportInfo: NodeExportInfo | null): void {
  if ('attributes' in node) {
    const nodeNameData = decodeNodeNameData(decodeHtmlEntitites(node.attributes.id ?? ''));

    if (exportInfo !== null) {
      nodeNameData.set('_export', JSON.stringify(exportInfo));
    } else {
      nodeNameData.delete('_export');
    }

    node.attributes.id = encodeHtmlEntities(encodeNodeNameData(nodeNameData));

    if (node.attributes.id === '') {
      delete node.attributes.id;
    }
  } else {
    const nodeNameData = decodeNodeNameData(node.name);

    if (exportInfo !== null) {
      nodeNameData.set('_export', JSON.stringify(exportInfo));
    } else {
      nodeNameData.delete('_export');
    }

    node.name = encodeNodeNameData(nodeNameData);
  }
}
