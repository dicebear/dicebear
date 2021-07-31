<script lang="ts">
</script>

<input {...$$props} />

<style lang="scss">
  input:not([type='range']) {
    display: block;
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 8px 12px;
    transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
    background: none;
    box-shadow: none;

    &:hover {
      border-color: #60a5fa;
    }

    &:focus {
      outline: none;
      border: 2px solid #60a5fa;
      padding: 7px 11px;
    }
  }

  input[type='range'] {
    display: block;
    width: 100%;
  }
</style>
