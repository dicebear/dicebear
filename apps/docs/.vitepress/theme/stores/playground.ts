import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useLocalStorage, watchDebounced } from '@vueuse/core';
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval';
import type {
  CustomStyleEntry,
  PlaygroundStoreStyle,
  PlaygroundStoreOptions,
  ThemeOptions,
} from '@theme/types';
import { useData } from 'vitepress';
import {
  clonePlain,
  registerCustomStyle,
  unregisterCustomStyle,
  flushPendingCustomStyles,
} from '@theme/utils/avatar/style';
import { track, styleLabel } from '@theme/utils/track';

export default defineStore('playground', () => {
  const data = useData<ThemeOptions>();

  const availableAvatarStyles = Object.keys(data.theme.value.avatarStyles);

  const avatarStyleName = useLocalStorage<PlaygroundStoreStyle>(
    'dicebear-playground-style',
    availableAvatarStyles[0],
  );
  const avatarStyleOptions = useLocalStorage<PlaygroundStoreOptions>(
    'dicebear-playground-options',
    {},
  );
  const seed = useLocalStorage<string>('dicebear-playground-seed', 'Felix');

  const { data: customStyles, isFinished: customStylesReady } = useIDBKeyval<
    Record<string, CustomStyleEntry>
  >('dicebear-playground-custom-styles', {});

  // useIDBKeyval returns reactive proxies; structuredClone inside Style throws on those.
  watch(
    customStylesReady,
    (isReady) => {
      if (!isReady) return;

      const invalid: string[] = [];

      for (const [key, entry] of Object.entries(customStyles.value)) {
        try {
          registerCustomStyle(key, clonePlain(entry.definition));
        } catch {
          invalid.push(key);
        }
      }

      if (invalid.length > 0) {
        customStyles.value = Object.fromEntries(
          Object.entries(customStyles.value).filter(
            ([key]) => !invalid.includes(key),
          ),
        );
      }

      flushPendingCustomStyles();
    },
    { immediate: true },
  );

  const isCustomStyle = computed(() =>
    avatarStyleName.value.startsWith('custom:'),
  );

  function addCustomStyle(name: string, definition: object): string {
    let key = `custom:${name}`;
    let counter = 1;

    while (key in customStyles.value) {
      counter++;
      key = `custom:${name} (${counter})`;
    }

    customStyles.value[key] = { name, definition };

    return key;
  }

  function removeCustomStyle(key: string): void {
    delete customStyles.value[key];
    unregisterCustomStyle(key);

    if (avatarStyleName.value === key) {
      avatarStyleName.value = availableAvatarStyles[0];
    }
  }

  const avatarStyleOptionsWithoutDefaults = computed(() => {
    const result: PlaygroundStoreOptions = {};

    for (const [key, value] of Object.entries(avatarStyleOptions.value)) {
      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  });

  function resetOptions() {
    for (const key of Object.keys(avatarStyleOptions.value)) {
      delete avatarStyleOptions.value[key];
    }

    seed.value = 'Felix';
  }

  function resetOption(key: string) {
    delete avatarStyleOptions.value[key];

    track('Playground: Option Reset', {
      style: styleLabel(avatarStyleName.value),
      option: key,
    });
  }

  function isOptionSet(key: string): boolean {
    return key in avatarStyleOptions.value;
  }

  watch(avatarStyleName, resetOptions);

  // Track which options users tune. Debounced so dragging a slider collapses
  // into one event, and diffed per key so only newly changed keys are sent.
  // Removed keys (reset / style switch clears options) are intentionally not
  // reported here — those have their own events.
  let optionSnapshot: Record<string, unknown> = clonePlain(
    avatarStyleOptions.value,
  );

  watchDebounced(
    avatarStyleOptions,
    (val) => {
      for (const key of Object.keys(val)) {
        if (JSON.stringify(val[key]) !== JSON.stringify(optionSnapshot[key])) {
          track('Playground: Option Changed', {
            style: styleLabel(avatarStyleName.value),
            option: key,
          });
        }
      }

      optionSnapshot = clonePlain(val);
    },
    { deep: true, debounce: 700 },
  );

  return {
    availableAvatarStyles,
    avatarStyleName,
    avatarStyleOptions,
    avatarStyleOptionsWithoutDefaults,
    seed,
    customStyles,
    isCustomStyle,
    addCustomStyle,
    removeCustomStyle,
    resetOptions,
    resetOption,
    isOptionSet,
  };
});
