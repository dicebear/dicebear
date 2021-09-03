import { FrameSettings } from '../types';

export function setFrameSettings(frame: FrameNode, settings: FrameSettings): void {
  frame.setPluginData(`settings`, JSON.stringify(settings));
}
