<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import { paramCase } from 'param-case';

const { theme } = useData<ThemeOptions>();
const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const playgroundUrl = computed(() => {
  return `/playground?style=${paramCase(props.styleName)}`;
});

const editorUrl = computed(() => {
  return `https://editor.dicebear.com/?style=${paramCase(props.styleName)}`;
});
</script>

<template>
  <p>
    <template v-if="style.meta?.creator !== 'DiceBear' && style.meta?.title">
        <template v-if="style.meta?.license?.name !== 'MIT'">
            This avatar style is a remix of:
        </template>
        <template v-else>
            This avatar style is based on:
        </template>
    </template>
    <a
      :href="style.meta?.source"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ style.meta?.title ?? 'Design' }}
    </a>
    by
    <a
      :href="style.meta?.homepage"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ style.meta?.creator }} </a
    >, licensed under
    <a
      :href="style.meta?.license?.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ style.meta?.license?.name.replace(/\.$/, '') }}
    </a>
    .
  </p>

  <div class="info custom-block" v-if="style.meta.license?.name !== 'MIT'">
    <p class="custom-block-title">LICENSE</p>
    <p>
      While our code is MIT licensed, the design of this avatar style is licensed under
      <a
        :href="style.meta.license?.url"
        target="_blank"
        ref="noopener noreferrer"
        >{{ style.meta.license?.name.replace(/\.$/, '') }}</a
      >. See <a href="#details">details</a> for more information.
    </p>
  </div>

  <v-btn
    :href="playgroundUrl"
    target="_blank"
    color="primary"
    variant="tonal"
    class="mr-2"
  >
    Open in Playground
  </v-btn>
</template>
