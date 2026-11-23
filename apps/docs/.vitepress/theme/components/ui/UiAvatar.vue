<script setup lang="ts">
import { Avatar } from '@dicebear/core';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { loadAvatarStyle, clonePlain } from '@theme/utils/avatar/style';
import { computedAsync } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    size?: number;
    styleName: string;
    styleOptions: Record<string, unknown>;
    mode?: 'library' | 'http-api';
    alt?: string;
  }>(),
  {
    mode: 'http-api',
    alt: 'avatar',
  },
);

const svg = computedAsync(() => {
  const styleName = props.styleName;
  // Cloned here, not in the callback below: values read after an await no
  // longer count as dependencies of the computed.
  const styleOptions = clonePlain(props.styleOptions);

  switch (props.mode) {
    case 'library':
      return loadAvatarStyle(styleName)
        .then((avatarStyle) =>
          new Avatar(avatarStyle, styleOptions).toDataUri(),
        )
        .catch((e) => {
          if (import.meta.env.DEV) {
            console.warn('Avatar render failed:', e);
          }

          return undefined;
        });
    case 'http-api':
      return getAvatarApiUrl(styleName, styleOptions);
  }
});
</script>

<template>
  <div class="ui-avatar">
    <img :src="svg" v-if="svg" :alt="alt" loading="lazy" />
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as m;

.ui-avatar {
  width: calc(v-bind(size) * 1px);
  height: calc(v-bind(size) * 1px);
  border-radius: 3px;
  line-height: 0;
  overflow: hidden;

  @include m.avatar-ground;
}
</style>
