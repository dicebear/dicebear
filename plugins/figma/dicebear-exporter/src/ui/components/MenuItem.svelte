<script>
  import { activeStage } from '../stores/activeStage';

  export let stage;

  function onClick() {
    activeStage.set(stage);
  }
</script>

<button
  on:click={onClick}
  class={`menu-item ${stage === $activeStage ? 'active' : ''}`}
>
  <slot />
</button>

<style>
  .menu-item {
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0px 15px;
    border: 1px solid transparent;
    font-size: 11px;
    font-weight: 400;
  }

  button:hover:not(.active) {
    border-color: #18a0fb;
  }

  .active {
    background-color: #daebf7;
    border-color: #daebf7;
  }
</style>
