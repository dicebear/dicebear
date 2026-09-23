<script setup lang="ts">
/**
 * The middle of the playground: the avatar on a dotted ground, the same
 * options on other seeds below it, and the status line with the license and
 * the legal links. The avatar itself takes no clicks or hovers.
 */
import { computed, ref } from 'vue';
import { computedAsync } from '@vueuse/core';
import { Dices, Scale } from '@lucide/vue';
import { Avatar } from '@dicebear/core';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';
import useStore from '@theme/stores/playground';
import { legalLinks } from '@theme/config/footer-links';
import { useCombinationCount } from '@theme/composables/useCombinationCount';
import PlaygroundLicenseText from './PlaygroundLicenseText.vue';
import PlaygroundSeedField from './PlaygroundSeedField.vue';

const props = defineProps<{
  seed: string;
}>();

const store = useStore();
const count = useCombinationCount();

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

function pickSeed(seed: string) {
  store.seed = seed;
}

// The status line carries the legal pages the footer would otherwise hold.
const legal = legalLinks.filter((link) => link.label !== 'Licenses');
</script>

<template>
  <div class="pg-stage">
    <div class="pg-stage-ground">
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

      <PlaygroundSeedField class="pg-stage-seed-field" />

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
    </div>

    <div class="pg-stage-status">
      <div class="pg-stage-status-row">
        <span v-if="count" class="pg-stage-combos">
          <Dices :size="14" aria-hidden="true" />
          {{ count.display }} combinations
        </span>
        <span class="pg-stage-legal">
          <template v-for="(link, index) in legal" :key="link.href">
            <span v-if="index > 0" aria-hidden="true"> · </span>
            <a
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              >{{ link.label }}</a
            >
          </template>
        </span>
      </div>
      <div class="pg-stage-status-row pg-stage-license-row">
        <Scale :size="14" aria-hidden="true" class="pg-stage-license-icon" />
        <PlaygroundLicenseText class="pg-stage-license" />
      </div>
    </div>
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

  /* The seed field is as wide as the picture and sits right under it. */
  & &-seed-field {
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

  /* Two lines: the count and the legal links first, the license sentence
     with its own symbol under them, so it keeps clear of the links. */
  &-status {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 4px;
    box-sizing: border-box;
    padding: 8px 20px 10px;
    border-top: 1px solid var(--db-line);
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);

    &-row {
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 16px;
    }
  }

  &-license-row {
    align-items: flex-start;
    gap: 6px;
  }

  &-license-icon {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--db-ink-2);
  }

  /* The license sentence keeps its links, in the quiet color of the line. */
  &-license {
    flex: 1;
    min-width: 0;

    :deep(a) {
      font-weight: 500;
      color: var(--db-ink-2);
      text-decoration: underline;
      text-decoration-style: solid;
      text-underline-offset: 3px;
    }
  }

  &-legal {
    flex-shrink: 0;
    margin-left: auto;
    white-space: nowrap;

    a {
      color: var(--db-ink-2);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  /* How many different avatars the options can produce: a die and the
     count, at the head of the status line. */
  &-combos {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
    font-variant-numeric: tabular-nums;
    color: var(--db-ink-2);
  }

  @media (max-width: 959px) {
    &-ground {
      padding: 16px;
    }

    &-picture,
    & &-seed-field {
      width: min(100%, 280px);
    }

    &-seeds {
      display: none;
    }

    &-status {
      padding: 8px 16px 10px;
    }
  }
}
</style>
