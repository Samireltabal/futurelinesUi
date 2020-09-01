<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="@/assets/images/logo.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <client-only>
        <blockquote class="blockquote">
          &#8220;{{ message }}&#8221;
        </blockquote>
      </client-only>
      <nuxt-link to="/account/verify">
        تفعيل الحساب
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
