<script setup lang="ts">
/**
 * The preview column: the stage, the same options on other seeds, the three
 * actions and the details list.
 *
 * In one column the root dissolves into the page grid (`display: contents`),
 * so the top block sits above the options and the details below them.
 */
import { computed, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';
import useStore from '@theme/stores/playground';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';
import PlaygroundButtonCopy from './PlaygroundButtonCopy.vue';
import PlaygroundButtonHowToUse from './PlaygroundButtonHowToUse.vue';
import PlaygroundCombinationCount from './PlaygroundCombinationCount.vue';
import PlaygroundDefinitionInfo from './PlaygroundDefinitionInfo.vue';
import PlaygroundDocumentationLink from './PlaygroundDocumentationLink.vue';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();

const OTHER_SEEDS = [
  'Felix',
  'Aneka',
  'Jade',
  'Leo',
  'Mia',
  'Nala',
  'Oscar',
  'Riley',
];

const styleOptions = computed(() => ({
  ...store.avatarStyleOptionsWithoutDefaults,
  seed: props.seed,
}));

const failed = ref(false);

// The style is loaded once and drawn nine times: the stage and the row of
// other seeds. The options are cloned before the first await so that every
// nested value counts as a dependency.
const rendered = computedAsync(async () => {
  const styleName = store.avatarStyleName;
  const options = clonePlain(styleOptions.value);

  try {
    const style = await loadAvatarStyle(styleName);
    const draw = (seed: string) =>
      new Avatar(style, { ...clonePlain(options), seed }).toDataUri();

    const result = {
      main: draw(props.seed),
      others: OTHER_SEEDS.map((seed) => ({ seed, src: draw(seed) })),
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

function pickSeed(seed: string) {
  store.seed = seed;
}
</script>

<template>
  <div class="pg-preview">
    <div class="pg-preview-top">
      <div class="pg-preview-stage pg-checker" data-pg-stage>
        <img
          v-if="rendered"
          :src="rendered.main"
          :alt="`Avatar for the seed ${seed}`"
          class="pg-preview-avatar"
        />
        <span v-else-if="!failed" class="pg-preview-loading"
          >Loading styles…</span
        >
      </div>

      <div class="pg-preview-actions">
        <PlaygroundButtonHowToUse :seed="seed" />
        <PlaygroundButtonDownload :seed="seed" />
        <PlaygroundButtonCopy :seed="seed" />
      </div>

      <div class="pg-preview-seeds">
        <div class="pg-preview-seeds-head">
          <span class="site-label">Same options, other seeds</span>
          <span class="pg-preview-seeds-hint">Click one to use its seed</span>
        </div>
        <div class="pg-preview-seeds-grid">
          <button
            v-for="other in otherSeeds"
            :key="other.seed"
            type="button"
            class="pg-preview-seed pg-checker hv-thumb"
            :aria-label="`Use the seed ${other.seed}`"
            :aria-pressed="other.seed === seed"
            :title="other.seed"
            @click="pickSeed(other.seed)"
          >
            <img v-if="other.src" :src="other.src" alt="" />
          </button>
        </div>
      </div>

      <div class="pg-preview-row pg-preview-count">
        <PlaygroundCombinationCount />
      </div>
    </div>

    <div class="pg-preview-details">
      <h2 class="sr-only">Details</h2>
      <div v-if="!store.isCustomStyle" class="pg-preview-row">
        <PlaygroundDocumentationLink />
      </div>
      <div v-if="!store.isCustomStyle" class="pg-preview-row">
        <PlaygroundDefinitionInfo />
      </div>
      <div class="pg-preview-row pg-preview-license">
        <PlaygroundLicenseText />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-checker {
  background-color: var(--db-panel);
  background-image:
    linear-gradient(
      45deg,
      var(--db-soft) 25%,
      transparent 25%,
      transparent 75%,
      var(--db-soft) 75%
    ),
    linear-gradient(
      45deg,
      var(--db-soft) 25%,
      transparent 25%,
      transparent 75%,
      var(--db-soft) 75%
    );
  background-position:
    0 0,
    10px 10px;
  background-size: 20px 20px;
}

.pg-preview,
.pg-preview-top,
.pg-preview-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* A square of 560px, or the column width where that is narrower. The
   viewport height plays no part in it. */
.pg-preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: min(100%, 560px);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border: 1px solid var(--db-line);
  border-radius: 32px;
  overflow: hidden;
}

.pg-preview-avatar {
  display: block;
  width: 75%;
  height: 75%;
}

.pg-preview-loading {
  font-size: 16px;
  line-height: 26px;
  color: var(--db-muted);
}

.pg-preview-seeds {
  margin-top: 32px;

  &-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px 16px;
  }

  &-hint {
    font-size: 14px;
    line-height: 20px;
    color: var(--db-muted);
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 10px;
    margin-top: 12px;
  }
}

.pg-preview-seed {
  box-sizing: border-box;
  aspect-ratio: 1 / 1;
  padding: 0;
  border: 1px solid var(--db-line);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;

  &[aria-pressed='true'] {
    border-color: var(--db-brand);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

/* The actions follow the stage, so they stay in view on a laptop screen.
   Each action renders its trigger next to its dialogs, and the download
   trigger may sit in a menu wrapper, so the cells are sized from here. */
.pg-preview-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 24px;

  > :deep(*) {
    min-width: 0;
  }

  > :deep(span) {
    display: flex;
  }

  /* Direct children only: the dialogs live in here too and keep their own
     button sizes. */
  > :deep(.site-btn),
  > :deep(span > .site-btn) {
    width: 100%;
    padding: 0 12px;
  }
}

.pg-preview-row {
  padding: 18px 0;
  border-top: 1px solid var(--db-line);

  /* No count yet, no row. */
  &:empty {
    display: none;
  }
}

.pg-preview-count {
  margin-top: 40px;
  padding: 20px 0;
}

.pg-preview-details {
  border-bottom: 1px solid var(--db-line);
}

.pg-preview-license {
  font-size: 14px;
  line-height: 20px;
  color: var(--db-ink-2);

  /* The license text of the built-in styles brings its own link colors. */
  :deep(p a) {
    font-weight: 500;
    color: var(--db-brand-text);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}

@media (max-width: 959px) {
  .pg-preview {
    display: contents;
  }

  .pg-preview-top {
    order: 1;
  }

  .pg-preview-details {
    order: 3;
  }

  .pg-preview-stage {
    width: 100%;
    max-width: 560px;
    border-radius: var(--db-radius-6);
  }

  .pg-preview-row {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .pg-preview-actions {
    margin-top: 12px;
  }

  .pg-preview-seeds {
    margin-top: 24px;
  }

  .pg-preview-count {
    order: 3;
    margin-top: 20px;
    padding: 14px 0;
    border-bottom: 1px solid var(--db-line);
  }
}

@media (max-width: 767px) {
  .pg-preview-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;

    > :deep(:first-child) {
      grid-column: 1 / -1;
    }
  }

  .pg-preview-seeds-hint {
    display: none;
  }

  .pg-preview-seeds-grid {
    gap: 6px;
    margin-top: 10px;
  }

  .pg-preview-seed {
    border-radius: 10px;
  }

  .pg-preview-license {
    font-size: 13px;
    line-height: 18px;
  }
}
</style>
