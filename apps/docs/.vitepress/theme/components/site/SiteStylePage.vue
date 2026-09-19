<script setup lang="ts">
/**
 * A style page. The Markdown page mounts this once and hands over the
 * hand-written description as the default slot. Everything else is read
 * from the definition and the stats at runtime.
 */
import { computed, ref } from 'vue';
import { kebabCase } from 'change-case';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { getStyleCategory } from '@theme/config/styleCategories';
import { useStyleRankings } from '@theme/composables/useStyleRankings';
import { formatLicenseName } from '@theme/utils/format';
import { styleDisplayName } from '@theme/utils/styleMeta';
import { safeHttpUrl } from '@theme/utils/url';
import SitePageHead, { type SiteChip } from './SitePageHead.vue';
import SiteSection from './SiteSection.vue';
import SiteSubNav, { type SiteSubNavItem } from './SiteSubNav.vue';
import SiteStyleCard from './SiteStyleCard.vue';
import SiteStyleSeeds from './SiteStyleSeeds.vue';
import SiteStyleLicense from './SiteStyleLicense.vue';
import SiteStyleUsage from './SiteStyleUsage.vue';
import SiteStylePresets from './SiteStylePresets.vue';
import SiteStyleOptions from './SiteStyleOptions.vue';
import SiteStylePopularity from './SiteStylePopularity.vue';
import SiteStyleDetails from './SiteStyleDetails.vue';
import SiteStyleNext from './SiteStyleNext.vue';

const props = defineProps<{
  styleName: string;
}>();

const { theme } = useData<ThemeOptions>();

const slug = computed(() => kebabCase(props.styleName));
const style = computed(() => theme.value.avatarStyles[slug.value]);
const title = computed(() => styleDisplayName(slug.value));
const category = computed(() => getStyleCategory(slug.value));

const crumbs = computed(() => [
  { text: 'Styles', link: '/styles/' },
  { text: category.value, link: `/styles/#${category.value.toLowerCase()}` },
  { text: title.value },
]);

// Every chip leads somewhere: the artist's site, the license text, the
// category on the overview, the animated styles. Where a style carries no
// link of its own, the licenses page has the artist and the license.
const chips = computed<SiteChip[]>(() => {
  const meta = style.value?.meta;
  const list: SiteChip[] = [];
  if (meta?.creator) {
    list.push({
      text: `by ${meta.creator}`,
      href: safeHttpUrl(meta.homepage) ?? '/licenses/',
    });
  }
  if (meta?.license?.name) {
    list.push({
      text: formatLicenseName(meta.license.name),
      href: safeHttpUrl(meta.license.url) ?? '/licenses/',
    });
  }
  list.push({
    text: category.value,
    href: `/styles/#${category.value.toLowerCase()}`,
  });
  if (style.value?.animated) {
    list.push({ text: 'Animated', href: '/animated-avatars/' });
  }
  return list;
});

const presetCount = ref(0);
const { rankingByName } = useStyleRankings();
const hasPopularity = computed(() => !!rankingByName.value?.[slug.value]);

const navItems = computed<SiteSubNavItem[]>(() => {
  const items: SiteSubNavItem[] = [{ id: 'usage', label: 'Usage' }];
  if (presetCount.value > 0) {
    items.push({ id: 'presets', label: 'Presets' });
  }
  items.push({ id: 'options', label: 'Options' });
  if (hasPopularity.value) {
    items.push({ id: 'popularity', label: 'Popularity' });
  }
  items.push({ id: 'details', label: 'Details' });
  return items;
});

const optionsHint = computed(() =>
  style.value?.animated
    ? 'Every style shares the general options. This one adds a variant and a probability per component, five options per color, and the animation switches. Open Examples on any row to see every value rendered.'
    : 'Every style shares the general options. This one adds a variant and a probability per component, and five options per color. Open Examples on any row to see every value rendered.',
);
</script>

<template>
  <div class="site-style-page">
    <SitePageHead
      :crumbs="crumbs"
      :title="title"
      :chips="chips"
      lead-size="body"
    >
      <slot />
      <template #note>
        <SiteStyleLicense :style-name="slug" />
      </template>
      <template #aside>
        <SiteStyleCard :style-name="slug" />
      </template>
    </SitePageHead>

    <SiteStyleSeeds :style-name="slug" />

    <SiteSubNav :items="navItems" />

    <SiteSection
      id="usage"
      title="Usage"
      hint="Same seed, same avatar, whichever way you render it."
      class="site-style-page-first"
    >
      <SiteStyleUsage :style-name="slug" />
    </SiteSection>

    <SiteSection
      v-show="presetCount > 0"
      id="presets"
      title="Presets"
      hint="A preset is a set of regular options. Pick one to see its code, or open it in the Playground and keep tuning."
    >
      <SiteStylePresets :style-name="slug" @loaded="presetCount = $event" />
    </SiteSection>

    <SiteSection id="options" title="Options" :hint="optionsHint">
      <SiteStyleOptions :style-name="slug" />
    </SiteSection>

    <SiteSection
      v-if="hasPopularity"
      id="popularity"
      title="Popularity"
      hint="Counted from the requests to the hosted API, per website and week."
    >
      <SiteStylePopularity :style-name="slug" />
    </SiteSection>

    <SiteSection
      id="details"
      title="Details"
      hint="Who drew it, what the license allows, and where the files live."
    >
      <SiteStyleDetails :style-name="slug" />
    </SiteSection>

    <SiteStyleNext :style-name="slug" />
  </div>
</template>

<style scoped lang="scss">
.site-style-page {
  &-first {
    padding-top: 96px;
  }
}
</style>
