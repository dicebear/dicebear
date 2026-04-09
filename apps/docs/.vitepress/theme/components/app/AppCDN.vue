<script setup lang="ts">
import { ref, computed } from 'vue';
import { Globe, Zap, Server } from '@lucide/vue';
import { UiContainer, UiSection, UiSectionHeader, UiCard } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useApiStats } from '../../composables/useApiStats';
import { formatNumber, formatBytes } from '../../utils/format';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const apiStats = useApiStats();

const monthLabel = computed(() => apiStats.value?.monthLabel ?? 'Month');

const stats = computed(() => [
  { value: apiStats.value ? formatNumber(apiStats.value.monthlyRequests) : '1B+', label: `Requests in ${monthLabel.value}`, icon: Globe },
  { value: apiStats.value ? formatBytes(apiStats.value.monthlyTraffic) : '3TB+', label: `Data Served in ${monthLabel.value}`, icon: Server },
  { value: '85%+', label: 'Cache Hit Rate', icon: Zap },
]);
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-cdn-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-cdn-header"
        badge="Content Delivery Network"
        description="Our HTTP-API is powered by a global CDN — delivering avatars with low latency, high reliability, and completely free of charge."
      >
        <template #headline>Lightning fast, <strong>globally delivered</strong></template>
      </UiSectionHeader>

      <div class="app-cdn-content">
        <UiCard padding="xl" radius="lg" class="app-cdn-card">
          <div class="app-cdn-card-layout">
            <div class="app-cdn-card-info">
              <div class="app-cdn-sponsor">
                <a
                  href="https://bunny.net/"
                  class="app-cdn-logo-link"
                  target="_blank"
                  rel="noopener sponsored"
                >
                  <img
                    src="/sponsors/bunny-dark.svg"
                    alt="bunny.net"
                    class="app-cdn-logo app-cdn-logo-light"
                  />
                  <img
                    src="/sponsors/bunny-light.svg"
                    alt="bunny.net"
                    class="app-cdn-logo app-cdn-logo-dark"
                  />
                </a>
                <p class="app-cdn-description">
                  bunny.net sponsors the CDN infrastructure for our HTTP-API.
                  This allows us to serve avatars globally with low latency
                  &mdash; completely free of charge for you.
                </p>
                <a
                  href="https://bunny.net/"
                  class="app-cdn-link"
                  target="_blank"
                  rel="noopener sponsored"
                >
                  Visit bunny.net &rarr;
                </a>
                <span class="app-cdn-ad">Advertisement</span>
              </div>
            </div>

            <div class="app-cdn-stats">
              <div
                v-for="(stat, index) in stats"
                :key="stat.label"
                class="app-cdn-stat-item"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <component :is="stat.icon" class="app-cdn-stat-icon" />
                <span class="app-cdn-stat-value">{{ stat.value }}</span>
                <span class="app-cdn-stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss">
:root {
  --app-cdn-logo-light-display: inline;
  --app-cdn-logo-dark-display: none;
}
.dark {
  --app-cdn-logo-light-display: none;
  --app-cdn-logo-dark-display: inline;
}
</style>

<style lang="scss" scoped>
.app-cdn {
  &-gradient {
    background:
      radial-gradient(
        ellipse 60% 70% at 50% 0%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 60% 70% at 50% 100%,
        color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent),
        transparent
      );
  }

  &-header {
    --hl-from: var(--vp-c-brand-3);
    --hl-to: var(--vp-c-brand-1);
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-content {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth) 0.15s;

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-card-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }

  &-sponsor {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &-logo-link {
    display: inline-block;
    line-height: 0;

    &::after {
      display: none !important;
    }
  }

  &-logo {
    height: 44px;
    width: auto;

    &-light {
      display: var(--app-cdn-logo-light-display);
    }

    &-dark {
      display: var(--app-cdn-logo-dark-display);
    }
  }

  &-description {
    font-size: 15px;
    color: var(--vp-c-text-2);
    line-height: 1.7;
    margin: 0;
  }

  &-link {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: color var(--duration-fast) ease;

    &::after {
      display: none !important;
    }

    &:hover {
      color: var(--vp-c-brand-2);
    }
  }

  &-ad {
    font-size: 12px;
    color: var(--vp-c-text-3);
  }

  &-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: var(--vp-c-bg-soft);
    border-radius: var(--vp-radius-sm);
    opacity: 0;
    transform: translateX(20px);
    transition: all var(--duration-mid) ease;

    &:hover {
      background: var(--vp-c-bg);
      box-shadow: var(--vp-shadow-2);
    }

    .visible & {
      animation: app-cdn-stat-reveal 0.5s var(--ease-spring) forwards;
    }
  }

  &-stat-icon {
    width: 20px;
    height: 20px;
    color: var(--vp-c-brand-1);
    flex-shrink: 0;
  }

  &-stat-value {
    font-size: 22px;
    font-weight: 800;
    color: var(--vp-c-text-1);
    font-variant-numeric: tabular-nums;
    min-width: 80px;
  }

  &-stat-label {
    font-size: 14px;
    color: var(--vp-c-text-2);
    font-weight: 500;
  }
}

@keyframes app-cdn-stat-reveal {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .app-cdn {
    &-card-layout {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &-stats {
      gap: 12px;
    }

    &-stat-item {
      padding: 16px 20px;
    }

    &-stat-value {
      font-size: 20px;
    }
  }
}
</style>
