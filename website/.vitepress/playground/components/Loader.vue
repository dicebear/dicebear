<template>
  <div class="loader">
    <div class="loader-body">
      <div class="loader-spinner" />
      <div class="loader-text">Please wait...</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 180px);
  padding: 120px;

  &-body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-spinner {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 5px solid transparent;
    border-top-color: var(--ifm-color-primary);
    animation: loader 1.1s infinite linear;
  }

  &-text {
    text-align: center;
    margin-top: 12px;
  }
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
