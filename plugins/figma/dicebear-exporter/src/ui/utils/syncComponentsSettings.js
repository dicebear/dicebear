import isEqual from "deep-equal";

export function syncComponentsSettings(newComponents, oldComponents) {
  for (const key in newComponents) {
    if (false === newComponents.hasOwnProperty(key)) {
      continue;
    }

    let propability = parseInt(newComponents[key].settings.propability);

    if (isNaN(propability)) {
      propability = null;
    } else if (propability > 100) {
      propability = 100;
    } else if (propability < 0) {
      propability = 0;
    }

    newComponents[key].settings.propability = propability;

    if (
      false ===
      isEqual(newComponents[key].settings, oldComponents[key]?.settings)
    ) {
      parent.postMessage(
        {
          pluginMessage: {
            type: `set:components:${key}`,
            data: newComponents[key].settings,
          },
        },
        "*"
      );
    }
  }
}
