// @ts-ignore
import { optimize } from 'svgo/dist/svgo.browser.js';
import { normalizeName } from '../utils/normalizeName';
import { applyNodeExportInfo } from './applyNodeExportInfo';
import { calculateNodeExportInfo } from './calculateNodeExportInfo';

export async function createTemplateString(node: FrameNode | ComponentNode) {
  // Calculate the export info for the node and export to svg
  let result = await calculateNodeExportInfo(node);

  // Apply export info to svg
  result = await applyNodeExportInfo(result);

  // Optimize the svg
  result = optimize(result, {
    js2svg: {
      indent: 2,
      pretty: true,
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupIDs: {
              prefix: normalizeName(node.name) + '-',
            },
          },
        },
      },
      // The default preset includes this plugin, but executes it too early.
      // Therefore repeated at this point, so that really all unnecessary groups are removed.
      'collapseGroups',
    ],
  }).data.trim();

  // Remove svg tag
  result = result.replace(/(^<svg.*?>|<\/svg>$)/gi, '');

  // Escape template string characters
  result = result.replace(/(\\|\$|\`)/g, '$1');

  // Replace colors
  result = result.replace(/color::([a-z0-9]*)/gi, '${colors.$1.value}');

  // Replace components
  result = result.replace(/component::([a-z0-9]*)/gi, "${components.$1?.value(components, colors) ?? ''}");

  return '`' + result + '`';
}
