<script>
  import { state } from '../stores/state';
  import { createZip } from '../utils/createZip';

  import Container from './Container.svelte';

  onmessage = (event) => {
    const message = event.data.pluginMessage;

    switch (message.type) {
      case 'export':
        createZip(message.data.files, message.data.name).then(() => {
          parent.postMessage({ pluginMessage: { type: 'init' } }, '*');
        });
        break;

      default:
        state.set(message);
    }
  };

  $: parent.postMessage({ pluginMessage: { type: 'init' } }, '*');
</script>

<Container />

<style lang="scss" global>
  @use "~ress/ress.css";
</style>
