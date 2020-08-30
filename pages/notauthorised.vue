<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <client-only>
        <blockquote class="blockquote">
          &#8220;{{ message }}&#8221;
        </blockquote>
      </client-only>
      <nuxt-link to="/account/verify">
        Verify Now
      </nuxt-link>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  ssr: false,
  computed: {
    message () {
      return this.$route.query.message
    }
  }
}
</script>
