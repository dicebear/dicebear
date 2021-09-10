import isEqual from 'deep-equal';

export function syncComponentsSettings(newComponents, oldComponents) {
  for (const key in newComponents) {
    if (false === newComponents.hasOwnProperty(key)) {
      continue;
    }

    let probability = parseInt(newComponents[key].settings.probability);

    if (isNaN(probability)) {
      probability = null;
    } else if (probability > 100) {
      probability = 100;
    } else if (probability < 0) {
      probability = 0;
    }

    newComponents[key].settings.probability = probability;

    if (false === isEqual(newComponents[key].settings, oldComponents[key]?.settings)) {
      parent.postMessage(
        {
          pluginMessage: {
            type: `set:components:${key}`,
            data: newComponents[key].settings,
          },
        },
        '*'
      );
    }
  }
}
