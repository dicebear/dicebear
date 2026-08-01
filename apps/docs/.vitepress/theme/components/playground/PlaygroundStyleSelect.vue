<script setup lang="ts">
import { ref, computed } from 'vue';
import { capitalCase } from 'change-case';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';
import { Plus, Trash2 } from '@lucide/vue';
import ChevronRightIcon from '@primevue/icons/chevronright';
import { useStyleFiltering } from '@theme/composables/useStyleFiltering';
import { CUSTOM_CATEGORY, exampleSeeds } from '@theme/config/styleCategories';
import useStore from '@theme/stores/playground';
import { ThemeOptions } from '@theme/types';
import { UiAvatar } from '../ui';
import { track, styleLabel } from '@theme/utils/track';
import PlaygroundCustomStyleUpload from './PlaygroundCustomStyleUpload.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Tag from 'primevue/tag';

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

function deleteCustomStyle(key: string, event: Event) {
  event.stopPropagation();
  store.removeCustomStyle(key);
}

const customStyleList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return Object.entries(store.customStyles)
    .map(([key, entry]) => ({ key, name: entry.name }))
    .filter((cs) => !query || cs.name.toLowerCase().includes(query));
});

const builtInGroupedStyles = computed(() => {
  const result: Record<string, (typeof groupedStyles.value)[string]> = {};

  for (const [category, styles] of Object.entries(groupedStyles.value)) {
    if (category !== CUSTOM_CATEGORY) {
      result[category] = styles;
    }
  }

  return result;
});

const currentDisplayName = computed(() => {
  if (store.isCustomStyle) {
    return store.customStyles[avatarStyleName.value]?.name ?? 'Custom Style';
  }

  return capitalCase(avatarStyleName.value);
});
</script>

<template>
  <button type="button" class="pg-style-select-trigger" @click="open = true">
    <span class="pg-style-select-trigger-avatar">
      <UiAvatar
        :size="40"
        :style-name="avatarStyleName"
        :style-options="{ seed: exampleSeeds[0] }"
        mode="library"
      />
    </span>

    <span class="pg-style-select-trigger-name">{{ currentDisplayName }}</span>

    <ChevronRightIcon class="pg-style-select-trigger-chevron" />
  </button>

  <Dialog
    v-model:visible="open"
    modal
    :closable="true"
    dismissable-mask
    header="Choose Avatar Style"
    :style="{ width: '900px', maxWidth: 'calc(100vw - 32px)' }"
    :pt="{ content: { class: 'pg-style-select-dialog-content' } }"
  >
    <div class="pg-style-select">
      <div class="pg-style-select-toolbar">
        <InputText v-model="searchQuery" placeholder="Search styles..." fluid />

        <MultiSelect
          v-model="selectedCategories"
          :options="availableCategories"
          placeholder="Filter by category"
          :showToggleAll="false"
          fluid
        />

        <MultiSelect
          v-model="selectedLicenses"
          :options="availableLicenses"
          placeholder="Filter by license"
          :showToggleAll="false"
          fluid
        />
      </div>

      <div class="pg-style-select-body">
        <div
          v-if="
            selectedCategories.length === 0 ||
            selectedCategories.includes(CUSTOM_CATEGORY)
          "
          class="pg-style-select-group"
        >
          <h3 class="pg-style-select-group-title">Custom</h3>
          <div class="pg-style-select-grid">
            <button
              class="pg-style-select-card pg-style-select-card-add"
              @click="uploadOpen = true"
            >
              <div class="pg-style-select-card-add-icon">
                <Plus :size="24" />
              </div>
              <span class="pg-style-select-card-name">Add Custom Style</span>
            </button>

            <div
              v-for="cs in customStyleList"
              :key="cs.key"
              class="pg-style-select-card"
              :class="{
                'pg-style-select-card-selected': cs.key === avatarStyleName,
              }"
              @click="selectStyle(cs.key)"
            >
              <button
                class="pg-style-select-card-delete"
                @click="deleteCustomStyle(cs.key, $event)"
                v-tooltip="'Remove'"
              >
                <Trash2 :size="12" />
              </button>
              <div class="pg-style-select-card-avatars">
                <UiAvatar
                  v-for="seed in ['Felix', 'Aneka', 'Milo', 'Luna']"
                  :key="seed"
                  :size="40"
                  :style-name="cs.key"
                  :style-options="{ seed }"
                  mode="library"
                />
              </div>
              <div class="pg-style-select-card-info">
                <span class="pg-style-select-card-name">{{ cs.name }}</span>
                <Tag
                  value="Custom"
                  severity="warn"
                  class="pg-style-select-card-tag"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(styles, category) in builtInGroupedStyles"
          :key="category"
          class="pg-style-select-group"
        >
          <h3 class="pg-style-select-group-title">{{ category }}</h3>
          <div class="pg-style-select-grid">
            <button
              v-for="style in styles"
              :key="style.name"
              class="pg-style-select-card"
              :class="{
                'pg-style-select-card-selected': style.name === avatarStyleName,
              }"
              @click="selectStyle(style.name)"
            >
              <div class="pg-style-select-card-avatars">
                <UiAvatar
                  v-for="avatar in style.avatars"
                  :key="avatar.seed"
                  :size="40"
                  :style-name="style.name"
                  :style-options="{ seed: avatar.seed }"
                  mode="http-api"
                />
              </div>
              <div class="pg-style-select-card-info">
                <span class="pg-style-select-card-name">{{
                  style.displayName
                }}</span>
              </div>
              <span class="pg-style-select-card-creator">{{
                style.creator
              }}</span>
            </button>
          </div>
        </div>

        <div
          v-if="styleList.length === 0 && searchQuery"
          class="pg-style-select-empty"
        >
          No styles found matching "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </Dialog>

  <PlaygroundCustomStyleUpload
    v-model:open="uploadOpen"
    @added="onCustomStyleAdded"
  />
