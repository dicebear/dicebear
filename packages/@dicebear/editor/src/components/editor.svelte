<script lang="ts">
  import { utils, schema as coreSchema } from '@dicebear/avatars';
  import type { Style } from '@dicebear/avatars';
  import type { Defaults, HiddenFields, Mode } from '../types';

  import * as schemaUtil from '../utils/schema';
  import * as propertyUtil from '../utils/property';

  export let style: Style<any>;
  export let mode: Mode;
  export let defaults: Defaults;
  export let hiddenFields: HiddenFields = [];

  $: aliases = new Map([...utils.schema.aliasesMap(coreSchema), ...utils.schema.aliasesMap(style.schema)]);

  $: properties = {
    ...utils.schema.properties(coreSchema),
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

  $: schema = schemaUtil.omitXOf(style.schema);

  $: {
    for (let field of fields) {
      try {
        console.log(propertyUtil.convertToField(schema, field));
      } catch (e) {
        console.error(e);
      }
    }
  }

  console.log(defaults);
</script>

<main>
  {#each fields as field}
    <div>{field}</div>
  {/each}
</main>

<style>
</style>
