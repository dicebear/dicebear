<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="legal-links">
        <RouterLink to="/licenses/">Licenses</RouterLink>
        &middot;
        <RouterLink to="/legal/privacy-policy/">Privacy Policy</RouterLink>
        &middot;
        <RouterLink to="/legal/legal-notice/">Legal Notice / Impressum</RouterLink>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue';

export default {
  name: 'Layout',

  components: {
    ParentLayout,
  },
};
</script>

<style scoped lang="scss">
.legal-links {
  margin-top: 20px;
  border-top: 1px solid #eaecef;
  text-align: center;
  padding: 1rem 0;

  a {
    color: #4e6e8e;
    font-weight: 400;
    margin: 0 0.5rem;

    &:hover {
      color: #3eaf7c;
    }
  }
}
</style>
