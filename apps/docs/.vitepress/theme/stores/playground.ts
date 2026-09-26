import { defineStore } from 'pinia';
import { computed, nextTick, ref, watch } from 'vue';
import {
  useLocalStorage,
  useSessionStorage,
  watchDebounced,
} from '@vueuse/core';
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
const MODE_KEY = 'dicebear-playground-mode';

/**
 * How much of the playground shows: a few looks, every option, or the parts
 * and colors to pick one by one.
 */
export type PlaygroundMode = 'simple' | 'advanced' | 'editor';

const PLAYGROUND_MODES: readonly string[] = ['simple', 'advanced', 'editor'];

export function isPlaygroundMode(value: unknown): value is PlaygroundMode {
  return typeof value === 'string' && PLAYGROUND_MODES.includes(value);
}

export default defineStore('playground', () => {
  const data = useData<ThemeOptions>();

  const availableAvatarStyles = Object.keys(data.theme.value.avatarStyles);

  // The style a first visit opens with. It is chosen rather than the first
  // one in the list: a CC0 style keeps the license line short, and its
  // presets fill the simple view.
  const defaultStyle = availableAvatarStyles.includes('lorelei')
    ? 'lorelei'
    : availableAvatarStyles[0];

  // What the reader is looking at only has to survive a reload and a trip into
  // the docs and back, so it ends with the tab. Keeping a look past that is
  // what Export is for, and it hands them a file they own. The uploaded style
  // definitions below are the exception and stay: they are a good deal of work
  // to hand in again, and losing them would take the picker entry with them.
  const avatarStyleName = useSessionStorage<PlaygroundStoreStyle>(
    STYLE_KEY,
    defaultStyle,
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

  // The view is a habit of the reader rather than part of the look, so it
  // outlasts the tab: whoever switched to another view finds it again.
  const mode = useLocalStorage<PlaygroundMode>(MODE_KEY, 'simple');

  /**
   * Switches the view. The menu in the toolbar does it, and so can a link,
   * and the event says which of the two it was.
   */
  function setMode(next: PlaygroundMode, via: 'menu' | 'link' = 'menu') {
    if (mode.value === next) return;

    mode.value = next;

    track('Playground: Mode Changed', { mode: next, via });
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
      avatarStyleName.value = defaultStyle;
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

  // Undo and redo. A step is the style, the options and the seed together,
  // taken once a change has settled, so a slider drag or a typed seed counts
  // as one step. Going back replaces all three; the resulting state equals the
  // step it came from, so the watcher below records nothing for it.
  type Step = {
    style: PlaygroundStoreStyle;
    options: PlaygroundStoreOptions;
    seed: string;
  };

  const HISTORY_LIMIT = 100;

  function takeStep(): Step {
    return {
      style: avatarStyleName.value,
      options: clonePlain(avatarStyleOptions.value),
      seed: seed.value,
    };
  }

  function sameStep(a: Step, b: Step): boolean {
    return (
      a.style === b.style &&
      a.seed === b.seed &&
      JSON.stringify(a.options) === JSON.stringify(b.options)
    );
  }

  const past = ref<Step[]>([]);
  const future = ref<Step[]>([]);
  let present = takeStep();

  watchDebounced(
    [avatarStyleName, seed, avatarStyleOptions],
    () => {
      const next = takeStep();

      if (sameStep(next, present)) {
        return;
      }

      past.value.push(present);

      if (past.value.length > HISTORY_LIMIT) {
        past.value.shift();
      }

      present = next;
      future.value = [];
    },
    { deep: true, debounce: 300 },
  );

  async function restoreStep(step: Step) {
    if (avatarStyleName.value !== step.style) {
      avatarStyleName.value = step.style;

      // The style watcher clears the options on the next tick.
      await nextTick();
    }

    clearOptions();
    Object.assign(avatarStyleOptions.value, clonePlain(step.options));
    seed.value = step.seed;

    syncOptionSnapshot();
  }

  const canUndo = computed(() => past.value.length > 0);
  const canRedo = computed(() => future.value.length > 0);

  function undo() {
    const step = past.value.pop();

    if (!step) return;

    future.value.push(present);
    present = step;

    void restoreStep(step);
  }

  function redo() {
    const step = future.value.pop();

    if (!step) return;

    past.value.push(present);
    present = step;

    void restoreStep(step);
  }

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
    mode,
    setMode,
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
    canUndo,
    canRedo,
    undo,
    redo,
  };
});
