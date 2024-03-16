<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import Code from '@shared/components/Code.vue';
import { paramCase } from 'change-case';

const { theme } = useData<ThemeOptions>();

const props = defineProps<{
  styleName: string;
}>();

const style = computed(() => {
  return theme.value.avatarStyles[props.styleName];
});

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/8.x/${paramCase(props.styleName)}/svg`;
});

const schemaJsonHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/8.x/${paramCase(
    props.styleName
  )}/schema.json`;
});

const exampleCollectionImport = computed(() => {
  return `import { ${props.styleName} } from '@dicebear/collection';`;
});

const examplePackageImport = computed(() => {
  return `import * as style from '@dicebear/${paramCase(props.styleName)}';`;
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
        <td>Collection Import</td>
        <td>
          <Code lang="js" :code="exampleCollectionImport" />
        </td>
      </tr>
      <tr>
        <td>Package Import</td>
        <td>
          <Code lang="js" :code="examplePackageImport" />
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
            ref="noopener noreferrer"
          >
            {{ exampleHttpApiUrl }}
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <a
            href="https://json-schema.org/"
            target="_blank"
            rel="nnoopener noreferrer"
            >JSON Schema</a
          >
        </td>
        <td>
          <a
            :href="schemaJsonHttpApiUrl"
            target="_blank"
            ref="noopener noreferrer"
          >
            {{ schemaJsonHttpApiUrl }}
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
            v-if="style.meta.homepage"
            :href="style.meta.homepage"
            target="_blank"
            ref="noopener noreferrer"
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
            :href="style.meta.homepage"
            target="_blank"
            ref="noopener noreferrer"
            >{{ style.meta.homepage }}</a
          >
        </td>
      </tr>
      <tr v-if="style.meta.license">
        <td>License</td>
        <td>
          <a
            v-if="style.meta.license.url"
            :href="style.meta.license.url"
            target="_blank"
            ref="noopener noreferrer"
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
            :href="style.meta.source"
            target="_blank"
            ref="noopener noreferrer"
            >{{ style.meta.source }}</a
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>
