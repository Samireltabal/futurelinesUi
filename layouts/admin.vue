<template>
  <v-app light>
    <client-only>
      <s-header />
      <v-main>
        <v-container fluid>
          <nuxt />
        </v-container>
      </v-main>
      <s-footer />
    </client-only>
  </v-app>
</template>

<script>
import header from './core/admin/header'
import footer from './core/admin/footer'
export default {
  name: 'Admin',
  middleware: ['employee'],
  components: {
    's-header': header,
    's-footer': footer
  },
  data () {
    return {
      fixed: true
    }
  },
  computed: {
  }
}
</script>
