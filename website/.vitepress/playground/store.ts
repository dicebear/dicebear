import { defineStore } from 'pinia';
import { computed, ref, watch, unref } from 'vue';
import isEqual from 'lodash/isEqual';
import type {
  PlaygroundStoreStyle,
  PlaygroundStoreOptions,
} from '@shared/types';
import { useAvatarStyleDefaults } from '@shared/composables/avatar';
import { useData } from 'vitepress';
import { camelCase } from 'change-case';

export default defineStore('playground', () => {
  const data = useData();

  const availableAvatarStyles = Object.keys(data.theme.value.avatarStyles);

  let defaultAvatarStyleName = camelCase(
    new URL(window.location.href).searchParams.get('style') ??
      availableAvatarStyles[0]
  );

  if (false === availableAvatarStyles.includes(defaultAvatarStyleName)) {
    defaultAvatarStyleName = availableAvatarStyles[0];
  }

  const avatarStyleName = ref<PlaygroundStoreStyle>(defaultAvatarStyleName);

  const avatarStyleDefaults = useAvatarStyleDefaults(avatarStyleName);

  const avatarStyleOptions = ref<PlaygroundStoreOptions>({
    ...unref(avatarStyleDefaults),
  });

  const avatarStyleOptionsWithoutDefaults = computed(() => {
    const calculatedOptions: PlaygroundStoreOptions = {};

    for (let key in avatarStyleOptions.value) {
      if (false === avatarStyleOptions.value.hasOwnProperty(key)) {
        continue;
      }

      const value = avatarStyleOptions.value[key];
      const defaultValue = avatarStyleDefaults.value?.[key];

      if (value !== undefined && false === isEqual(value, defaultValue)) {
        calculatedOptions[key] = value;
      }
    }

    return calculatedOptions;
  });

  watch(avatarStyleDefaults, (newValue, oldValue) => {
    if (newValue === oldValue) {
      return;
    }

    avatarStyleOptions.value = {
      ...unref(avatarStyleDefaults),
    };
  });

  return {
    avatarStyleName,
    avatarStyleOptions,
    avatarStyleOptionsWithoutDefaults,
  };
});
