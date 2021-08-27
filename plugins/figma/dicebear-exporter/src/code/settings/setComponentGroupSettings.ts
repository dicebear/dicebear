import { ComponentGroupSettings } from "../types";

export function setComponentGroupSettings(
  componentGroup: string,
  settings: ComponentGroupSettings
): void {
  figma.root.setPluginData(
    `components/${componentGroup}/settings`,
    JSON.stringify(settings)
  );
}
