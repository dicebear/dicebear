<script setup lang="ts">
/**
 * The Output entry: the size of the file, the accessible title and the
 * randomised element ids.
 */
import { computed, useId } from 'vue';
import useStore from '@theme/stores/playground';
import SiteTextField from '@theme/components/site/SiteTextField.vue';
import SiteNumberField from '@theme/components/site/SiteNumberField.vue';
import SiteSwitch from '@theme/components/site/SiteSwitch.vue';
import PlaygroundFieldReset from './PlaygroundFieldReset.vue';

const store = useStore();

const sizeKey = 'size';
const titleKey = 'title';
const idRandomizationKey = 'idRandomization';

const size = computed({
  get: () => {
    const val = store.avatarStyleOptions[sizeKey];

    return typeof val === 'number' ? val : null;
  },
  set: (val: number | null) => {
    if (val === null || Number.isNaN(val)) {
      delete store.avatarStyleOptions[sizeKey];
    } else {
      store.avatarStyleOptions[sizeKey] = val;
    }
  },
});

const title = computed({
  get: () => {
    const val = store.avatarStyleOptions[titleKey];

    return typeof val === 'string' ? val : '';
  },
  set: (val: string) => {
    if (val === '') {
      delete store.avatarStyleOptions[titleKey];
    } else {
      store.avatarStyleOptions[titleKey] = val;
    }
  },
});

const idRandomization = computed({
  get: () => store.avatarStyleOptions[idRandomizationKey] === true,
  set: (val: boolean) => {
    if (val) {
      store.avatarStyleOptions[idRandomizationKey] = true;
    } else {
      delete store.avatarStyleOptions[idRandomizationKey];
    }
  },
});

const idRandomizationId = useId();
</script>

<template>
  <div class="pg-output">
    <div class="pg-fields">
      <div class="pg-field">
        <div class="pg-field-label">
          <span>Size</span>
          <span class="pg-field-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(sizeKey)"
              @click="store.resetOption(sizeKey)"
            />
          </span>
        </div>
        <SiteNumberField
          v-model="size"
          :min="1"
          :max="4096"
          :step="1"
          placeholder="Auto"
          suffix="px"
          show-buttons
          fluid
          aria-label="Size"
        />
      </div>

      <div class="pg-field">
        <div class="pg-field-label">
          <span>Title</span>
          <span class="pg-field-tools">
            <PlaygroundFieldReset
              v-if="store.isOptionSet(titleKey)"
              @click="store.resetOption(titleKey)"
            />
          </span>
        </div>
        <SiteTextField
          v-model="title"
          fluid
          placeholder="Accessible title"
          aria-label="Title"
        />
      </div>
    </div>

    <div class="pg-output-switch">
      <label :for="idRandomizationId">Randomize element IDs</label>
      <PlaygroundFieldReset
        v-if="store.isOptionSet(idRandomizationKey)"
        @click="store.resetOption(idRandomizationKey)"
      />
      <SiteSwitch :id="idRandomizationId" v-model="idRandomization" />
    </div>

    <p class="pg-help">
      Title and random IDs need the library or
      <a href="/recipes/self-host-the-http-api/">your own API instance</a>.
    </p>
  </div>
</template>

<style scoped lang="scss">
.pg-output {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg-output-switch {
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    flex: 1;
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink);
    cursor: pointer;
  }
}
</style>
