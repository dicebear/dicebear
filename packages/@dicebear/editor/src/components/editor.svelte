<script lang="ts">
  import type { Style } from '@dicebear/avatars';
  import type { HiddenFields, Mode } from '../types';

  import Field from './field.svelte';

  import { createFields } from '../utils/createFields';

  export let style: Style<any>;
  export let mode: Mode;
  //export let defaults: Defaults;
  export let hiddenFields: HiddenFields = [];

  $: fields = Array.from(createFields(style, mode).values());
</script>

<main>
  {#each fields as field}
    {#if false === hiddenFields.includes(field.name)}
      <Field {field} />
    {/if}
  {/each}
</main>

<style>
</style>
