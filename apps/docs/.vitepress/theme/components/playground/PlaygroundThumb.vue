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
    alt?: string;
  }>(),
  { options: () => ({}), mode: 'library', alt: '' },
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
  <span class="pg-thumb">
    <img v-if="src" :src="src" :alt="alt" loading="lazy" decoding="async" />
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as m;

.pg-thumb {
  display: block;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;

  @include m.avatar-ground;
}
</style>
