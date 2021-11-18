<script>
  import { Input, Radio } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
</script>

<div class="form">
  <div class="section">
    <Label>Title</Label>
    <Input bind:value={$state.data.frame.settings.title} />
  </div>

  <div class="section">
    <Label>Package Name</Label>
    <Input bind:value={$state.data.frame.settings.packageName} />
  </div>

  <div class="section">
    <Label>Package Version</Label>
    <Input bind:value={$state.data.frame.settings.packageVersion} />
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
