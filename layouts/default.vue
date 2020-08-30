<template>
  <v-app light>
    <s-header />
    <v-main>
      <v-container :fluid="$device.isMobileOrTablet">
        <nuxt />
      </v-container>
    </v-main>
    <client-only>
      <s-bottom v-if="$device.isMobileOrTablet" />
      <s-footer v-if="$device.isDesktop" />
    </client-only>
  </v-app>
</template>

<script>
import header from './core/user/header'
import footer from './core/user/footer'
import bttomNav from './core/user/nav/bottom/MobileBottom'
export default {
  name: 'Admin',
  components: {
    's-header': header,
    's-footer': footer,
    's-bottom': bttomNav
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
