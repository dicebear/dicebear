<script setup lang="ts">
/**
 * The row under the avatar in the editor view: the shape on the left,
 * Randomize in the middle, the ways out on the right. The editor has no
 * column of its own, so the actions live here. A phone keeps them in the bar
 * at the bottom instead.
 */
import { inject } from 'vue';
import { Shuffle } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import {
  playgroundEntriesKey,
  type PlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import {
  PLAYGROUND_SHAPES,
  usePlaygroundShape,
} from '@theme/composables/usePlaygroundShape';
import { track, styleLabel } from '@theme/utils/track';
import SiteSegmented from '../site/SiteSegmented.vue';
import PlaygroundEditorActions from './PlaygroundEditorActions.vue';

withDefaults(
  defineProps<{
    seed: string;
    actions?: boolean;
  }>(),
  { actions: true },
);

const emit = defineEmits<{
  'how-to-use': [];
}>();

const injected = inject(playgroundEntriesKey);

if (!injected) {
  throw new Error('PlaygroundEditorBar needs the entries of PlaygroundApp.');
}

const entries: PlaygroundEntries = injected;

const store = useStore();
const shape = usePlaygroundShape();

/**
 * A new avatar: a new seed, and the parts and colors picked in the tray go
 * back to it. The background and everything outside the tray stay.
 */
function randomize() {
  const keys = [
    ...entries.components.value.flatMap((comp) =>
      entries.keysOf({ kind: 'component', name: comp.name }),
    ),
    ...entries.colors.value
      .filter((color) => color.name !== 'background')
      .flatMap((color) => entries.keysOf({ kind: 'color', name: color.name })),
  ];

  for (const key of keys) {
    delete store.avatarStyleOptions[key];
  }

  store.seed = Math.random().toString(36).substring(2, 10);

  track('Playground: Randomized', {
    style: styleLabel(store.avatarStyleName),
  });
}
</script>

<template>
  <div class="pg-editor-bar">
    <SiteSegmented
      v-model="shape"
      :options="PLAYGROUND_SHAPES"
      aria-label="Shape"
      class="pg-editor-bar-shape"
    />

    <button
      type="button"
      class="site-btn site-btn-secondary pg-editor-bar-random"
      @click="randomize"
    >
      <Shuffle :size="16" aria-hidden="true" />
      Randomize
    </button>

    <PlaygroundEditorActions
      v-if="actions"
      :seed="seed"
      class="pg-editor-bar-actions"
      @how-to-use="emit('how-to-use')"
    />
  </div>
</template>

<style scoped lang="scss">
/* Three parts on one line, Randomize in the middle of the picture. */
.pg-editor-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  align-self: stretch;

  &-shape {
    justify-self: start;
  }

  &-actions {
    justify-self: end;
  }

  /* Too narrow for one line: the shape and Randomize, the actions under
     them. */
  @media (max-width: 959px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &-actions {
      flex-basis: 100%;
      justify-content: center;
    }
  }

  /* A phone has the shape on the left and Randomize on the right. */
  @media (max-width: 767px) {
    justify-content: space-between;
  }
}
</style>
