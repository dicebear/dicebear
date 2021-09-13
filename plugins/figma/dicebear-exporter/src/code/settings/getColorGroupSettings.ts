import { ColorGroupSettings } from '../types';

export function getColorGroupSettings(frame: FrameNode, colorGroup: string): ColorGroupSettings {
  return {
    defaults: {},
    ...JSON.parse(frame.getPluginData(`colors/${colorGroup}/settings`) || '{}'),
  };
}
