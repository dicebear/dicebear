<script setup lang="ts">
import { PawPrint, ArrowRight } from '@lucide/vue';
import Button from 'primevue/button';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';

const { theme } = useData<ThemeOptions>();
</script>

<template>
  <div class="app-hero-content">
    <h1 class="app-hero-title">
      <span class="app-hero-title-line">Pick a seed.</span>
      <span class="app-hero-title-line"
        >Get an <span class="app-hero-title-accent">avatar</span>.</span
      >
    </h1>

    <p class="app-hero-description">
      DiceBear is a privacy-focused, open source avatar library with
      <a class="app-hero-underline" href="/styles/"
        >{{ theme.styleCount }}&nbsp;avatar&nbsp;styles</a
      >, from hand-drawn characters to abstract patterns. Generate deterministic
      profile pictures via API, JS&nbsp;library, PHP&nbsp;library,
      Python&nbsp;library, Rust&nbsp;library, Go&nbsp;library,
      Dart&nbsp;library, C#&nbsp;library &amp; CLI.
    </p>

    <div class="app-hero-actions">
      <Button
        as="a"
        href="/playground/"
        size="large"
        severity="contrast"
        class="app-hero-action-btn"
      >
        <PawPrint :size="20" />
        Try Playground
      </Button>
      <Button
        as="a"
        href="/start/what-is-dicebear/"
        size="large"
        severity="secondary"
        variant="outlined"
        class="app-hero-action-btn"
      >
        Get Started
        <ArrowRight :size="20" />
      </Button>
    </div>
  </div>
</template>
