import isEqual from 'deep-equal';

export function syncFrameSettings(newSettings, oldSettings) {
  newSettings.packageName = newSettings.packageName.replace(/[^a-z0-9@\-\/]/gi, '');
  newSettings.packageVersion = newSettings.packageVersion.replace(/[^0-9\.]/gi, '');

  if (false === isEqual(newSettings, oldSettings)) {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set:frame',
          data: newSettings,
        },
      },
      '*'
    );
  }
}
