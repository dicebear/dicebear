<script>
  import { Input, Radio } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
</script>

<div class="form">
  <div class="section">
    <Label>Source Title</Label>
    <Input bind:value={$state.data.frame.settings.sourceTitle} />
  </div>

  <div class="section">
    <Label>Source URL</Label>
    <Input bind:value={$state.data.frame.settings.source} />
  </div>

  <div class="section">
    <Label>Creator</Label>
    <Input bind:value={$state.data.frame.settings.creator} />
  </div>

  <div class="section">
    <Label>Contributor</Label>
    <Input bind:value={$state.data.frame.settings.contributor} />
  </div>

  <div class="section">
    <Label>License Name</Label>
    <Input bind:value={$state.data.frame.settings.licenseName} />
  </div>

  <div class="section">
    <Label>License URL</Label>
    <Input bind:value={$state.data.frame.settings.licenseUrl} />
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
