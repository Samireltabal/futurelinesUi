<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="@/assets/images/logo.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <blockquote class="blockquote">
        &#8220;
        جاري تحضير الجداول
        &#8221;
        <footer>
          <small>
            <em>&mdash; إدارة فيوتشر لاينز</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  layout: 'default',
  middleware: ['auth']
}
</script>
