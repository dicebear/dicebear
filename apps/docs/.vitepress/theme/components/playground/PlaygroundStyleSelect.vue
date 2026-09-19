<script setup lang="ts">
import { ref, computed } from 'vue';
import { capitalCase } from 'change-case';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';
import { Plus, Trash2 } from '@lucide/vue';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import {
  CUSTOM_CATEGORY,
  exampleSeeds,
  type LicenseBucket,
} from '@theme/config/styleCategories';
import useStore from '@theme/stores/playground';
import { ThemeOptions } from '@theme/types';
import { track, styleLabel } from '@theme/utils/track';
import SiteDialog from '../site/SiteDialog.vue';
import SiteSearch from '../site/SiteSearch.vue';
import SiteSelect from '../site/SiteSelect.vue';
import PlaygroundCustomStyleUpload from './PlaygroundCustomStyleUpload.vue';
import PlaygroundPickerTrigger from './PlaygroundPickerTrigger.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';

const store = useStore();
const { avatarStyleName, customStyles } = storeToRefs(store);
const { theme } = useData<ThemeOptions>();

const open = ref(false);
const uploadOpen = ref(false);

const {
  searchQuery,
  selectedCategories,
  selectedLicenses,
  availableCategories,
  availableLicenses,
  groupedStyles,
  styleList,
} = useStyleFiltering(theme.value.avatarStyles, customStyles);

function selectStyle(name: string) {
  avatarStyleName.value = name;
  open.value = false;

  track('Playground: Style Selected', { style: styleLabel(name) });
}

function onCustomStyleAdded(key: string) {
  uploadOpen.value = false;
  selectStyle(key);
}

const ALL = 'all';

// Each select picks one value or all of them. The filter itself keeps lists,
// so one value becomes a list of one and "all" the empty list.
function singleChoice(list: typeof selectedCategories) {
  return computed<string>({
    get: () => list.value[0] ?? ALL,
    set: (value) => (list.value = value === ALL ? [] : [value]),
  });
}

const category = singleChoice(selectedCategories);
const license = singleChoice(selectedLicenses);

const categoryOptions = computed(() => [
  { value: ALL, label: 'All categories' },
  ...availableCategories.value.map((name) => ({ value: name, label: name })),
]);

const licenseOptions = computed(() => [
  { value: ALL, label: 'All licenses' },
  ...availableLicenses.value.map((name) => ({ value: name, label: name })),
]);

const licenseTones: Record<LicenseBucket, string> = {
  'CC0 1.0': 'site-chip-ok',
  'CC BY 4.0': 'site-chip-brand',
  MIT: 'site-chip-muted',
  Other: 'site-chip-warn',
};

interface Tile {
  name: string;
  displayName: string;
  creator?: string;
  custom: boolean;
  chip: string;
  chipTone: string;
  /** Held per tile, so the thumbnail keeps its options between renders. */
  options: { seed: string };
}

interface Group {
  name: string;
  custom: boolean;
  tiles: Tile[];
}

// The search is the only filter for uploaded styles, they carry neither a
// license bucket nor a creator.
const customTiles = computed<Tile[]>(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return Object.entries(store.customStyles)
    .map(([key, entry]) => ({ key, name: entry.name }))
    .filter((cs) => !query || cs.name.toLowerCase().includes(query))
    .map((cs) => ({
      name: cs.key,
      displayName: cs.name,
      custom: true,
      chip: 'Custom',
      chipTone: 'site-chip-warn',
      options: { seed: exampleSeeds[0] },
    }));
});

const groups = computed<Group[]>(() => {
  const result: Group[] = [];

  // The Custom group always holds the entry that adds a style, so it shows
  // even while it has no styles.
  if (
    selectedCategories.value.length === 0 ||
    selectedCategories.value.includes(CUSTOM_CATEGORY)
  ) {
    result.push({
      name: CUSTOM_CATEGORY,
      custom: true,
      tiles: customTiles.value,
    });
  }

  for (const [name, styles] of Object.entries(groupedStyles.value)) {
    if (name === CUSTOM_CATEGORY) continue;

    result.push({
      name,
      custom: false,
      tiles: styles.map((style) => ({
        name: style.name,
        displayName: style.displayName,
        creator: style.creator,
        custom: false,
        chip: style.licenseNormalized,
        chipTone:
          licenseTones[style.licenseNormalized as LicenseBucket] ??
          'site-chip-muted',
        options: { seed: style.avatars[0]?.seed ?? exampleSeeds[0] },
      })),
    });
  }

  return result;
});

const current = computed(() => {
  if (store.isCustomStyle) {
    return {
      name: store.customStyles[avatarStyleName.value]?.name ?? 'Custom Style',
      hint: 'Custom',
    };
  }

  const creator = theme.value.avatarStyles[avatarStyleName.value]?.meta.creator;

  return {
    name: capitalCase(avatarStyleName.value),
    hint: creator ? `by ${creator}` : undefined,
  };
});

const triggerOptions = { seed: exampleSeeds[0] };
</script>

