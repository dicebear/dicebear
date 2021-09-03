<script>
  import { AceEditor } from 'svelte-ace';
  import 'brace/mode/typescript';
  import 'brace/theme/chrome';

  import { state } from '../stores/state';
  import Label from './Label.svelte';
</script>

<div class="form">
  <div class="section">
    <Label>onPreCreateHook</Label>
    <AceEditor
      width="100%"
      height="200px"
      lang="typescript"
      theme="chrome"
      bind:value={$state.data.frame.settings.onPreCreateHook}
      options={{
        showGutter: false,
      }}
    />
  </div>
  <div class="section">
    <Label>onPostCreateHook</Label>
    <AceEditor
      width="100%"
      height="200px"
      lang="typescript"
      theme="chrome"
      bind:value={$state.data.frame.settings.onPostCreateHook}
      options={{
        showGutter: false,
      }}
    />
  </div>
</div>

<style lang="scss">
  .section {
    margin: 8px;
  }
</style>
