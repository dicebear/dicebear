<script>
  import { Input, IconButton, IconPlus, IconMinus } from 'figma-plugin-ds-svelte';
  import { state } from '../stores/state';
  import Label from './Label.svelte';
  import Select from './Select.svelte';

  let componentAliases = $state.data.frame.settings.componentGroupAliases;
  let colorAliases = $state.data.frame.settings.colorGroupAliases;

  $: componentSelect = Object.keys($state.data.components).map((key) => {
    return { value: key, label: key, group: null, selected: false };
  });

  $: colorSelect = Object.keys($state.data.colors).map((key) => {
    return { value: key, label: key, group: null, selected: false };
  });

  $: {
    $state.data.frame.settings.componentAliases = componentAliases;
  }

  $: {
    $state.data.frame.settings.colorAliases = colorAliases;
  }

  function addComponentAlias() {
    componentAliases.push({
      name: '',
      alias: '',
      deprecated: false,
    });

    componentAliases = [...componentAliases];
  }

  function addColorAlias() {
    colorAliases.push({
      name: '',
      alias: '',
      deprecated: false,
    });

    colorAliases = [...colorAliases];
  }

  function removeComponentAlias(index) {
    componentAliases.splice(index, 1);
    componentAliases = [...componentAliases];
  }

  function removeColorAlias(index) {
    colorAliases.splice(index, 1);
    colorAliases = [...colorAliases];
  }
</script>

<div class="form">
  <div class="section">
    <div class="section-header">
      <Label>Component Aliases</Label>
      <IconButton on:click={addComponentAlias} iconName={IconPlus} />
    </div>
    {#each componentAliases as componentAlias, key}
      <div class="section-item">
        <div class="section-item-name">
          <div class="section-item-name-select">
            <Select items={componentSelect} bind:value={componentAlias.name} />
          </div>
          <IconButton on:click={() => removeComponentAlias(key)} iconName={IconMinus} />
        </div>
        <div class="section-item-alias">
          <Input bind:value={componentAlias.alias} placeholder="Alias name" />
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
    {#each colorAliases as colorAlias, key}
      <div class="section-item">
        <div class="section-item-name">
          <div class="section-item-name-select">
            <Select items={colorSelect} bind:value={colorAlias.name} />
          </div>
          <IconButton on:click={() => removeColorAlias(key)} iconName={IconMinus} />
        </div>
        <div class="section-item-alias">
          <Input bind:value={colorAlias.alias} placeholder="Alias name" />
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
