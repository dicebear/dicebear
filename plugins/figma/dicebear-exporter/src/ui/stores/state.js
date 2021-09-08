import { get, writable } from 'svelte/store';
import { syncFrameSettings } from '../utils/syncFrameSettings';
import { syncComponentsSettings } from '../utils/syncComponentsSettings';
import { syncColorsSettings } from '../utils/syncColorsSettings';

export const state = writable({
  type: 'loading',
  data: {},
});

export const oldState = writable();

state.subscribe((newVal) => {
  const oldVal = get(oldState);

  if (oldVal?.type === 'loaded' && newVal?.type === 'loaded') {
    syncFrameSettings(newVal.data.frame.settings, oldVal.data.frame.settings);
    syncComponentsSettings(newVal.data.components, oldVal.data.components);
    syncColorsSettings(newVal.data.colors, oldVal.data.colors);
  }

  // Save state as copy to oldState
  oldState.set(JSON.parse(JSON.stringify(newVal)));
});
