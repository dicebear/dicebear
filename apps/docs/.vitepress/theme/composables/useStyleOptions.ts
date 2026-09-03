import { computed, type ComputedRef, type Ref } from 'vue';
import { OptionsDescriptor, type Style } from '@dicebear/core';
import { computedAsync } from '@vueuse/core';
import { loadAvatarStyle } from '@theme/utils/avatar/style';
import { getStyleColorsMap } from '@theme/utils/avatar/colors';
import { ComponentPreview } from '@theme/utils/componentPreview';

export type StyleOptionsContext = {
  loadedStyle: Ref<Style | null>;
  descriptor: ComputedRef<ReturnType<OptionsDescriptor['toJSON']>>;
  componentNames: ComputedRef<string[]>;
  colorNames: ComputedRef<string[]>;
  /** Names of the style's declarative animations, sorted, empty when it has none. */
  animationNames: ComputedRef<readonly string[]>;
  styleColors: ComputedRef<Record<string, string[]>>;
  preview: ComputedRef<ComponentPreview | null>;
};

export function useStyleOptions(styleName: Ref<string>): StyleOptionsContext {
  const loadedStyle = computedAsync(async () => {
    return await loadAvatarStyle(styleName.value);
  }, null);

  const descriptor = computed(() => {
    if (!loadedStyle.value) {
      return {} as ReturnType<OptionsDescriptor['toJSON']>;
    }

    return new OptionsDescriptor(loadedStyle.value).toJSON();
  });

  const componentNames = computed(() => {
    if (!loadedStyle.value) {
      return [];
    }

    return Array.from(loadedStyle.value.components().keys()).sort((a, b) =>
      a.localeCompare(b),
    );
  });

  const colorNames = computed(() => {
    if (!loadedStyle.value) {
      return [];
    }

    const keys = Array.from(loadedStyle.value.colors().keys());
    const rest = keys
      .filter((n) => n !== 'background')
      .sort((a, b) => a.localeCompare(b));

    return keys.includes('background') ? ['background', ...rest] : rest;
  });

  const animationNames = computed<readonly string[]>(() =>
    loadedStyle.value ? loadedStyle.value.animationNames() : [],
  );

  const styleColors = computed<Record<string, string[]>>(() =>
    loadedStyle.value ? getStyleColorsMap(loadedStyle.value) : {},
  );

  const preview = computed(() =>
    loadedStyle.value ? new ComponentPreview(loadedStyle.value) : null,
  );

  return {
    loadedStyle,
    descriptor,
    componentNames,
    colorNames,
    animationNames,
    styleColors,
    preview,
  };
}
