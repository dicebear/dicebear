<script setup lang="ts">
import { useLayout } from 'vitepress/theme-without-fonts';
import LayoutFooterBrand from './LayoutFooterBrand.vue';
import LayoutFooterLinks from './LayoutFooterLinks.vue';
import LayoutFooterSponsor from './LayoutFooterSponsor.vue';
import LayoutFooterCredits from './LayoutFooterCredits.vue';

const { hasSidebar } = useLayout();
</script>

<template>
  <footer
    class="layout-footer"
    :class="{ 'layout-footer-has-sidebar': hasSidebar }"
  >
    <div class="layout-footer-divider"></div>

    <div class="layout-footer-main">
      <div class="layout-footer-container">
        <LayoutFooterBrand />
        <LayoutFooterLinks />
      </div>
    </div>

    <LayoutFooterSponsor />
    <LayoutFooterCredits />
  </footer>
</template>

<style lang="scss">
:root {
  --layout-footer-logo-light-display: inline-block;
  --layout-footer-logo-dark-display: none;
  --layout-footer-sponsor-logo-light-display: none;
  --layout-footer-sponsor-logo-dark-display: inline-block;
}
.dark {
  --layout-footer-logo-light-display: none;
  --layout-footer-logo-dark-display: inline-block;
  --layout-footer-sponsor-logo-light-display: inline-block;
  --layout-footer-sponsor-logo-dark-display: none;
}

.layout-footer {
  position: relative;
  background: var(--vp-c-bg);

  &-divider {
    height: 1px;
    max-width: 800px;
    margin: 0 auto;
    background: linear-gradient(
      90deg,
      transparent,
      var(--vp-c-divider),
      transparent
    );
  }

  &-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 32px;

    @media (min-width: 960px) {
      .layout-footer-has-sidebar & {
        padding-left: calc(var(--vp-sidebar-width) + 32px);
      }
    }
  }

  &-main {
    padding: 64px 0 48px;

    .layout-footer-container {
      display: flex;
      gap: 64px;
    }
  }

  &-brand {
    flex-shrink: 0;
    max-width: 260px;
  }

  &-logo {
    display: inline-block;
    margin-bottom: 16px;

    img {
      /* The width/height attributes only provide the aspect ratio for
       * pre-load layout; without width: auto they would also act as a
       * presentational hint and fix the width at the intrinsic 183px. */
      height: 24px;
      width: auto;
    }

    &-light {
      display: var(--layout-footer-logo-light-display);
    }

    &-dark {
      display: var(--layout-footer-logo-dark-display);
    }
  }

  &-tagline {
    font-size: 14px;
    line-height: 1.6;
    color: var(--vp-c-text-2);
    margin: 0 0 20px;
  }

  &-social {
    display: flex;
    gap: 4px;

    &-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: var(--vp-radius-sm);
      color: var(--vp-c-text-2);
      transition: all var(--duration-mid) var(--ease-spring);

      &:hover {
        color: var(--vp-c-brand-1);
        background: var(--vp-c-brand-soft);
        transform: translateY(-2px);
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  /* Equal-width grid tracks keep wrapped columns aligned with the ones
   * above them. The 150px minimum fits the widest label
   * ("Bundle Size Estimator"). */
  &-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 32px 64px;
    flex: 1;
  }

  &-column {
    &-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--vp-c-text-1);
      margin: 0 0 16px;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }

  &-link {
    font-size: 14px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color var(--duration-fast) ease;

    &:hover {
      color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  &-sponsor {
    padding: 14px 0;
    border-top: 1px solid var(--vp-c-divider);

    .layout-footer-container {
      display: flex;
      justify-content: center;
    }

    &-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    &-logo {
      display: inline-flex;
      align-items: center;
      line-height: 0;

      &::after {
        display: none !important;
      }

      img {
        height: 52px;
        width: auto;
      }

      &-light {
        display: var(--layout-footer-sponsor-logo-light-display);
      }

      &-dark {
        display: var(--layout-footer-sponsor-logo-dark-display);
      }
    }

    &-meta {
      font-size: 11px;
      color: var(--vp-c-text-3);
    }
  }

  &-bottom {
    padding: 24px 0;
    border-top: 1px solid var(--vp-c-divider);

    &-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &-attributions {
    margin: 0;
    font-size: 12px;
    color: var(--vp-c-text-3);
    line-height: 1.7;
  }

  &-attribution-link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    border-bottom: 1px dashed var(--vp-c-text-3);
    transition: all var(--duration-fast) ease;

    &:hover {
      color: var(--vp-c-brand-1);
      border-bottom-color: var(--vp-c-brand-1);
    }

    &::after {
      display: none !important;
    }
  }

  @media (min-width: 960px) {
    &-has-sidebar .layout-footer-main .layout-footer-container {
      flex-direction: column;
      gap: 40px;
    }

    &-has-sidebar .layout-footer-brand {
      max-width: 100%;
    }
  }

  @media (min-width: 1340px) {
    &-has-sidebar .layout-footer-main .layout-footer-container {
      flex-direction: row;
      gap: 64px;
    }

    &-has-sidebar .layout-footer-brand {
      max-width: 260px;
    }
  }

  @media (max-width: 768px) {
    .layout-footer-main .layout-footer-container {
      flex-direction: column;
      gap: 40px;
    }

    .layout-footer-brand {
      max-width: 100%;
    }
  }
}
</style>
