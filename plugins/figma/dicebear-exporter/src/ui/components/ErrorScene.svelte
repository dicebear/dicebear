<script>
  import { state } from '../stores/state';
</script>

<div class="error">
  <div class="message">
    {$state.data.message}
  </div>
  <div class="help">
    <p>
      <strong>Need help?</strong>
    </p>
    <p>
      <a href="https://dicebear.com" target="_blank">Read Documentation</a>
    </p>
  </div>
</div>

<style lang="scss">
  .error {
    align-self: center;
    margin: 0 auto;
    padding: 40px;
    text-align: center;

    .message {
      padding: 20px;
      margin-bottom: 40px;
      border-radius: 4px;
      background-color: rgba(242, 72, 34, 0.1);
      border: 1px solid #f24822;
      color: #f24822;
      font-size: 11px;
    }

    .help {
      font-size: 11px;

      p + p {
        margin-top: 6px;
      }
    }
  }
</style>
