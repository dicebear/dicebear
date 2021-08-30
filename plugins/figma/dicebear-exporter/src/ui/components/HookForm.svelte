<script>
  import { Textarea } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
</script>

<div class="form">
  <div class="section">
    <Label>onCreate</Label>
    <Textarea bind:value={$state.data.frame.settings.onCreateHook} rows={10}></Textarea>
  </div>
  <div class="section">
    <Label>onSchemaLoad</Label>
    <Textarea bind:value={$state.data.frame.settings.onSchemaLoadHook} rows={10}></Textarea>
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
