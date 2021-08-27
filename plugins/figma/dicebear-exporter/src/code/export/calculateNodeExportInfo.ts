import { findAllInstanceNodes } from "../queries/findAllInstanceNodes";
import { findAllNodesWithColor } from "../queries/findAllNodesWithColor";
import { getColorsByNode } from "../utils/getColorsByNode";
import { getNameParts } from "../utils/getNameParts";
import { readNodeExportInfo } from "../utils/readNodeExportInfo";
import { writeNodeExportInfo } from "../utils/writeNodeExportInfo";

export async function calculateNodeExportInfo(node: ComponentNode | FrameNode) {
  const cloneComponent = figma.createComponent();

  cloneComponent.name = "Export Helper Component";
  cloneComponent.appendChild(figma.createRectangle());

  const nodeClone = node.clone();

  try {
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

      instanceNode.mainComponent = cloneComponent;

      writeNodeExportInfo(instanceNode, nodeExportInfo);
    }

    for (const colorNode of findAllNodesWithColor(nodeClone)) {
      const nodeExportInfo = readNodeExportInfo(colorNode);
      const nodeColors = getColorsByNode(colorNode);

      if (nodeColors.has("fill")) {
        nodeExportInfo.fillColorGroup = getNameParts(
          nodeColors.get("fill")!.name
        ).group;
      }

      if (nodeColors.has("stroke")) {
        nodeExportInfo.strokeColorGroup = getNameParts(
          nodeColors.get("stroke")!.name
        ).group;
      }

      writeNodeExportInfo(colorNode, nodeExportInfo);
    }

    const codes = await nodeClone.exportAsync({
      format: "SVG",
      contentsOnly: true,
      svgIdAttribute: true,
    });

    nodeClone.remove();
    cloneComponent.remove();

    let svg = "";

    for (var i = 0; i < codes.byteLength; i++) {
      svg += String.fromCharCode(codes[i]);
    }

    return svg;
  } catch (e) {
    nodeClone.remove();
    cloneComponent.remove();

    throw e;
  }
}
