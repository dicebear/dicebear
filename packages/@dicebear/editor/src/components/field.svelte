<script lang="ts">
  import type { Field } from '../types';

  import Input from './input.svelte';

  export let field: Field;
</script>

<main>
  <label for={field.name}>{field.title ?? field.name}</label>
  <div>
    {#if ['text', 'number', 'range'].includes(field.type)}
      <Input {...field} />
    {:else if field.type === 'select'}
      Select
    {:else if field.type === 'checkbox'}
      <input type="checkbox" />
    {/if}
  </div>
</main>

<style lang="scss">
  label {
    display: block;
    width: 100%;
    font-weight: 500;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 1rem;
  }

  div {
    margin-bottom: 2rem;
  }
</style>
