<script setup lang="ts">
import { ref, computed } from 'vue';
import { Activity, Server, Download, ArrowRight } from '@lucide/vue';
import { UiContainer, UiSection, UiSectionHeader, UiCard, UiIconBox, UiButton } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useApiStats } from '../../composables/useApiStats';
import { formatNumber, formatBytes } from '../../utils/format';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const apiStats = useApiStats();

const monthLabel = computed(() => apiStats.value?.monthLabel ?? 'Month');

const metrics = computed(() => [
  {
    icon: Activity,
    value: apiStats.value ? formatNumber(apiStats.value.monthlyRequests) : '1B+',
    label: 'API Requests',
    description: `Avatars generated via our HTTP-API in ${monthLabel.value} alone.`,
    color: '#1689cc',
  },
  {
    icon: Server,
    value: apiStats.value ? formatBytes(apiStats.value.monthlyTraffic) : '3TB+',
    label: 'Data Served',
    description: `Total traffic delivered through our global CDN in ${monthLabel.value}.`,
    color: '#22c55e',
  },
  {
    icon: Download,
    value: '120K+',
    label: 'npm Downloads',
    description: 'Weekly package downloads across the DiceBear ecosystem.',
    color: '#cb3837',
  },
]);
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-stats-banner-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-stats-banner-header"
        badge="Trusted at Scale"
        description="Real usage data from our HTTP-API and npm packages — updated daily."
      >
        <template #headline>Billions of avatars. <strong>One API.</strong></template>
      </UiSectionHeader>

      <div class="app-stats-banner-grid">
        <UiCard
          v-for="(metric, index) in metrics"
          :key="metric.label"
          padding="lg"
          radius="md"
          class="app-stats-banner-card"
          :style="{ '--accent-color': metric.color, animationDelay: `${index * 0.1}s` }"
        >
          <UiIconBox size="lg" :color="metric.color" class="app-stats-banner-icon">
            <component :is="metric.icon" />
          </UiIconBox>
          <span class="app-stats-banner-value">{{ metric.value }}</span>
          <h3 class="app-stats-banner-label">{{ metric.label }}</h3>
          <p class="app-stats-banner-description">{{ metric.description }}</p>
        </UiCard>
      </div>

      <div class="app-stats-banner-action">
        <UiButton href="/stats/" variant="secondary">
          View Live Statistics
          <ArrowRight :size="18" />
        </UiButton>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-stats-banner {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
      radial-gradient(ellipse 50% 50% at 50% 100%, color-mix(in srgb, var(--vp-c-purple-1) 4%, transparent), transparent);
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &-card {
    opacity: 0;
    transform: translateY(30px);
    transition: box-shadow var(--duration-mid) var(--ease-spring);

    .visible & {
      animation: reveal-up var(--duration-mid) var(--ease-spring) forwards;
    }

    &:hover {
      box-shadow:
        inset 0 3px 0 var(--accent-color),
        0 0 20px color-mix(in srgb, var(--accent-color) 20%, transparent);
    }
  }

  &-icon {
    margin-bottom: 20px;
  }

  &-value {
    display: block;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--vp-c-text-1);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    margin-bottom: 8px;
  }

  &-label {
    font-size: 18px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
  }

  &-description {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }

  &-action {
    display: flex;
    justify-content: center;
    margin-top: 48px;
    opacity: 0;
    transform: translateY(20px);
    transition: all var(--duration-reveal) var(--ease-smooth) 0.3s;

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
@media (max-width: 1000px) {
  .app-stats-banner {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 640px) {
  .app-stats-banner {
    &-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &-value {
      font-size: 28px;
    }
  }
}
</style>
