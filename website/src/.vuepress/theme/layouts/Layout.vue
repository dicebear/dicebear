<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="legal-links">
        <ul>
          <li>
            <a href="https://twitter.com/legal/privacy-policy/">Twitter <OutboundLink /></a>
          </li>
          <li>
            <a href="https://dicebear.betteruptime.com/">Status <OutboundLink /></a>
          </li>
          <li>
            <a href="https://github.com/dicebear/dicebear">GitHub <OutboundLink /></a>
          </li>
        </ul>

        <ul>
          <li>
            <RouterLink to="/licenses/">Licenses</RouterLink>
          </li>
          <li>
            <RouterLink to="/legal/privacy-policy/">Privacy Policy</RouterLink>
          </li>
          <li>
            <RouterLink to="/legal/legal-notice/">Legal Notice / Impressum</RouterLink>
          </li>
        </ul>
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

<style lang="stylus" scoped>
.legal-links {
  margin-top: 2rem;
  padding: .75rem 0;
  text-align: center;

  ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: .25rem 0;
    padding: 0;
    color: darken($borderColor, 30%);
    list-style-type: none;

    li {
      margin: 0 0.5rem;
    }

    a {
      font-weight: 400;
      color: darken($borderColor, 30%);

      &:hover {
        color: darken($borderColor, 50%);
      }
    }
  }
}
</style>
