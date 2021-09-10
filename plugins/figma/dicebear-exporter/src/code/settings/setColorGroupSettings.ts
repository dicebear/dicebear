import { ColorGroupSettings } from '../types';

export function setColorGroupSettings(colorGroup: string, settings: ColorGroupSettings): void {
  figma.root.setPluginData(`colors/${colorGroup}/settings`, JSON.stringify(settings));
}
