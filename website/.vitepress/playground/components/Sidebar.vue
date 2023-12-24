<script setup lang="ts">
import SidebarAvatarStyle from './SidebarAvatarStyle.vue';
import useStore from '../store';
import { computed } from 'vue';
import { JSONSchema7 } from 'json-schema';
import { useAvatarStyleSchema } from '@shared/composables/avatar';
import { storeToRefs } from 'pinia';
import SidebarAvatarOption from './SidebarAvatarOption.vue';
import { paramCase } from 'change-case';

const store = useStore();
const { avatarStyleName } = storeToRefs(store);

const schema = useAvatarStyleSchema(avatarStyleName);

const properties = computed(() => {
  const result: Record<string, JSONSchema7> = {};

  if (schema.value?.properties) {
    for (const [key, value] of Object.entries(schema.value.properties)) {
      if (['dataUri', 'seed', 'size', 'clip'].includes(key)) {
        continue;
      }

      if (typeof value === 'object') {
        result[key] = value;
      }
    }
  }

  return result;
});
</script>

<template>
  <div class="sidebar">
    <v-row>
      <v-col :cols="12">
        <SidebarAvatarStyle />
      </v-col>
      <v-col
        :cols="12"
        v-for="(property, field) in properties"
        class="sidebar-col"
      >
        <SidebarAvatarOption :field="field" :schema="property" />
      </v-col>
      <v-col :cols="12">
        <v-btn
          block
          variant="tonal"
          :href="`/styles/${paramCase(store.avatarStyleName)}#options`"
          >More options</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  padding: 6px 3px 0;

  &-col:empty {
    display: none;
  }

  :deep(.v-theme--light) {
    --v-theme-surface: 255, 255, 255 !important;

    &.v-field {
      box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
      transition-property: box-shadow, transform;
      transition-duration: 0.2s;
      transition-timing-function: ease;

      &.v-field--focused,
      &:hover {
        box-shadow: rgb(0 0 0 / 16%) 0px 2px 8px;
        transform: translateY(-1px);
      }
    }
  }

  :deep(.v-theme--dark) {
    &.v-field {
      transition-property: background-color;
      transition-duration: 0.2s;
      transition-timing-function: ease;

      &.v-field--focused,
      &:hover {
        --v-theme-surface: 50, 50, 50 !important;
      }
    }
  }

  @media (min-width: 960px) {
    padding-top: 22px;
  }
}
</style>
