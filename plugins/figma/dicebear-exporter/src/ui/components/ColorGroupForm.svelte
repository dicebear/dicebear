<script>
  import { Input, Switch } from "figma-plugin-ds-svelte";
  import { state } from "../stores/state";
  import Label from "./Label.svelte";

  export let colorGroup;
</script>

<div class="form">
  <div class="section">
    <Label>Defaults</Label>
    {#each Object.keys($state.data.colors[colorGroup].settings.defaults) as colorName}
      {#key `colors:${colorGroup}:${colorName}`}
        <Switch
          bind:checked={$state.data.colors[colorGroup].settings.defaults[
            colorName
          ]}
        >
          {colorName}
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
