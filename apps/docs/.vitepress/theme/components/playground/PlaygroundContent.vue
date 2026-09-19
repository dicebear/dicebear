<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { capitalCase, kebabCase } from 'change-case';
import { RotateCcw } from '@lucide/vue';
import SiteAvatar from '@theme/components/site/SiteAvatar.vue';
import PlaygroundOptions from './PlaygroundOptions.vue';
import PlaygroundPreviewPanel from './PlaygroundPreviewPanel.vue';
import PlaygroundButtonExport from './PlaygroundButtonExport.vue';
import PlaygroundButtonImport from './PlaygroundButtonImport.vue';
import PlaygroundButtonHowToUse from './PlaygroundButtonHowToUse.vue';
import useStore from '@theme/stores/playground';
import { loadStylePreset } from '@theme/config/presets';
import { track, styleLabel } from '@theme/utils/track';
import './playground.scss';

const store = useStore();
const { seed } = storeToRefs(store);

function onReset() {
  track('Playground: Reset', { style: styleLabel(store.avatarStyleName) });
  store.resetOptions();
}

// ?style= query param overrides persisted style (used by "Open in Playground"
// links). ?preset= additionally loads one of that style's presets, which is how
// a card in the style-page gallery hands its options over.
const params = new URL(window.location.href).searchParams;
const styleParam = params.get('style');
const presetParam = params.get('preset');

if (styleParam) {
  const styleName = kebabCase(styleParam);

  if (store.availableAvatarStyles.includes(styleName)) {
    store.avatarStyleName = styleName;
    store.resetOptions();

    if (presetParam) {
      // The store clears the options whenever the style changes, and that
      // watcher runs on the next tick, so applying the preset any earlier
      // would be undone again. The preset file is fetched on demand, which
      // lands even later, so both waits are covered.
      // A failed chunk fetch leaves the playground on the plain style, which
      // is the same place an unknown `?preset=` lands. Swallowed rather than
      // left to reject, since nothing here can retry it.
      void loadStylePreset(styleName, presetParam)
        .then(async (preset) => {
          await nextTick();

          if (preset) {
            store.applyPreset(preset);
          }
        })
        .catch(() => undefined);
    }
  }

  history.replaceState(null, '', window.location.pathname);
}

// The bar under the header on narrow screens. It stands in for the preview
// once the stage has scrolled out above the viewport.
const previewCol = ref<HTMLElement | null>(null);
const barShown = ref(false);
let stageObserver: IntersectionObserver | undefined;

const barOptions = computed(() => ({
  ...store.avatarStyleOptionsWithoutDefaults,
  seed: seed.value,
}));

const barStyleName = computed(() =>
  store.isCustomStyle
    ? (store.customStyles[store.avatarStyleName]?.name ?? 'Custom Style')
    : capitalCase(store.avatarStyleName),
);

onMounted(() => {
  const stage = previewCol.value?.querySelector('[data-pg-stage]');

  if (!stage) {
    return;
  }

  const headerHeight = 64;

  stageObserver = new IntersectionObserver(
    ([entry]) => {
      barShown.value =
        !entry.isIntersecting &&
        entry.boundingClientRect.bottom <= headerHeight;
    },
    { rootMargin: `-${headerHeight}px 0px 0px 0px` },
  );

  stageObserver.observe(stage);
});

onBeforeUnmount(() => {
  stageObserver?.disconnect();
});
</script>

<template>
  <div class="pg-actions">
    <PlaygroundButtonExport :seed="seed" />
    <PlaygroundButtonImport />
    <button
      type="button"
      class="site-btn site-btn-ghost site-btn-sm pg-quiet"
      @click="onReset"
    >
      <RotateCcw :size="16" aria-hidden="true" />
      <span class="pg-quiet-label">Reset</span>
    </button>
  </div>

  <div
    class="pg-bar"
    :class="{ 'is-shown': barShown }"
    :inert="barShown ? undefined : true"
  >
    <span class="pg-bar-avatar pg-checker">
      <SiteAvatar
        v-if="barShown"
        :style-name="store.avatarStyleName"
        :options="barOptions"
        :size="46"
        :radius="0"
        mode="library"
        :lazy="false"
      />
    </span>
    <span class="pg-bar-text">
      <span class="pg-bar-seed">{{ seed }}</span>
      <span class="pg-bar-style">{{ barStyleName }}</span>
    </span>
    <span class="pg-bar-action">
      <PlaygroundButtonHowToUse :seed="seed" />
    </span>
  </div>

  <div class="pg-body">
    <div class="pg-options">
      <PlaygroundOptions v-model:seed="seed" />
    </div>
    <div ref="previewCol" class="pg-preview-col">
      <PlaygroundPreviewPanel :seed="seed" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-actions {
  display: flex;
  gap: 4px;

  /* Export and Import render their own trigger, so the quiet look is set from
     here for all three. */
  :deep(.pg-quiet) {
    gap: 6px;
    padding: 0 10px;
    font-weight: 500;
  }

  @media (max-width: 767px) {
    gap: 0;

    :deep(.pg-quiet) {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 10px;
    }

    /* The label stays readable for assistive technology. */
    :deep(.pg-quiet-label) {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }
}

.pg-body {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) min(560px, 42%);
  gap: 80px;
  align-items: start;

  @media (max-width: 1279px) {
    gap: 48px;
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}

.pg-options {
  min-width: 0;

  @media (max-width: 959px) {
    order: 2;
  }
}

.pg-preview-col {
  position: sticky;
  top: calc(var(--db-header-h) + 24px);
  min-width: 0;

  /* In one column the panel dissolves into the grid: its stage and actions
     come first, its details follow the options. The panel sets those orders. */
  @media (max-width: 959px) {
    display: contents;
  }
}

.pg-bar {
  display: none;

  @media (max-width: 959px) {
    position: fixed;
    z-index: 40;
    top: var(--db-header-h);
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
    height: 72px;
    padding: 0 var(--db-gutter);
    border-bottom: 1px solid var(--db-line);
    background: var(--db-paper);
    visibility: hidden;
    transform: translateY(-100%);
    transition:
      transform var(--duration-mid) var(--ease-smooth),
      visibility 0s var(--duration-mid);

    &.is-shown {
      visibility: visible;
      transform: none;
      transition:
        transform var(--duration-mid) var(--ease-smooth),
        visibility 0s;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.pg-bar-avatar {
  flex-shrink: 0;
  display: block;
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-3);
  overflow: hidden;

  /* The checker shows through transparent avatars. */
  :deep(.site-avatar) {
    background: none;
  }
}

.pg-bar-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.pg-bar-seed {
  overflow: hidden;
  font-size: 16px;
  line-height: 26px;
  font-weight: 700;
  color: var(--db-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.pg-bar-style {
  overflow: hidden;
  font-size: 13px;
  line-height: 18px;
  color: var(--db-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.pg-bar-action {
  flex-shrink: 0;
  display: flex;

  /* The trigger only, not the buttons inside its dialog. */
  > :deep(.site-btn) {
    height: 44px;
    padding: 0 16px;
    border-radius: var(--db-radius-3);
    font-size: 15px;
  }
}
</style>
