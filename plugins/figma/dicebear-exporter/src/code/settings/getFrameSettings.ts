import { FrameSettings } from "../types";

export function getFrameSettings(frame: FrameNode): FrameSettings {
  const data: FrameSettings = {
    umdName: "",
    packageName: "",
    packageVersion: "",
    title: "",
    creator: "",
    contributor: "",
    source: "",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    ...JSON.parse(frame.getPluginData(`settings`) || "{}"),
  };

  if (!data.title) {
    data.title = "My Avatar Style";
  }

  if (!data.umdName) {
    data.umdName = "DiceBear.MyAvatarStyle";
  }

  if (!data.packageName) {
    data.packageName = "@dicebear/my-avatar-style";
  }

  if (!data.packageVersion) {
    data.packageVersion = "1.0.0";
  }

  return data;
}
