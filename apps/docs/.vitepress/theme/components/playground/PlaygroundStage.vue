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
import { computedAsync, useStorage, useResizeObserver } from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';
import { safeStorage } from '@theme/utils/safeStorage';
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
const seedHintSeen = useStorage(
  'dicebear-playground-seed-hint',
  false,
  safeStorage('localStorage'),
);

const ground = ref<HTMLElement | null>(null);
const seedAnchor = ref<HTMLElement | null>(null);
const seedHintRoom = ref(0);
const seedHintRoomBelow = ref(0);

function measureSeedHintRoom() {
  if (!ground.value || !seedAnchor.value) return;

  const groundBox = ground.value.getBoundingClientRect();
  const anchorBox = seedAnchor.value.getBoundingClientRect();

  seedHintRoom.value = groundBox.right - anchorBox.right;
  seedHintRoomBelow.value =
    groundBox.bottom - (anchorBox.top + anchorBox.height / 2);
}

useResizeObserver(ground, measureSeedHintRoom);
useResizeObserver(seedAnchor, measureSeedHintRoom);

const SEED_HINT_HALF_HEIGHT = 100;

// 12 pixels for the arrow on the left, 12 to the edge of the ground.
const seedHintWidth = computed(() => Math.min(260, seedHintRoom.value - 24));

const seedHintShown = computed(
  () =>
    props.seedHint &&
    !seedHintSeen.value &&
    seedHintWidth.value >= 200 &&
    // The bubble is centred on the field and the ground would cut it off.
    seedHintRoomBelow.value >= SEED_HINT_HALF_HEIGHT,
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
  <div
    class="pg-stage"
    :class="{
      'is-editor': editor,
      'is-compact': compact,
      'has-corner': !!$slots.corner,
    }"
  >
    <div ref="ground" class="pg-stage-ground">
      <div v-if="$slots.corner" class="pg-stage-corner">
        <slot name="corner" />
      </div>
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
              class="pg-stage-seed"
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
@use '../../styles/mixins' as m;

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
    background-image: radial-gradient(
      color-mix(in srgb, var(--db-ink) 16%, transparent) 1px,
      transparent 1.5px
    );
    background-size: 22px 22px;
    background-position: 11px 11px;
    overflow: hidden;
  }

  /* Tools in the top corners of the ground, on a phone: what the bar of a
     wider window holds. */
  &-corner {
    position: absolute;
    z-index: 2;
    top: 12px;
    left: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
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

    @include m.avatar-checker;

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
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 14px;
    /* The beige tile needs an edge on the light paper only; on the dark
       ground it stands out by itself. */
    box-shadow: inset 0 0 0 1px var(--db-line);
    overflow: hidden;
    cursor: pointer;
    transition:
      transform 0.25s var(--ease-spring),
      box-shadow 0.12s;

    @include m.avatar-ground;

    &:hover {
      box-shadow:
        0 0 0 2px var(--db-paper),
        0 0 0 4px var(--db-field-border);
      transform: translateY(-2px);
    }

    :root.dark &:not(:hover) {
      box-shadow: none;
    }

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: 2px;
    }
  }

  /* The canvas of the editor leaves room around the avatar: above it and
     between it and the controls, growing with the window. A window 760px
     high shows the avatar at 200px, one 900px high at 320px with a row and
     a half of the tray under it, which scrolls. */
  &.is-editor &-ground {
    flex: none;
    gap: clamp(16px, 4dvh, 48px);
    padding: clamp(24px, 6dvh, 80px) 0 20px;
  }

  &.is-editor &-picture {
    width: clamp(180px, calc(100dvh - 560px), 320px);
  }

  /* A short, wide window such as a tablet held sideways: the controls stand
     beside the avatar, so the height goes to the tray of parts. */
  @media (min-width: 768px) and (max-height: 799px) {
    &.is-editor &-ground {
      flex-direction: row;
      gap: 32px;
      padding: 16px 0;
    }

    &.is-editor &-picture {
      flex: none;
      width: clamp(150px, calc(100dvh - 500px), 200px);
    }
  }

  /* Next to a panel the ground has a fixed height, and the avatar takes
     what the seed field and the row of seeds leave of it, so nothing is cut
     off in a short window such as a tablet held sideways. The field keeps a
     width to type in. A very short ground gives up the row of seeds. */
  @media (min-width: 960px) {
    &:not(.is-editor) &-ground {
      --pg-stage-rest: 216px;

      container-type: size;
    }

    &:not(.is-editor) &-picture {
      width: min(100%, calc(100cqh - var(--pg-stage-rest)), 480px);
    }

    &:not(.is-editor) &-seed-anchor,
    &:not(.is-editor) &-seeds {
      width: min(100%, max(320px, calc(100cqh - var(--pg-stage-rest))), 480px);
    }

    @container (max-height: 400px) {
      &:not(.is-editor) &-seeds {
        display: none;
      }

      &:not(.is-editor) &-picture {
        width: min(100%, calc(100cqh - 152px), 480px);
      }
    }
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
    &.is-compact &-ground {
      gap: 14px;
    }

    /* The sheet starts at three fifths of the window at most: on a short
       phone the avatar gets smaller, so the field under it stays clear. */
    &.is-compact &-picture,
    &.is-editor &-picture {
      width: clamp(96px, calc(60dvh - 226px), 200px);
    }

    /* Undo, redo and the download stand in the top corners of the ground,
       so the ground leaves room above the avatar for them. */
    &.has-corner &-ground {
      padding-top: 64px;
    }

    /* A small phone held sideways: the avatar and its field side by side,
       or the sheet would cover the field. */
    @media (max-height: 480px) {
      &.is-compact &-ground {
        flex-direction: row;
        gap: 16px;
        padding: 60px 16px 12px;
      }

      &.is-compact &-picture {
        flex: none;
        width: 96px;
      }

      &.is-compact &-seed-anchor {
        width: min(100%, 320px);
      }

      &.is-compact :deep(.pg-editor-bar) {
        flex: 0 1 auto;
        align-self: center;
      }
    }
  }
}
</style>
