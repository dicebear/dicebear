import { ColorGroupSettings } from '../types';

export function setColorGroupSettings(frame: FrameNode, colorGroup: string, settings: ColorGroupSettings): void {
  frame.setPluginData(`colors/${colorGroup}/settings`, JSON.stringify(settings));
}
