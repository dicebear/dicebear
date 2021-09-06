import { FrameSettings } from '../types';

export function getFrameSettings(frame: FrameNode, colorGroups: string[]): FrameSettings {
  const titlePlaceholder = 'My Avatar Style';

  const data: FrameSettings = {
    packageName: '',
    packageVersion: '',
    title: '',
    creator: '',
    contributor: '',
    sourceTitle: '',
    source: '',
    licenseName: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    shapeRendering: 'auto',
    backgroundColorGroupName: '',
    onPreCreateHook: '',
    onPostCreateHook: '',
    precision: 3,
    ...JSON.parse(frame.getPluginData(`settings`) || '{}'),
  };

  if (!data.title) {
    data.title = titlePlaceholder;
  }

  if (!data.sourceTitle || data.sourceTitle === titlePlaceholder) {
    data.sourceTitle = data.title;
  }

  if (!data.packageName) {
    data.packageName = '@dicebear/my-avatar-style';
  }

  if (!data.packageVersion) {
    data.packageVersion = '1.0.0';
  }

  if (false === colorGroups.includes(data.backgroundColorGroupName)) {
    data.backgroundColorGroupName = '';
  }

  return data;
}
