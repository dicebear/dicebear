import { findAllInstanceNodes } from '../queries/findAllInstanceNodes';
import { findAllNodesWithColor } from '../queries/findAllNodesWithColor';
import { fastFindAll } from '../utils/fastFindAll';
import { getColorsByNode } from '../utils/getColorsByNode';
import { getNameParts } from '../utils/getNameParts';
import { readNodeExportInfo } from '../utils/readNodeExportInfo';
import { writeNodeExportInfo } from '../utils/writeNodeExportInfo';

export async function calculateNodeExportInfo(node: ComponentNode | FrameNode) {
  const cloneComponent = figma.createComponent();
  const cloneComponentRectangle = figma.createRectangle();

  cloneComponentRectangle.constraints = {
    horizontal: 'STRETCH',
    vertical: 'STRETCH',
  };

  cloneComponent.name = 'Export Helper Component';
  cloneComponent.insertChild(0, cloneComponentRectangle);

  const nodeClone = node.clone();

  try {
    // For the export, clip-path must be set in Figma so that the viewport has the correct height and width.
    nodeClone.clipsContent = true;

    for (const instanceNode of findAllInstanceNodes(nodeClone)) {
      const mainComponent = instanceNode.mainComponent!;

      const nodeExportInfo = readNodeExportInfo(instanceNode);

      nodeExportInfo.matrix = {
        a: instanceNode.relativeTransform[0][0],
        b: instanceNode.relativeTransform[1][0],
        c: instanceNode.relativeTransform[0][1],
        d: instanceNode.relativeTransform[1][1],
        tx: instanceNode.relativeTransform[0][2],
        ty: instanceNode.relativeTransform[1][2],
      };

      nodeExportInfo.scale = {
        x: instanceNode.width / mainComponent.width,
        y: instanceNode.height / mainComponent.height,
      };

      nodeExportInfo.componentGroup = getNameParts(mainComponent.name).group;

      const width = instanceNode.width;
      const height = instanceNode.height;

      instanceNode.swapComponent(cloneComponent);
      instanceNode.resize(width, height);

      writeNodeExportInfo(instanceNode, nodeExportInfo);
    }

    // Figma flat boolean nodes when exporting. In doing so, ids and their information will be lost.
    // That's why we do it ourselves here, so Figma can't delete any information.
    for (const boNode of fastFindAll(nodeClone.children, (node) => node.type == 'BOOLEAN_OPERATION' && node.visible)) {
      try {
        const wasMask = 'isMask' in boNode && boNode.isMask;
        const newNode = figma.flatten([boNode], boNode.parent!, boNode.parent!.children.indexOf(boNode as SceneNode));

        newNode.isMask = wasMask;
      } catch {
        // This is fine
      }
    }

    for (const colorNode of findAllNodesWithColor(nodeClone)) {
      const nodeExportInfo = readNodeExportInfo(colorNode);
      const nodeColors = getColorsByNode(colorNode);

      if (nodeColors.has('fill')) {
        nodeExportInfo.fillColorGroup = getNameParts(nodeColors.get('fill')!.name).group;
      }

      if (nodeColors.has('stroke')) {
        nodeExportInfo.strokeColorGroup = getNameParts(nodeColors.get('stroke')!.name).group;
      }

      writeNodeExportInfo(colorNode, nodeExportInfo);
    }

    const codes = await nodeClone.exportAsync({
      format: 'SVG',
      contentsOnly: true,
      svgIdAttribute: true,
    });

    nodeClone.remove();
    cloneComponent.remove();

    let svg = '';

    for (var i = 0; i < codes.byteLength; i++) {
      svg += String.fromCharCode(codes[i]);
    }

    return svg;
  } catch (e) {
    nodeClone.remove();
    cloneComponent.remove();

    if (e && typeof e === 'object' && 'message' in e) {
      throw new Error(`Error while exporting ${nodeClone.name}: ${(e as any).message}`);
    } else {
      throw e;
    }
  }
}
