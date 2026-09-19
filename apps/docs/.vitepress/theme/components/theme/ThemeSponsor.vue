<script setup lang="ts">
/**
 * bunny.net, the CDN sponsor. The link is an ad, so it says so in plain sight
 * and carries rel="sponsored".
 */
import { withBase } from 'vitepress';

withDefaults(defineProps<{ logoHeight?: number }>(), { logoHeight: 56 });
</script>

<template>
  <aside class="theme-sponsor" aria-label="Sponsor">
    <span class="theme-sponsor-label">CDN sponsored by</span>
    <a
      href="https://bunny.net/"
      target="_blank"
      rel="noopener sponsored"
      aria-label="bunny.net"
      class="theme-sponsor-logo hv-fade"
    >
      <img
        class="only-light"
        :src="withBase('/sponsors/bunny-dark.svg')"
        alt="bunny.net"
        width="149"
        height="43"
        :style="{ height: `${logoHeight}px` }"
      />
      <img
        class="only-dark"
        :src="withBase('/sponsors/bunny-light.svg')"
        alt="bunny.net"
        width="149"
        height="43"
        :style="{ height: `${logoHeight}px` }"
      />
    </a>
    <span class="theme-sponsor-ad">Advertisement</span>
  </aside>
</template>

<style lang="scss" scoped>
.theme-sponsor {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.theme-sponsor-label {
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  color: var(--db-ink);
}

.theme-sponsor-logo {
  display: flex;

  img {
    width: auto;
  }
}

.theme-sponsor-ad {
  font-size: 13px;
  line-height: 18px;
  color: var(--db-muted);
}
</style>
