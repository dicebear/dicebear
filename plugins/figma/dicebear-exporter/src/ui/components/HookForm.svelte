<script>
  import { Textarea } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
</script>

<div class="form">
  <div class="section">
    <Label>onPreCreateHook</Label>
    <Textarea bind:value={$state.data.frame.settings.onPreCreateHook} rows={10} />
  </div>
  <div class="section">
    <Label>onPostCreateHook</Label>
    <Textarea bind:value={$state.data.frame.settings.onPostCreateHook} rows={10} />
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
