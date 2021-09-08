<script>
  import { SelectMenu } from 'figma-plugin-ds-svelte';

  export let items = [];
  export let value = '';

  $: menuItems = items.map((item) => {
    return {
      value: item,
      label: item ? item : '- None -',
      group: null,
      selected: item === value,
    };
  });
</script>

<SelectMenu bind:menuItems on:change={(e) => (value = e.detail.value)} />
