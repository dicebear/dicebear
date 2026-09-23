<script setup lang="ts">
/**
 * The column on the right: the options of the selected entry, and under
 * them, fixed, the three ways out. On a phone the same column sits in a
 * sheet, with a close button in its head.
 */
import { computed, inject } from 'vue';
import { capitalCase } from 'change-case';
import { X } from '@lucide/vue';
import useStore from '@theme/stores/playground';
import {
  playgroundEntriesKey,
  type PlaygroundEntries,
} from '@theme/composables/usePlaygroundEntries';
import { usePlaygroundSelection } from '@theme/composables/usePlaygroundSelection';
import PlaygroundActions from './PlaygroundActions.vue';
import PlaygroundAnimationSection from './PlaygroundAnimationSection.vue';
import PlaygroundAnimationNameSection from './PlaygroundAnimationNameSection.vue';
import PlaygroundColorSection from './PlaygroundColorSection.vue';
import PlaygroundComponentSection from './PlaygroundComponentSection.vue';
import PlaygroundFontSection from './PlaygroundFontSection.vue';
import PlaygroundOutputSection from './PlaygroundOutputSection.vue';
import PlaygroundPresetSection from './PlaygroundPresetSection.vue';
import PlaygroundTagsSection from './PlaygroundTagsSection.vue';
import PlaygroundTransformSection from './PlaygroundTransformSection.vue';

defineProps<{
  seed: string;
  closable?: boolean;
}>();

const emit = defineEmits<{
  'how-to-use': [];
  close: [];
}>();

const injected = inject(playgroundEntriesKey);

if (!injected) {
  throw new Error('PlaygroundInspector needs the entries of PlaygroundApp.');
}

const entries: PlaygroundEntries = injected;

const store = useStore();
const { selected } = usePlaygroundSelection();

const component = computed(() => {
  const entry = selected.value;

  return entry?.kind === 'component'
    ? entries.components.value.find((c) => c.name === entry.name)
    : undefined;
});

// A color of the same name as the component, which people look for in the
// component first.
const componentHasColor = computed(
  () =>
    !!component.value &&
    entries.colors.value.some((c) => c.name === component.value?.name),
);

const color = computed(() => {
  const entry = selected.value;

  return entry?.kind === 'color'
    ? entries.colors.value.find((c) => c.name === entry.name)
    : undefined;
});

// The colors that are chosen to contrast with the selected one.
const contrastedBy = computed(() =>
  color.value
    ? entries.colors.value
        .filter((c) => c.contrastTo === color.value?.name)
        .map((c) => c.name)
    : [],
);

const general = computed(() =>
  selected.value?.kind === 'general' ? selected.value.id : undefined,
);

const title = computed(() => {
  const entry = selected.value;

  if (!entry) return '';
  if (entry.kind === 'general') {
    return entries.generalEntries.value.find((g) => g.id === entry.id)?.label;
  }

  return capitalCase(entry.name);
});

const changed = computed(() =>
  selected.value ? entries.isChanged(selected.value) : false,
);

function reset() {
  if (selected.value) {
    entries.resetEntry(selected.value);
  }
}
</script>

<template>
  <div class="pg-inspector">
    <div class="pg-inspector-body">
      <template v-if="selected">
        <div class="pg-inspector-head">
          <h2 class="pg-inspector-title">{{ title }}</h2>
          <button
            v-if="changed"
            type="button"
            class="pg-field-reset"
            @click="reset"
          >
            Reset
          </button>
          <button
            v-if="closable"
            type="button"
            class="site-btn site-btn-ghost site-btn-icon site-btn-sm pg-inspector-close"
            aria-label="Close"
            @click="emit('close')"
          >
            <X :size="18" aria-hidden="true" />
          </button>
        </div>

        <PlaygroundComponentSection
          v-if="component"
          :key="`${store.avatarStyleName}-${component.name}`"
          :component-name="component.name"
          :variants="component.variants"
          :has-probability="component.hasProbability"
          :default-probability="component.defaultProbability"
          :has-non-default-weights="component.hasNonDefaultWeights"
          :default-weights="component.defaultWeights"
          :has-color="componentHasColor"
        />

        <PlaygroundColorSection
          v-else-if="color"
          :key="`${store.avatarStyleName}-${color.key}`"
          :color-name="color.name"
          :default-values="color.defaultValues"
          :has-fill="color.hasFill"
          :has-angle="color.hasAngle"
          :has-fill-stops="color.hasFillStops"
          :has-order="color.hasOrder"
          :contrast-to="color.contrastTo"
          :contrasted-by="contrastedBy"
        />

        <div v-else-if="general === 'canvas'" class="pg-inspector-stack">
          <PlaygroundTransformSection :key="store.avatarStyleName" />
          <div v-if="entries.hasFont.value" class="pg-group">
            <div class="pg-group-head">
              <h3 class="pg-group-title">Font</h3>
            </div>
            <PlaygroundFontSection
              :key="store.avatarStyleName"
              :has-font-family="entries.hasFontFamily.value"
              :has-font-weight="entries.hasFontWeight.value"
            />
          </div>
        </div>

        <PlaygroundOutputSection v-else-if="general === 'output'" />

        <PlaygroundPresetSection
          v-else-if="general === 'presets'"
          :key="store.avatarStyleName"
        />

        <div v-else-if="general === 'motion'" class="pg-inspector-stack">
          <PlaygroundAnimationSection
            :key="store.avatarStyleName"
            :names="entries.animationNames.value"
          />
          <div
            v-if="entries.animationNames.value.length > 0"
            class="pg-inspector-rows"
          >
            <PlaygroundAnimationNameSection
              v-for="name in entries.animationNames.value"
              :key="`${store.avatarStyleName}-${name}`"
              :name="name"
            />
          </div>
        </div>

        <div v-else-if="general === 'tags'" class="pg-inspector-stack">
          <p class="pg-help">
            Allow keeps only matching variants, disallow drops them. A component
            with a variant chosen by hand ignores the filter.
          </p>
          <div class="pg-inspector-rows">
            <PlaygroundTagsSection
              v-for="group in entries.tagCategories.value"
              :key="`${store.avatarStyleName}-${group.category}`"
              :category="group"
            />
          </div>
        </div>
      </template>
    </div>

    <div class="pg-inspector-actions">
      <PlaygroundActions :seed="seed" @how-to-use="emit('how-to-use')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-inspector {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;

  /* The sections query this column by name: it is always narrower than
     the old options column, so they take their compact layout. */
  &-body {
    flex: 1;
    min-height: 0;
    padding: 20px 12px 24px;
    overflow-y: auto;
    container: pg-options / inline-size;
  }

  &-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  &-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
  }

  & &-close {
    margin-right: -6px;
  }

  &-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Rows behind hairlines, closed by one at the end. */
  &-rows {
    border-bottom: 1px solid var(--db-line);
  }

  /* Fixed under the options, whatever is open above. */
  &-actions {
    flex-shrink: 0;
    padding: 16px 12px 20px;
    border-top: 1px solid var(--db-line);
    background: var(--db-paper);
  }

  @media (max-width: 959px) {
    &-body {
      padding: 16px 16px 20px;
    }

    &-actions {
      position: sticky;
      bottom: 0;
      padding: 12px 16px 16px;
    }
  }
}
</style>
