import { ComponentGroupSettings } from "../types";

export function getComponentGroupSettings(
  componentGroup: string
): ComponentGroupSettings {
  return {
    defaults: {},
    propability: null,
    ...JSON.parse(
      figma.root.getPluginData(`components/${componentGroup}/settings`) || "{}"
    ),
  };
}
