<script>
  import { Button } from 'figma-plugin-ds-svelte';

  import { state } from '../stores/state';

  import ErrorScene from './ErrorScene.svelte';
  import LoadingScene from './LoadingScene.svelte';
  import LoadedScene from './LoadedScene.svelte';

  function onExport() {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'export',
        },
      },
      '*'
    );
  }
</script>

<div class="container">
  <div class="top">
    {#if $state.type === 'error'}
      <ErrorScene />
    {:else if $state.type === 'loaded'}
      <LoadedScene />
    {:else}
      <LoadingScene />
    {/if}
  </div>
  <div class="bottom">
    <Button disabled={$state.type !== 'loaded'} on:click={onExport}
      >Export</Button
    >
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .top {
    flex-grow: 1;
    display: flex;
    justify-content: stretch;
    overflow: hidden;
  }

  .bottom {
    border-top: 1px solid #e5e5e5;
    text-align: right;
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
</style>
