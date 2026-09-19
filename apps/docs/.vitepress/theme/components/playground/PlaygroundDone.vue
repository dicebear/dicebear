<script setup lang="ts">
/**
 * The dialog that follows a copy or a download: the avatar, the license of
 * its style and the request for a GitHub star.
 */
import useStore from '@theme/stores/playground';
import SiteDialog from '../site/SiteDialog.vue';
import PlaygroundLicenseAlert from './PlaygroundLicenseAlert.vue';
import PlaygroundStarCta from './PlaygroundStarCta.vue';
import PlaygroundThumb from './PlaygroundThumb.vue';

defineProps<{
  title: string;
  options: Record<string, unknown>;
  /** Names the dialog in the statistics of the star button. */
  source: string;
}>();

const open = defineModel<boolean>('open', { required: true });

const store = useStore();
</script>

<template>
  <SiteDialog v-model:open="open" :header="title" max-width="560px">
    <div class="pg-done">
      <div class="pg-done-head">
        <PlaygroundThumb
          class="pg-done-avatar"
          :style-name="store.avatarStyleName"
          :options="options"
          alt="avatar"
        />
        <p class="pg-done-text">Please note the license below before using.</p>
      </div>
      <PlaygroundLicenseAlert />
      <PlaygroundStarCta :source="source" />
    </div>
  </SiteDialog>
</template>

<style scoped lang="scss">
.pg-done {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 28px 28px;

  &-head {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  // Two classes, so the size outranks the defaults of the thumbnail.
  & &-avatar {
    width: 96px;
    border: 1px solid var(--db-line);
    border-radius: var(--db-radius-4);
  }

  &-text {
    margin: 0;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  @media (max-width: 640px) {
    padding: 20px;
  }
}
</style>
