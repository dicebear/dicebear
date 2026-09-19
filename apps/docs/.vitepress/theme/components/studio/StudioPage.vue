<script setup lang="ts">
/**
 * The landing page of DiceBear Studio, the plugin for Figma. It follows the
 * plugin: one chapter for each of its three tabs, and every function gets a
 * row with a screenshot of the plugin window.
 */
import { withBase } from 'vitepress';
import StudioChapter from './StudioChapter.vue';
import StudioClosing from './StudioClosing.vue';
import StudioFacts from './StudioFacts.vue';
import StudioGenerate from './StudioGenerate.vue';
import StudioHead from './StudioHead.vue';
import StudioRow from './StudioRow.vue';
import StudioSame from './StudioSame.vue';
import type { StudioFeature } from './types';

interface StudioChapterData {
  id: 'generate' | 'inspect' | 'style';
  title: string;
  lead: string;
  features: StudioFeature[];
}

const chapters: StudioChapterData[] = [
  {
    id: 'generate',
    title: 'Generate',
    lead: 'Puts avatars into your designs, either into layers you selected or as new layers. Pick a style from the DiceBear collection or from your own library, set where the seeds come from, and every option of the style is a control in the panel.',
    features: [
      {
        title: 'Bring your own style',
        text: 'The gallery has a second tab, Library. Upload a definition file there and the style sits next to the collection in every Figma file you open. The plugin shows the license the file names, but it cannot check it.',
        shot: {
          name: 'library',
          alt: 'The Library tab of the style gallery with two uploaded definitions and the Upload definition button',
        },
      },
    ],
  },
  {
    id: 'inspect',
    title: 'Inspect',
    lead: 'Designs are mockups, the app needs the real thing. Select generated avatars, or a frame that holds some, and the tab lists what a developer needs to render the same ones.',
    features: [
      {
        title: 'Hand avatars to developers',
        text: 'For each avatar: the style and its version, the seed, and the options that differ from the style’s defaults. Below that the HTTP API URL as SVG, PNG, JPG or WebP, and the JavaScript for the library. Every value has a copy button.',
        shot: {
          name: 'inspect',
          alt: 'The Inspect tab with two selected avatars: for Felix the seed, a changed background color, the API URL and the JavaScript',
        },
      },
    ],
  },
  {
    id: 'style',
    title: 'Style',
    lead: 'For the people who draw avatar styles. The tab turns a Figma frame of components and color styles into a DiceBear style, and any style back into a Figma file.',
    features: [
      {
        title: 'Export and import styles',
        text: 'Export turns a square frame of component instances, one component per variant with color styles for the palettes, into a single JSON definition for DiceBear 11.x, animations included. Import goes the other way and rebuilds a definition in an empty Figma file, with one component per variant, the palettes as color styles, a guide next to the avatar frame and a page with the credits.',
        shot: {
          name: 'style-frame',
          alt: 'The Style tab with the Lorelei frame selected: the frame settings and the eleven components in the sidebar, the settings of the eyes component, and the Export definition button',
        },
        links: [
          {
            text: 'Create an avatar style with Figma',
            href: withBase('/create-styles/with-figma/'),
          },
          {
            text: 'Edit an avatar style with Figma',
            href: withBase('/create-styles/edit-a-style/'),
          },
        ],
      },
    ],
  },
];

const factsTitle = 'Good to know';
</script>

<template>
  <div class="studio-page">
    <StudioHead />
    <StudioChapter
      v-for="chapter in chapters"
      :id="chapter.id"
      :key="chapter.id"
      :title="chapter.title"
      :lead="chapter.lead"
    >
      <StudioGenerate v-if="chapter.id === 'generate'" />
      <StudioRow
        v-for="feature in chapter.features"
        :key="feature.title"
        v-bind="feature"
      />
      <StudioSame v-if="chapter.id === 'inspect'" />
    </StudioChapter>
    <StudioChapter :title="factsTitle">
      <StudioFacts />
    </StudioChapter>
    <StudioClosing />
  </div>
</template>
