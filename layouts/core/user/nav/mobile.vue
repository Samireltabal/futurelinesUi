<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      flat
      :right="$vuetify.rtl"
      app
    >
      <v-list>
        <mobileMenuItem
          v-for="(item, i) in items"
          :key="i"
          :item="item"
        />
      </v-list>
    </v-navigation-drawer>
    <mobile-top-bar @drawerClicked="drawer = !drawer" />
  </div>
</template>
<script>
import MobileTopBar from './topbar/mobiletopbar'
import mobileMenuItem from '~/components/Menus/mobileMenuItem'
export default {
  name: 'Navbar',
  ssr: false,
  components: {
    MobileTopBar,
    mobileMenuItem
  },
  props: {
    items: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      title: process.env.APPLICATION_NAME
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.loggedIn
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>
