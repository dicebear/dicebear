import { ComponentGroupSettings } from '../types';

export function setComponentGroupSettings(
  frame: FrameNode,
  componentGroup: string,
  settings: ComponentGroupSettings
): void {
  frame.setPluginData(`components/${componentGroup}/settings`, JSON.stringify(settings));
}
