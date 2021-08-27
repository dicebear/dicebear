<div class="loader">
  <div class="spinner">
    <div class="sk-chase">
      <div class="sk-chase-dot" />
      <div class="sk-chase-dot" />
      <div class="sk-chase-dot" />
      <div class="sk-chase-dot" />
      <div class="sk-chase-dot" />
      <div class="sk-chase-dot" />
    </div>
  </div>

  <p>
    <strong>Processing</strong>
  </p>
  <p>
    This can take a while on large files. Please do not change the file until
    the process is complete.
  </p>
</div>

<style lang="scss">
  @use '~spinkit/spinkit.css';

  .loader {
    align-self: center;
    text-align: center;
    margin: 0 auto;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 11px;
  }

  .spinner {
    margin-bottom: 40px;
  }

  p + p {
    margin-top: 6px;
  }
</style>
