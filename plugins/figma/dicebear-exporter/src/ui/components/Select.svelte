<script>
  import { SelectMenu } from 'figma-plugin-ds-svelte';

  export let items = [];
  export let value = '';

  $: itemsClone = JSON.parse(JSON.stringify(items));
  $: menuItems = itemsClone.map((item) => {
    item.selected = item.value === value;

    return item;
  });
</script>

<SelectMenu bind:menuItems on:change={(e) => (value = e.detail.value)} />
