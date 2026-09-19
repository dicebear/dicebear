<script setup lang="ts">
/**
 * The license sentence of a style, in the same words the OG cards and the
 * licenses page use: a remix is called a remix, a port is "based on".
 */
import { computed, toRef } from 'vue';
import { useAvatarStyleMeta } from '@theme/composables/avatar';
import { attributionKind } from '@theme/utils/license';
import { formatLicenseName } from '@theme/utils/format';
import { safeHttpUrl } from '@theme/utils/url';

const props = defineProps<{
  styleName: string;
}>();

const meta = useAvatarStyleMeta(toRef(() => props.styleName));
const kind = computed(() => attributionKind(meta.value));
const sourceUrl = computed(() => safeHttpUrl(meta.value?.source));
const homepageUrl = computed(() => safeHttpUrl(meta.value?.homepage));
const licenseUrl = computed(() => safeHttpUrl(meta.value?.license?.url));
const licenseName = computed(() =>
  formatLicenseName(meta.value?.license?.name),
);
</script>

<template>
  <span class="site-label">License</span>
  <p class="site-text site-style-license">
    <template v-if="kind === 'own-work'">
      <a
        v-if="sourceUrl"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="hv-link"
        >{{ meta?.title ?? styleName }}</a
      >
      <template v-else>{{ meta?.title ?? styleName }}</template>
      is drawn by DiceBear and licensed under
    </template>
    <template v-else>
      This style is {{ kind === 'port' ? 'based on' : 'a remix of' }}
      <a
        v-if="sourceUrl"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="hv-link"
        >{{ meta?.title ?? 'a design' }}</a
      >
      <template v-else>{{ meta?.title ?? 'a design' }}</template>
      by
      <a
        v-if="homepageUrl"
        :href="homepageUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="hv-link"
        >{{ meta?.creator }}</a
      >
      <template v-else>{{ meta?.creator }}</template
      >, licensed under
    </template>
    <a
      v-if="licenseUrl"
      :href="licenseUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="hv-link"
      >{{ licenseName }}</a
    >
    <template v-else>{{ licenseName }}</template
    >. The <a href="#details" class="hv-link">details</a> below link the source
    and the full license text.
  </p>
</template>

<style scoped lang="scss">
.site-style-license a {
  color: var(--db-brand-text);
}
</style>
