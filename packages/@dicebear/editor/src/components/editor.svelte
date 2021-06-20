<script lang="ts">
  import { Style, utils, schema } from '@dicebear/avatars';
  import type { Defaults, HiddenFields, Mode } from '../types';

  export let style: Style<any>;
  export let mode: Mode;
  export let defaults: Defaults;
  export let hiddenFields: HiddenFields = [];

  $: aliases = new Map([...utils.schema.aliasesMap(schema), ...utils.schema.aliasesMap(style.schema)]);

  $: properties = {
    ...utils.schema.properties(schema),
    ...utils.schema.properties(style.schema),
  };

  $: fields = Object.keys(properties).filter((field) => {
    const property = properties[field];

    if (typeof property === 'boolean') {
      return false;
    }

    if (property.description?.match(/@deprecated/)) {
      return false;
    }

    if (mode === 'fixed' && field.match(/(Probability$|Chance$|^seed$)/)) {
      return false;
    }

    return false === aliases.has(field) && false === hiddenFields.includes(field);
  });
</script>

<main>
  {#each fields as field}
    <div>{field}</div>
  {/each}
</main>

<style>
</style>
