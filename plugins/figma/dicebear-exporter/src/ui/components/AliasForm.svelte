<script>
  import { Input, IconButton, IconPlus, IconMinus, Switch } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
  import Select from './Select.svelte';

  let componentGroupAliases = $state.data.frame.settings.componentGroupAliases;
  let colorGroupAliases = $state.data.frame.settings.colorGroupAliases;

  $: {
    $state.data.frame.settings.componentGroupAliases = componentGroupAliases;
  }

  $: {
    $state.data.frame.settings.colorGroupAliases = colorGroupAliases;
  }

  function addComponentAlias() {
    componentGroupAliases.push({
      name: '',
      alias: '',
      deprecated: false,
    });

    componentGroupAliases = [...componentGroupAliases];
  }

  function addColorAlias() {
    colorGroupAliases.push({
      name: '',
      alias: '',
      deprecated: false,
    });

    colorGroupAliases = [...colorGroupAliases];
  }

  function removeComponentAlias(index) {
    componentGroupAliases.splice(index, 1);
    componentGroupAliases = [...componentGroupAliases];
  }

  function removeColorAlias(index) {
    colorGroupAliases.splice(index, 1);
    colorGroupAliases = [...colorGroupAliases];
  }
</script>

<div class="form">
  <div class="section">
    <div class="section-header">
      <Label>Component Aliases</Label>
      <IconButton on:click={addComponentAlias} iconName={IconPlus} />
    </div>
    {#each componentGroupAliases as componentAlias, key}
      <div class="section-item">
        <div class="section-item-name">
          <div class="section-item-name-select">
            <Select items={Object.keys($state.data.components)} bind:value={componentAlias.name} />
          </div>
          <IconButton on:click={() => removeComponentAlias(key)} iconName={IconMinus} />
        </div>
        <div class="section-item-alias">
          <Input bind:value={componentAlias.alias} placeholder="Alias name" />
        </div>
        <div class="section-item-deprecated">
          <Switch bind:checked={componentAlias.deprecated}>Deprecated</Switch>
        </div>
      </div>
    {/each}
  </div>

  <hr />

  <div class="section">
    <div class="section-header">
      <Label>Color Aliases</Label>
      <IconButton on:click={addColorAlias} iconName={IconPlus} />
    </div>
    {#each colorGroupAliases as colorAlias, key}
      <div class="section-item">
        <div class="section-item-name">
          <div class="section-item-name-select">
            <Select items={Object.keys($state.data.colors)} bind:value={colorAlias.name} />
          </div>
          <IconButton on:click={() => removeColorAlias(key)} iconName={IconMinus} />
        </div>
        <div class="section-item-alias">
          <Input bind:value={colorAlias.alias} placeholder="Alias name" />
        </div>
        <div class="section-item-deprecated">
          <Switch bind:checked={colorAlias.deprecated}>Deprecated</Switch>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  hr {
    border-top: 1px solid #e5e5e5;
    margin-top: 8px;
    margin-bottom: 8px;
    border-bottom: 0px solid;
  }

  .section {
    margin: 8px;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-item {
      &-name {
        display: flex;
        width: 100%;

        &-select {
          flex-grow: 1;
        }
      }
    }

    &-item + &-item {
      margin-top: 8px;
      border-top: 1px solid #e5e5e5;
      padding-top: 8px;
    }
  }
</style>
