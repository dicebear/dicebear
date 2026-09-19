<script setup lang="ts">
/**
 * A square avatar thumbnail that fills the width of its container. Avatars of
 * the packaged styles can come from the HTTP API, which the CDN caches.
 * Uploaded styles and option sets render locally through the library.
 */
import { computedAsync } from '@vueuse/core';
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { clonePlain, loadAvatarStyle } from '@theme/utils/avatar/style';

const props = withDefaults(
  defineProps<{
    styleName: string;
    options?: Record<string, unknown>;
    mode?: 'library' | 'http-api';
    /**
     * The checkerboard shows where an avatar is transparent. The tile color
     * is the plain surface behind the avatars of the style picker.
     */
    surface?: 'checker' | 'tile';
    alt?: string;
  }>(),
  { options: () => ({}), mode: 'library', surface: 'checker', alt: '' },
);

// Every prop is read before the first await. What a computed touches after
// one is no longer tracked, and the thumbnail would then keep the options it
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
  <span class="pg-thumb" :class="`pg-thumb-${surface}`">
    <img v-if="src" :src="src" :alt="alt" loading="lazy" decoding="async" />
  </span>
</template>

<style scoped lang="scss">
.pg-thumb {
  display: block;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;

  &-tile {
    background: var(--db-tile);
  }

  &-checker {
    background-color: var(--db-paper);
    background-image:
      linear-gradient(
        45deg,
        var(--db-soft) 25%,
        transparent 25%,
        transparent 75%,
        var(--db-soft) 75%
      ),
      linear-gradient(
        45deg,
        var(--db-soft) 25%,
        transparent 25%,
        transparent 75%,
        var(--db-soft) 75%
      );
    background-size: 20px 20px;
    background-position:
      0 0,
      10px 10px;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
