<script>
  import { Input, Switch } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';

  export let componentGroup;
</script>

<div class="form">
  <div class="section">
    <Label>Probability (in percent)</Label>
    <Input
      type="number"
      placeholder="Leave blank to disable option"
      bind:value={$state.data.components[componentGroup].settings.probability}
    />
  </div>

  <div class="section">
    <Label>Defaults</Label>
    {#each Object.keys($state.data.components[componentGroup].settings.defaults) as componentName}
      {#key `components:${componentGroup}:${componentName}`}
        <Switch
          bind:checked={$state.data.components[componentGroup].settings
            .defaults[componentName]}
        >
          {componentName}
        </Switch>
      {/key}
    {/each}
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
