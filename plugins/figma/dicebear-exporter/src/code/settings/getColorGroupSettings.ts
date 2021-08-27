import { ColorGroupSettings } from "../types";

export function getColorGroupSettings(colorGroup: string): ColorGroupSettings {
  return {
    defaults: {},
    ...JSON.parse(
      figma.root.getPluginData(`colors/${colorGroup}/settings`) || "{}"
    ),
  };
}