<template>
  <PlaygroundPickerTrigger
    :title="current.name"
    :hint="current.hint"
    @click="open = true"
  >
    <template #thumb>
      <PlaygroundThumb
        :style-name="avatarStyleName"
        :options="triggerOptions"
        surface="tile"
      />
    </template>
  </PlaygroundPickerTrigger>

  <SiteDialog
    v-model:open="open"
    header="Choose an avatar style"
    max-width="1000px"
  >
    <div class="pg-style-select">
      <div class="pg-style-select-toolbar">
        <SiteSearch
          v-model="searchQuery"
          class="pg-style-select-search"
          placeholder="Search styles..."
          label="Search styles"
        />
        <SiteSelect
          v-model="category"
          class="pg-style-select-filter"
          :options="categoryOptions"
          label="Filter by category"
          fluid
        />
        <SiteSelect
          v-model="license"
          class="pg-style-select-filter"
          :options="licenseOptions"
          label="Filter by license"
          fluid
        />
      </div>

      <section
        v-for="group in groups"
        :key="group.name"
        class="pg-style-select-group"
      >
        <h3 class="site-label pg-style-select-group-title">{{ group.name }}</h3>
        <div class="pg-style-select-grid">
          <button
            v-if="group.custom"
            type="button"
            class="pg-style-select-add hv-dashed"
            @click="uploadOpen = true"
          >
            <Plus :size="28" aria-hidden="true" />
            Add a custom style
          </button>

          <div
            v-for="tile in group.tiles"
            :key="tile.name"
            class="pg-style-select-item"
          >
            <button
              type="button"
              class="pg-style-select-tile hv-tile"
              :aria-pressed="tile.name === avatarStyleName"
              @click="selectStyle(tile.name)"
            >
              <PlaygroundThumb
                :style-name="tile.name"
                :options="tile.options"
                :mode="tile.custom ? 'library' : 'http-api'"
                surface="tile"
              />
              <span class="pg-style-select-name">{{ tile.displayName }}</span>
              <span v-if="tile.creator" class="pg-style-select-creator">
                {{ tile.creator }}
              </span>
              <span class="site-chip" :class="tile.chipTone">
                {{ tile.chip }}
              </span>
            </button>
            <button
              v-if="tile.custom"
              type="button"
              class="pg-style-select-remove hv-ghost"
              aria-label="Remove"
              data-tip="Remove"
              @click="store.removeCustomStyle(tile.name)"
            >
              <Trash2 :size="16" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <p
        v-if="styleList.length === 0 && searchQuery"
        class="pg-style-select-empty"
      >
        No styles found matching "{{ searchQuery }}"
      </p>
    </div>

    <!-- Inside this dialog, so the upload dialog stacks above it. -->
    <PlaygroundCustomStyleUpload
      v-model:open="uploadOpen"
      @added="onCustomStyleAdded"
    />
  </SiteDialog>
</template>

<style scoped lang="scss">
.pg-style-select {
  padding: 0 28px 28px;

  @media (max-width: 640px) {
    padding: 0 20px 20px;
  }

  // The filters stay in view while the list scrolls below them.
  &-toolbar {
    position: sticky;
    z-index: 2;
    top: 0;
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
    padding: 20px 0 8px;
    background: var(--db-panel);

    @media (max-width: 640px) {
      grid-template-columns: minmax(0, 1fr);
      padding-top: 16px;
    }
  }

  & &-search {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    border-radius: var(--db-radius-3);

    :deep(.site-search-input) {
      font-size: 16px;
    }
  }

  &-filter :deep(.site-select-input) {
    height: 48px;
    padding-left: 14px;
    border-radius: var(--db-radius-3);
  }

  &-group {
    padding-top: 20px;

    &-title {
      margin: 0;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 12px;
    margin-top: 12px;

    @media (max-width: 959px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @media (max-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &-item {
    position: relative;
    min-width: 0;
  }

  &-tile {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    height: 100%;
    min-width: 0;
    padding: 8px 8px 10px;
    border: 1px solid var(--db-line);
    border-radius: 14px;
    background: transparent;
    font: inherit;
    color: var(--db-ink);
    text-align: left;
    cursor: pointer;

    // The ring is drawn inside the border, so a selected tile keeps its size.
    &[aria-pressed='true'] {
      border-color: var(--db-brand);
      box-shadow: inset 0 0 0 1px var(--db-brand);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }

  &-creator {
    max-width: 100%;
    margin-top: -6px;
    font-size: 12px;
    line-height: 16px;
    color: var(--db-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-remove {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid var(--db-line);
    border-radius: var(--db-radius-2);
    background: var(--db-paper);
    color: var(--db-muted);
    cursor: pointer;
  }

  &-add {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 180px;
    padding: 10px;
    border: 1px dashed var(--db-btn-border);
    border-radius: 14px;
    background: transparent;
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: var(--db-ink-2);
    text-align: center;
    cursor: pointer;

    svg {
      color: var(--db-muted);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-empty {
    margin: 0;
    padding: 40px 0 12px;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-muted);
    text-align: center;
  }
}
</style>