</template>

<style scoped lang="scss">
.pg-style-select-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 16px 8px 8px;
  background: var(--p-content-background);
  border: 1px solid var(--pg-border);
  border-radius: var(--vp-radius-xs);
  color: var(--p-accordion-header-color);
  cursor: pointer;
  text-align: left;
  transition: color var(--duration-fast);

  &:hover {
    color: var(--p-accordion-header-hover-color);
  }

  &:hover &-chevron {
    color: var(--p-accordion-header-toggle-icon-hover-color);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--p-form-field-focus-border-color);
  }

  &-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-xs);
    overflow: hidden;
  }

  &-name {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--p-accordion-header-toggle-icon-color);
    transition: color var(--duration-fast);
  }
}

.pg-style-select {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-style-select-toolbar {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.pg-style-select-body {
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pg-style-select-group-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-c-text-subtle);
  margin: 0 0 8px;
}

.pg-style-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.pg-style-select-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border: 2px solid transparent;
  border-radius: var(--vp-radius-sm);
  cursor: pointer;
  text-align: left;
  transition: all var(--duration-fast);

  &:hover {
    border-color: var(--vp-c-brand-1);
  }

  &-selected {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }

  &-avatars {
    display: flex;
    gap: 6px;
  }

  &-info {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-tag {
    font-size: 10px;
  }

  &-creator {
    font-size: 12px;
    color: var(--ui-c-text-subtle);
  }

  &-delete {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: var(--vp-radius-xs);
    cursor: pointer;
    opacity: 0;
    transition: all var(--duration-fast);
    color: var(--ui-c-text-subtle);

    &:hover {
      color: var(--vp-c-danger-1);
      border-color: var(--vp-c-danger-1);
    }
  }

  &:hover &-delete {
    opacity: 1;
  }

  &-add {
    border-style: dashed;
    border-color: var(--vp-c-border);
    align-items: center;
    justify-content: center;
    min-height: 120px;

    &:hover {
      border-color: var(--vp-c-brand-1);
    }

    &-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--vp-c-bg);
      color: var(--ui-c-text-subtle);
      transition: all var(--duration-fast);
    }
  }

  &-add:hover &-add-icon {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
  }
}

.pg-style-select-empty {
  text-align: center;
  padding: 40px;
  color: var(--ui-c-text-subtle);
  font-size: 14px;
}

@media (max-width: 640px) {
  .pg-style-select-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
