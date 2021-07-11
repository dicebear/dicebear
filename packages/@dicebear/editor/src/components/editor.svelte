<script lang="ts">
  import type { Style, StyleSchema } from '@dicebear/avatars';
  import type { Defaults, HiddenFields, Mode } from '../types';

  import { utils, schema as coreSchema } from '@dicebear/avatars';
  import mergeAllOf from 'json-schema-merge-allof';

  import * as schemaUtil from '../utils/schema';
  import * as propertyUtil from '../utils/property';

  export let style: Style<any>;
  export let mode: Mode;
  export let defaults: Defaults;
  export let hiddenFields: HiddenFields = [];

  $: schema = schemaUtil.omitXOf({
    allOf: [coreSchema, style.schema],
  }) as StyleSchema;

  $: aliases = utils.schema.aliasesMap(schema);

  $: fields = Object.keys(schema.properties).filter((field) => {
    const property = schema.properties[field];

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

  $: {
    for (let field of fields) {
      try {
        console.log(propertyUtil.convertToField(schema, field));
      } catch (e) {
        console.error(e);
      }
    }
  }
</script>

<main>
  {#each fields as field}
    <div>{field}</div>
  {/each}
</main>

<style>
</style>
