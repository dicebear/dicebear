<script setup lang="ts">
/**
 * A rounded avatar tile. Renders through the HTTP API by default, which the
 * CDN caches, or locally through the library where a page shows many
 * option sets at once (preset tiles, variant previews).
 *
 * A parent can resize the tile at a breakpoint through `--site-avatar-size`
 * and `--site-avatar-radius`, which the inline size would otherwise override.
 */
import { computedAsync } from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';

const props = withDefaults(
  defineProps<{
    styleName: string;
    options?: Record<string, unknown>;
    size: number;
    radius?: number;
    mode?: 'library' | 'http-api';
    alt?: string;
    lazy?: boolean;
  }>(),
  {
    options: () => ({}),
    radius: 20,
    mode: 'http-api',
    alt: '',
    lazy: true,
  },
);

// Every prop is read before the first await. What a computed touches after
// one is no longer tracked, and the tile would then keep the options it
// happened to start with.
const src = computedAsync(async () => {
  const { styleName, mode } = props;
  const options = clonePlain(props.options);

  if (mode === 'http-api') {
    return getAvatarApiUrl(styleName, options);
  }
  try {
    const style = await loadAvatarStyle(styleName);
    return new Avatar(style, options).toDataUri();
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('Avatar render failed:', e);
    }
    return undefined;
  }
}, undefined);
</script>

<template>
  <div
    class="site-tile site-avatar"
    :style="{
      width: `var(--site-avatar-size, ${size}px)`,
      height: `var(--site-avatar-size, ${size}px)`,
      borderRadius: `var(--site-avatar-radius, ${radius}px)`,
    }"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :width="size"
      :height="size"
      :loading="lazy ? 'lazy' : 'eager'"
      decoding="async"
    />
  </div>
</template>
