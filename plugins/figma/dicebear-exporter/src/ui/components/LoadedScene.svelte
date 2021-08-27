<script>
  import { state } from "../stores/state";
  import { activeStage } from "../stores/activeStage";

  import MenuItem from "./MenuItem.svelte";
  import FrameForm from "./FrameForm.svelte";
  import ColorsGroupForm from "./ColorsGroupForm.svelte";
  import ComponentGroupForm from "./ComponentGroupForm.svelte";

  $: activeStageSplit = $activeStage.split(":");
</script>

<div class="left">
  <div class="menu-wrapper">
    <div class="menu-section">Frame</div>
    <MenuItem stage={"frame"}>Settings</MenuItem>
  </div>

  {#if Object.keys($state.data.components).length > 0}
    <div class="menu-wrapper">
      <div class="menu-section">Components</div>
      {#each Object.keys($state.data.components) as componentGroup}
        <MenuItem stage={`components:${componentGroup}`}>
          {componentGroup}
        </MenuItem>
      {/each}
    </div>
  {/if}

  {#if Object.keys($state.data.colors).length > 0}
    <div class="menu-wrapper">
      <div class="menu-section">Colors</div>
      {#each Object.keys($state.data.colors) as colorGroup}
        <MenuItem stage={`colors:${colorGroup}`}>{colorGroup}</MenuItem>
      {/each}
    </div>
  {/if}
</div>
<div class="right">
  {#if activeStageSplit[0] === "components"}
    <ComponentGroupForm componentGroup={activeStageSplit[1]} />
  {:else if activeStageSplit[0] === "colors"}
    <ColorsGroupForm colorGroup={activeStageSplit[1]} />
  {:else if activeStageSplit[0] === "frame"}
    <FrameForm />
  {/if}
</div>

<style lang="scss">
  .left {
    width: 241px;
    border-right: 1px solid #e5e5e5;
    flex-shrink: 0;
    overflow: auto;
  }

  .right {
    width: 100%;
    overflow: auto;
  }

  .menu-section {
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0px 16px;
    font-size: 11px;
    font-weight: 600;
  }

  .menu-wrapper {
    margin: 8px 0;
  }
</style>
