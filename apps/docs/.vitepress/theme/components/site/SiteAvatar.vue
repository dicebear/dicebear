<script setup lang="ts">
/**
 * A rounded avatar tile. Renders through the HTTP API by default, which the
 * CDN caches, or locally through the library where a page shows many
 * option sets at once (preset tiles, variant previews).
 *
 * Without a size the tile fills its column. `sticker` puts it on the white
 * card with a shadow. The corners are a quarter of the size unless a radius
 * is given. A parent can resize the tile at a breakpoint through
 * `--site-avatar-size` and `--site-avatar-radius`, which the inline size
 * would otherwise override.
 */
import { computed } from 'vue';
import { computedAsync } from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';

const props = withDefaults(
  defineProps<{
    styleName: string;
    options?: Record<string, unknown>;
    size?: number;
    radius?: number;
    mode?: 'library' | 'http-api';
    alt?: string;
    lazy?: boolean;
    sticker?: boolean;
  }>(),
  {
    options: () => ({}),
    size: undefined,
    radius: undefined,
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

const tileStyle = computed(() =>
  props.size === undefined
    ? props.sticker
      ? undefined
      : { width: '100%', aspectRatio: '1' }
    : {
        width: `var(--site-avatar-size, ${props.size}px)`,
        height: props.sticker
          ? undefined
          : `var(--site-avatar-size, ${props.size}px)`,
        borderRadius:
          props.radius === undefined || props.sticker
            ? undefined
            : `var(--site-avatar-radius, ${props.radius}px)`,
      },
);

const imgAttrs = computed(() => ({
  src: src.value,
  alt: props.alt,
  width: props.size ?? 256,
  height: props.size ?? 256,
  loading: props.lazy ? ('lazy' as const) : ('eager' as const),
  decoding: 'async' as const,
}));
</script>

<template>
  <div
    :class="sticker ? 'site-sticker' : 'site-tile site-avatar'"
    :style="tileStyle"
  >
    <div v-if="sticker" class="site-tile site-avatar">
      <img v-if="src" v-bind="imgAttrs" />
    </div>
    <img v-else-if="src" v-bind="imgAttrs" />
  </div>
</template>
