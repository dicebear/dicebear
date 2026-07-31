<script setup lang="ts">
import { ArrowDown, PawPrint } from '@lucide/vue';
import Button from 'primevue/button';
import AppSmallHero from '../app/AppSmallHero.vue';
import AppHeroAsideAnimated from '../app/AppHeroAsideAnimated.vue';
import AppAnimatedStyles from '../app/AppAnimatedStyles.vue';
import AppAnimatedHighlights from '../app/AppAnimatedHighlights.vue';
import AppAnimatedDemo from '../app/AppAnimatedDemo.vue';
</script>

<template>
  <AppSmallHero>
    <template #headline>Animated <strong>SVG</strong> Avatars</template>
    <template #description>
      Give profile pictures a little life. Animated DiceBear styles carry a
      looping CSS animation inside the SVG, and a single option turns it on. A
      plain img tag is enough to play it.
    </template>
    <template #actions>
      <Button
        as="a"
        href="/playground/"
        size="large"
        severity="contrast"
        class="app-small-hero-action-btn"
      >
        <PawPrint :size="20" />
        Try Playground
      </Button>
      <Button
        as="a"
        href="#animated-styles"
        size="large"
        severity="secondary"
        variant="outlined"
        class="app-small-hero-action-btn"
      >
        See the Styles
        <ArrowDown :size="20" />
      </Button>
    </template>
    <template #aside>
      <AppHeroAsideAnimated />
    </template>
  </AppSmallHero>
  <AppAnimatedStyles />
  <AppAnimatedHighlights />
  <AppAnimatedDemo />
</template>
