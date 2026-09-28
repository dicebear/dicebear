<script setup lang="ts">
/**
 * The middle of the playground: the avatar on a dotted ground, the same
 * options on other seeds below it, and the status line with the license and
 * the legal links. The avatar itself takes no clicks or hovers. A phone
 * shows the status line above its actions instead. On the first visit to
 * the simple view, a note beside the seed says what a seed does.
 *
 * The editor view puts its own row under the avatar in place of the seed and
 * its tray between the ground and the status line. The ground then keeps to
 * its content, and the avatar grows with the height of the window.
 */
import { computed, ref } from 'vue';
import {
  computedAsync,
  useLocalStorage,
  useResizeObserver,
} from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';
import useStore from '@theme/stores/playground';
import PlaygroundSeedField from './PlaygroundSeedField.vue';
import PlaygroundSeedHint from './PlaygroundSeedHint.vue';
import PlaygroundStatus from './PlaygroundStatus.vue';

const props = withDefaults(
  defineProps<{
    seed: string;
    editor?: boolean;
    status?: boolean;
    /** A smaller avatar, for a phone that shows the options under it. */
    compact?: boolean;
    /** Explain the seed once, beside the field, where there is room. */
    seedHint?: boolean;
  }>(),
  { editor: false, status: true, compact: false, seedHint: false },
);

const store = useStore();

const OTHER_SEEDS = ['Aneka', 'Jade', 'Leo', 'Mia', 'Nala', 'Oscar'];

const styleOptions = computed(() => ({
  ...store.avatarStyleOptionsWithoutDefaults,
  seed: props.seed,
}));

const failed = ref(false);

// The style is loaded once and drawn seven times. The options are cloned
// before the first await, so every nested value counts as a dependency.
const rendered = computedAsync(async () => {
  const styleName = store.avatarStyleName;
  const options = clonePlain(styleOptions.value);

  try {
    const style = await loadAvatarStyle(styleName);
    const draw = (seed: string) =>
      new Avatar(style, { ...clonePlain(options), seed });

    const result = {
      main: draw(props.seed).toString(),
      others: OTHER_SEEDS.map((seed) => ({
        seed,
        src: draw(seed).toDataUri(),
      })),
    };

    failed.value = false;

    return result;
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Avatar render failed:', e);
    }

    failed.value = true;

    return undefined;
  }
}, undefined);

const otherSeeds = computed(
  () =>
    rendered.value?.others ??
    OTHER_SEEDS.map((seed) => ({ seed, src: undefined })),
);

// The seed hint shows once. It goes when dismissed or as soon as the seed
// is touched, and only where it fits beside the field without covering the
// avatar: a laptop or larger in the simple view.
const seedHintSeen = useLocalStorage('dicebear-playground-seed-hint', false);

const ground = ref<HTMLElement | null>(null);
const seedAnchor = ref<HTMLElement | null>(null);
const seedHintRoom = ref(0);

function measureSeedHintRoom() {
  if (!ground.value || !seedAnchor.value) return;

  seedHintRoom.value =
    ground.value.getBoundingClientRect().right -
    seedAnchor.value.getBoundingClientRect().right;
}

useResizeObserver(ground, measureSeedHintRoom);
useResizeObserver(seedAnchor, measureSeedHintRoom);

// 12 pixels for the arrow on the left, 12 to the edge of the ground.
const seedHintWidth = computed(() => Math.min(260, seedHintRoom.value - 24));

const seedHintShown = computed(
  () => props.seedHint && !seedHintSeen.value && seedHintWidth.value >= 200,
);

function dismissSeedHint() {
  seedHintSeen.value = true;
}

function pickSeed(seed: string) {
  store.seed = seed;
  dismissSeedHint();
}
</script>

<template>
  <div class="pg-stage" :class="{ 'is-editor': editor, 'is-compact': compact }">
    <div ref="ground" class="pg-stage-ground">
      <div class="pg-stage-picture">
        <div
          v-if="rendered"
          class="pg-stage-avatar"
          :aria-label="`Avatar for the seed ${seed}`"
          role="img"
          v-html="rendered.main"
        />
        <span v-else-if="!failed" class="pg-stage-loading">Loading style…</span>
        <span v-else class="pg-stage-loading"
          >This style could not be drawn.</span
        >
      </div>

      <slot name="controls">
        <div ref="seedAnchor" class="pg-stage-seed-anchor">
          <PlaygroundSeedField
            @pointerdown="dismissSeedHint"
            @input="dismissSeedHint"
          />
          <PlaygroundSeedHint
            v-if="seedHintShown"
            :style="{ width: `${seedHintWidth}px` }"
            @dismiss="dismissSeedHint"
          />
        </div>

        <div class="pg-stage-seeds">
          <div class="pg-stage-seeds-row">
            <button
              v-for="other in otherSeeds"
              :key="other.seed"
              type="button"
              class="pg-stage-seed hv-thumb"
              :aria-label="`Use the seed ${other.seed}`"
              :title="other.seed"
              @click="pickSeed(other.seed)"
            >
              <img v-if="other.src" :src="other.src" alt="" />
            </button>
          </div>
        </div>
      </slot>
    </div>

    <slot />

    <PlaygroundStatus v-if="status" :combinations="!editor" />
  </div>
</template>

<style scoped lang="scss">
.pg-stage {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;

  &-ground {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 0;
    padding: 24px;
    background-color: var(--db-paper);
    background-image: radial-gradient(var(--db-line) 1px, transparent 1px);
    background-size: 20px 20px;
    overflow: hidden;
  }

  /* The avatar stands on the ground as it is, without a panel around it.
     The square fits the shorter side of the ground. */
  &-picture {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: min(100%, 52vh, 480px);
    aspect-ratio: 1 / 1;
  }

  &-avatar {
    display: block;
    width: 100%;
    height: 100%;

    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &-loading {
    font-size: 15px;
    line-height: 24px;
    color: var(--db-muted);
  }

  /* The seed field is as wide as the picture and sits right under it. The
     seed hint hangs off its right edge. */
  &-seed-anchor {
    position: relative;
    width: min(100%, 52vh, 480px);
  }

  &-seeds {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: min(100%, 52vh, 480px);

    &-row {
      display: flex;
      gap: 8px;
    }
  }

  &-seed {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid var(--db-line);
    border-radius: var(--db-radius-3);
    background: var(--db-panel);
    overflow: hidden;
    cursor: pointer;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  /* A window 760px high shows the avatar at 200px and two rows of the
     tray under it. Every pixel more goes to the avatar, up to 320px. */
  &.is-editor &-ground {
    flex: none;
    gap: 14px;
    padding: 20px 12px 16px;
  }

  &.is-editor &-picture {
    width: clamp(160px, calc(100dvh - 560px), 320px);
  }

  @media (max-width: 959px) {
    &-ground,
    &.is-editor &-ground {
      padding: 16px;
    }

    &-picture,
    &-seed-anchor {
      width: min(100%, 280px);
    }

    &-seeds {
      display: none;
    }
  }

  /* A phone leaves the height to the tray or the options under a smaller
     avatar. */
  @media (max-width: 767px) {
    &.is-editor &-picture {
      width: 180px;
    }

    &.is-compact &-ground {
      gap: 12px;
    }

    &.is-compact &-picture {
      width: 150px;
    }
  }
}
</style>
