<script setup lang="ts">
import {
  ArrowRight,
  Contrast,
  ExternalLink,
  Paintbrush,
  Package,
  PenSquare,
  Sparkles,
} from '@lucide/vue';
import type { Component } from 'vue';
import { UiCard } from '../ui';

type Tool = {
  slug: string;
  href: string;
  external?: boolean;
  name: string;
  description: string;
  icon: Component;
  iconBg: string;
};

const tools: Tool[] = [
  {
    slug: 'contrast',
    href: '/tools/contrast/',
    name: 'WCAG Contrast Picker',
    description:
      'Explore which contrast color DiceBear would pick for any background. Uses the exact WCAG 2.1 contrast ratio implementation from <code>@dicebear/core</code>.',
    icon: Contrast,
    iconBg: 'linear-gradient(135deg, #1e293b 50%, #f8fafc 50%)',
  },
  {
    slug: 'bundle-size',
    href: '/tools/bundle-size/',
    name: 'Bundle Size Estimator',
    description:
      'See how much each style adds to your bundle. Raw and gzipped numbers, straight from the installed <code>@dicebear/styles</code> package.',
    icon: Package,
    iconBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    slug: 'playground',
    href: '/playground/',
    name: 'Playground',
    description:
      'Pick a style, tune every option, preview the result live, and batch-download SVGs with your configuration. Generated code is ready to copy and paste.',
    icon: Sparkles,
    iconBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    slug: 'editor',
    href: 'https://editor.dicebear.com',
    external: true,
    name: 'Editor',
    description:
      'Design your own DiceBear-compatible avatar style from scratch in a visual editor. Export the definition and use it like any built-in style.',
    icon: PenSquare,
    iconBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    slug: 'figma-plugin',
    href: 'https://www.figma.com/community/plugin/1005765655729342787',
    external: true,
    name: 'DiceBear Studio',
    description:
      'Export an avatar style straight out of Figma, or import a definition file and edit an existing style in Figma.',
    icon: Paintbrush,
    iconBg: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
  },
];
</script>

<template>
  <div class="tool-list">
    <div class="tool-list-grid">
      <UiCard
        v-for="tool in tools"
        :key="tool.slug"
        :href="tool.href"
        :target="tool.external ? '_blank' : undefined"
        padding="lg"
        class="tool-list-card"
      >
        <div class="tool-list-card-icon" :style="{ background: tool.iconBg }">
          <component :is="tool.icon" :size="28" />
        </div>

        <div class="tool-list-card-content">
          <h3 class="tool-list-card-name">
            {{ tool.name }}
            <ExternalLink
              v-if="tool.external"
              :size="13"
              class="tool-list-card-external-icon"
              aria-label="Opens in new tab"
            />
          </h3>
          <p class="tool-list-card-description" v-html="tool.description" />
        </div>

        <div class="tool-list-card-arrow">
          <ArrowRight :size="18" />
        </div>
      </UiCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-list {
  margin-top: 32px;
  margin-bottom: 96px;

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  &-card {
    :deep(.ui-card-body) {
      display: flex;
      align-items: flex-start;
      gap: 18px;
    }

    &-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--vp-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vp-c-brand-1);
      flex-shrink: 0;
      box-shadow: var(--vp-shadow-1);
      mix-blend-mode: normal;

      :deep(svg) {
        color: var(--vp-c-bg);
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
      }
    }

    &-content {
      flex: 1;
      min-width: 0;
    }

    &-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--vp-c-text-1);
      margin: 0 0 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    &-external-icon {
      color: var(--ui-c-text-subtle);
      flex-shrink: 0;
    }

    &-description {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: var(--vp-c-text-2);
    }

    &-arrow {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--vp-c-bg);
      border-radius: var(--vp-radius-xs);
      opacity: 0;
      transform: translateX(-8px);
      transition: all var(--duration-fast) ease;

      svg {
        color: var(--vp-c-brand-1);
      }
    }

    &:hover &-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 640px) {
    &-grid {
      grid-template-columns: 1fr;
    }

    &-card-arrow {
      display: none;
    }
  }
}
</style>
