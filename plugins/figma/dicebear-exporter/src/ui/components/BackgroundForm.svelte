<script>
  import { Input, Radio } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
</script>

<div class="form">
  <div class="section">
    <Label>Background Color</Label>
    <Radio bind:group={$state.data.frame.settings.backgroundColorGroupName} value="">- None -</Radio>
    {#each Object.keys($state.data.colors) as colorGroupName}
      {#key `background:${colorGroupName}`}
        <Radio bind:group={$state.data.frame.settings.backgroundColorGroupName} value={colorGroupName}
          >{colorGroupName}</Radio
        >
      {/key}
    {/each}
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
