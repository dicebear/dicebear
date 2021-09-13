import { ComponentGroupSettings } from '../types';

export function getComponentGroupSettings(frame: FrameNode, componentGroup: string): ComponentGroupSettings {
  return {
    defaults: {},
    probability: null,
    ...JSON.parse(frame.getPluginData(`components/${componentGroup}/settings`) || '{}'),
  };
}
