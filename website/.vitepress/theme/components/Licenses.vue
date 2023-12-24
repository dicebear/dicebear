<script setup lang="ts">
// @ts-ignore
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue';
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import { paramCase } from 'change-case';

const { theme } = useData<ThemeOptions>();
const styles = theme.value.avatarStyles;
</script>

<template>
  <table v-for="(style, styleName) in styles">
    <colgroup>
      <col width="20%" />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th colspan="2" align="left">
          <VPLink :href="`/styles/${paramCase(styleName)}/`">{{
            styleName
          }}</VPLink>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="style.meta.title">
        <td>Title</td>
        <td>{{ style.meta.title }}</td>
      </tr>
      <tr v-if="style.meta.creator">
        <td>Creator</td>
        <td>{{ style.meta.creator }}</td>
      </tr>
      <tr v-if="style.meta.source">
        <td>Source</td>
        <td>
          <VPLink :href="style.meta.source">{{ style.meta.source }}</VPLink>
        </td>
      </tr>
      <tr v-if="style.meta.homepage">
        <td>Homepage</td>
        <td>
          <VPLink :href="style.meta.homepage">{{ style.meta.homepage }}</VPLink>
        </td>
      </tr>
      <tr v-if="style.meta.license?.name">
        <td>License Name</td>
        <td>{{ style.meta.license?.name }}</td>
      </tr>
      <tr v-if="style.meta.license?.url">
        <td>License URL</td>
        <td>
          <VPLink :href="style.meta.license?.url">{{
            style.meta.license?.url
          }}</VPLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>
