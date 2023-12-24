<script setup lang="ts">
import useStore from '../store';
import LicenseText from './LicenseText.vue';
import { capitalCase } from 'change-case';
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import Avatar from '@shared/components/Avatar.vue';

const store = useStore();
const data = useData<ThemeOptions>();

const options = Object.keys(data.theme.value.avatarStyles)
  .sort()
  .map((key) => ({
    value: key,
    title: capitalCase(key),
  }));
</script>

<template>
  <v-row dense>
    <v-col :cols="12">
      <v-label class="mb-2" for="avatarStyle">
        Avatar Style
        <v-badge content="+25" inline></v-badge>
      </v-label>
      <v-select
        id="avatarStyle"
        :items="options"
        item-title="title"
        item-value="value"
        v-model="store.avatarStyleName"
        :hide-details="true"
        variant="solo"
        :menu-props="{ maxHeight: '420px' }"
      >
        <template #prepend-inner>
          <Avatar
            :size="40"
            :styleName="store.avatarStyleName"
            :style-options="{ seed: 'JD' }"
          />
        </template>
        <template #item="item">
          <v-list-item :key="item.index" v-bind="item.props">
            <template #prepend>
              <Avatar
                :size="32"
                :style-name="item.item.value"
                :style-options="{ seed: 'JD' }"
                class="mr-3"
              />
            </template>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
    <v-col :cols="12">
      <div class="license">
        <div class="license-text">
          <LicenseText />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.license {
  &-text {
    font-size: 12px;
    line-height: 1.3;
    color: var(--el-color-info);
    opacity: 0.65;
  }
}
</style>
