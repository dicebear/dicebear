<script setup lang="ts">
import { useData } from 'vitepress';
import { ThemeOptions } from '@shared/types';
import { paramCase, capitalCase } from 'change-case';
import { VPTeamMembers } from 'vitepress/theme';

const { theme } = useData<ThemeOptions>();
const styles = theme.value.avatarStyles;

const members = Object.entries(styles).map(([styleName, style]) => ({
  name: capitalCase(styleName),
  avatar: `https://api.dicebear.com/8.x/${paramCase(styleName)}/svg?seed=JD`,
  title: `by ${style.meta.creator}`,
  org: 'Documentation',
  orgLink: `/styles/${paramCase(styleName)}/`,
}));
</script>

<template>
  <VPTeamMembers size="small" :members="members" />
</template>

<style lang="scss">
.VPTeamMembersItem {
  .title {
    display: block;
    margin-bottom: 20px;
  }

  .at {
    display: none;
  }
}
</style>
