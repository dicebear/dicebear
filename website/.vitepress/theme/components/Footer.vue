<script setup lang="ts">
// @ts-ignore
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue';
import { useSidebar } from 'vitepress/theme';
import { useData, withBase } from 'vitepress';
import { computed } from 'vue';
import type { StyleMeta } from '@dicebear/core';
import type { ThemeOptions } from '@shared/types';

const { theme } = useData<ThemeOptions>();
const { hasSidebar } = useSidebar();

const styles = computed(() => {
  const result: StyleMeta[] = [];
  const knownWork: string[] = [];

  for (const val of Object.values(theme.value.avatarStyles)) {
    if (val.meta.creator === 'Florian Körner') {
      continue;
    }

    if (val.meta.source) {
      if (knownWork.includes(val.meta.source)) {
        continue;
      }

      knownWork.push(val.meta.source);
    }

    result.push(val.meta);
  }

  return result;
});
</script>

<template>
  <div class="container" :class="{ 'has-sidebar': hasSidebar }">
    <div class="sponsor">
      <p>Sponsored by</p>
      <a
        href="https://bunny.net/"
        target="_blank"
        rel="noopener"
        class="sponsor-logo"
      >
        <img
          class="sponsor-logo-light"
          :src="withBase('/sponsors/bunny-light.svg')"
          title="bunny.net"
        />
        <img
          class="sponsor-logo-dark"
          :src="withBase('/sponsors/bunny-dark.svg')"
          title="bunny.net"
        />
      </a>
    </div>
    <ul class="links">
      <li>
        <VPLink class="link" href="https://github.com/dicebear/dicebear">
          GitHub
        </VPLink>
      </li>
      <li>
        <VPLink class="link" href="https://dicebear.betteruptime.com/">
          Status
        </VPLink>
      </li>
      <li>
        <VPLink class="link" href="/licenses/">Licenses</VPLink>
      </li>
      <li>
        <VPLink class="link" href="/legal/privacy-policy/"
          >Privacy Policy</VPLink
        >
      </li>
      <li>
        <VPLink class="link" href="/legal/site-notice/">Site Notice</VPLink>
      </li>
    </ul>
    <div class="copyright">
      <template v-for="style in styles" :key="style.source">
        <VPLink class="link" :href="style.source" noIcon>{{
          style.title
        }}</VPLink>
        by {{ style.creator }} /
        <VPLink class="link" :href="style.license?.url" noIcon>{{
          style.license?.name
        }}</VPLink
        >.
      </template>
      - All avatars are remixes of the original works.
    </div>
  </div>
</template>

<style lang="scss">
.sponsor-logo-light {
  display: none;
}
.sponsor-logo-dark {
  display: inline-block;
}
.dark {
  .sponsor-logo-light {
    display: inline-block;
  }
  .sponsor-logo-dark {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  padding: 0 32px;

  @media (min-width: 960px) {
    padding: 0 64px;

    &.has-sidebar {
      padding-left: calc(var(--vp-sidebar-width) + 64px);
    }
  }
}

.sponsor {
  text-align: center;
  margin-bottom: 48px;

  img {
    height: 80px;
  }
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;

  li {
    margin: 0 32px 24px;
  }

  .link {
    &:hover {
      border-bottom: 1px dashed;
    }
  }
}

.copyright {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 11px;
  margin-bottom: 32px;
  line-height: 1.6;

  .link {
    border-bottom: 1px dashed;

    &:hover {
      border-bottom-style: solid;
      color: var(--vp-c-text-1);
    }
  }
}
</style>
