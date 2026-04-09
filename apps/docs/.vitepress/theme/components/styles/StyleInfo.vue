<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@theme/types';
import { UiCode as Code } from '../ui';
import { kebabCase } from 'change-case';
import { safeHttpUrl } from '@theme/utils/url';

const { theme } = useData<ThemeOptions>();

const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/10.x/${kebabCase(props.styleName)}/svg`;
});

const exampleDefinitionImport = computed(() => {
  return `import definition from '@dicebear/definitions/${kebabCase(props.styleName)}.json';`;
});

const exampleCliCommand = computed(() => {
  return `dicebear ${props.styleName}`;
});
</script>

<template>
  <table>
    <colgroup>
      <col width="200px" />
      <col />
    </colgroup>

    <thead>
      <tr>
        <th colSpan="2">Naming</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>Definition Import</td>
        <td>
          <Code lang="js" :code="exampleDefinitionImport" />
        </td>
      </tr>
      <tr>
        <td>CLI</td>
        <td>
          <Code :code="exampleCliCommand" />
        </td>
      </tr>
      <tr>
        <td>HTTP-API</td>
        <td>
          <a
            :href="exampleHttpApiUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ exampleHttpApiUrl }}
          </a>
        </td>
      </tr>
      <tr v-if="style.definitionUrl">
        <td>Definition</td>
        <td>
          <a
            :href="style.definitionUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ style.definitionUrl }}
          </a>
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <colgroup>
      <col width="200px" />
      <col />
    </colgroup>

    <thead>
      <tr>
        <th colSpan="2">Source</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="style.meta.title">
        <td>Title</td>
        <td>{{ style.meta.title }}</td>
      </tr>
      <tr v-if="style.meta.creator">
        <td>Creator</td>
        <td>
          <a
            v-if="safeHttpUrl(style.meta.homepage)"
            :href="safeHttpUrl(style.meta.homepage)"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ style.meta.creator }}
          </a>
          <template v-else>
            {{ style.meta.creator }}
          </template>
        </td>
      </tr>
      <tr v-if="style.meta.homepage">
        <td>Website</td>
        <td>
          <a
            v-if="safeHttpUrl(style.meta.homepage)"
            :href="safeHttpUrl(style.meta.homepage)"
            target="_blank"
            rel="noopener noreferrer"
            >{{ style.meta.homepage }}</a
          >
          <template v-else>{{ style.meta.homepage }}</template>
        </td>
      </tr>
      <tr v-if="style.meta.license">
        <td>License</td>
        <td>
          <a
            v-if="safeHttpUrl(style.meta.license.url)"
            :href="safeHttpUrl(style.meta.license.url)"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ style.meta.license.name }}
          </a>
          <template v-else>
            {{ style.meta.license.name }}
          </template>
        </td>
      </tr>
      <tr v-if="style.meta.source">
        <td>Source</td>
        <td>
          <a
            v-if="safeHttpUrl(style.meta.source)"
            :href="safeHttpUrl(style.meta.source)"
            target="_blank"
            rel="noopener noreferrer"
            >{{ style.meta.source }}</a
          >
          <template v-else>{{ style.meta.source }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
