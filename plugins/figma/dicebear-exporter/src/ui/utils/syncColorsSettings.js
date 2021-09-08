import isEqual from 'deep-equal';

export function syncColorsSettings(newColors, oldColors) {
  for (const key in newColors) {
    if (false === newColors.hasOwnProperty(key)) {
      continue;
    }

    if (false === isEqual(newColors[key].settings, oldColors[key]?.settings)) {
      parent.postMessage(
        {
          pluginMessage: {
            type: `set:colors:${key}`,
            data: newColors[key].settings,
          },
        },
        '*'
      );
    }
  }
}
