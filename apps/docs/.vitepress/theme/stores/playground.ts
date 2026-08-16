import { defineStore } from 'pinia';
import { computed, nextTick, watch } from 'vue';
import { useSessionStorage, watchDebounced } from '@vueuse/core';
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
import type { StylePreset } from '@theme/config/presets';
import type { PlaygroundConfig } from '@theme/utils/playgroundConfig';

const STYLE_KEY = 'dicebear-playground-style';
const OPTIONS_KEY = 'dicebear-playground-options';
const SEED_KEY = 'dicebear-playground-seed';

export default defineStore('playground', () => {
  const data = useData<ThemeOptions>();

  const availableAvatarStyles = Object.keys(data.theme.value.avatarStyles);

  // What the reader is looking at only has to survive a reload and a trip into
  // the docs and back, so it ends with the tab. Keeping a look past that is
  // what Export is for, and it hands them a file they own. The uploaded style
  // definitions below are the exception and stay: they are a good deal of work
  // to hand in again, and losing them would take the picker entry with them.
  const avatarStyleName = useSessionStorage<PlaygroundStoreStyle>(
    STYLE_KEY,
    availableAvatarStyles[0],
  );
  const avatarStyleOptions = useSessionStorage<PlaygroundStoreOptions>(
    OPTIONS_KEY,
    {},
  );
  const seed = useSessionStorage<string>(SEED_KEY, 'Felix');

  // The same three keys used to live in localStorage. Nothing reads them any
  // more, so left alone they would sit on the reader's disk for good, seed
  // included.
  if (typeof localStorage !== 'undefined') {
    for (const key of [STYLE_KEY, OPTIONS_KEY, SEED_KEY]) {
      localStorage.removeItem(key);
    }
  }

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

  function clearOptions() {
    for (const key of Object.keys(avatarStyleOptions.value)) {
      delete avatarStyleOptions.value[key];
    }
  }

  function resetOptions() {
    clearOptions();

    seed.value = 'Felix';
  }

  /**
   * Replaces the current options with a preset's, keeping the seed.
   *
   * Deliberately not a merge. A preset describes a complete look, and
   * whatever is already set can contradict it: a pinned hair color survives
   * the preset that was supposed to change it, a probability of 0 keeps a
   * component the preset colors, and the result belongs to neither. The seed
   * is the exception, because it picks the person rather than the look.
   */
  function applyPreset(preset: StylePreset) {
    clearOptions();

    Object.assign(avatarStyleOptions.value, clonePlain(preset.options));

    syncOptionSnapshot();

    track('Playground: Preset Applied', {
      style: styleLabel(avatarStyleName.value),
      preset: preset.id,
    });
  }

  /**
   * Loads an exported configuration onto the given style. Replaces what is set
   * instead of merging into it, for the reason applyPreset gives, and the seed
   * is part of the file rather than the exception it is there.
   *
   * The style comes in as an argument rather than out of the config, because
   * the caller had to resolve it to validate the options against it. A file
   * that names no style targets whatever was selected at that point, and the
   * reader is free to pick another one while the definition is still loading.
   */
  async function applyConfig(config: PlaygroundConfig, styleName: string) {
    const { seed: importedSeed, ...options } = config.options;
    const nextSeed =
      typeof importedSeed === 'string' ? importedSeed : seed.value;

    if (styleName !== avatarStyleName.value) {
      avatarStyleName.value = styleName;

      // Switching the style clears the options through a watcher that runs on
      // the next tick, so anything written before that is dropped again.
      await nextTick();
    }

    clearOptions();

    Object.assign(avatarStyleOptions.value, clonePlain(options));

    seed.value = nextSeed;

    syncOptionSnapshot();

    track('Playground: Options Imported', {
      style: styleLabel(avatarStyleName.value),
    });
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

  // Presets and imports write a batch of keys in one go and report themselves.
  // Moving the snapshot with them keeps the diff above a record of what the
  // reader tuned by hand.
  function syncOptionSnapshot() {
    optionSnapshot = clonePlain(avatarStyleOptions.value);
  }

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
    customStylesReady,
    isCustomStyle,
    addCustomStyle,
    removeCustomStyle,
    resetOptions,
    resetOption,
    applyPreset,
    applyConfig,
    isOptionSet,
  };
});
