<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts';
import { VPDocAsideSponsors } from 'vitepress/theme-without-fonts';
import { withBase } from 'vitepress';
import LayoutFooter from './components/layout/LayoutFooter.vue';
import LayoutNavActions from './components/layout/LayoutNavActions.vue';
import DocsCopyPage from './components/docs/DocsCopyPage.vue';
import './styles/main.scss';

const { Layout } = DefaultTheme;

const sponsors = [
  {
    tier: 'CDN sponsored by',
    size: 'medium' as const,
    items: [
      {
        name: 'bunny.net',
        img: withBase('/sponsors/bunny-dark.svg'),
        url: 'https://bunny.net/',
      },
    ],
  },
];
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <LayoutNavActions />
    </template>
    <template #doc-before>
      <DocsCopyPage />
    </template>
    <template #aside-outline-after>
      <div class="layout-aside-sponsors">
        <VPDocAsideSponsors :data="sponsors" />
        <span class="layout-aside-sponsors-ad">Advertisement</span>
      </div>
    </template>
    <template #layout-bottom>
      <LayoutFooter />
    </template>
  </Layout>
</template>
