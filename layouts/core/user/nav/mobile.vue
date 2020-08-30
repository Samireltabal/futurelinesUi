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
import Vue from 'vue'
import VueMqtt from 'vue-mqtt'
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
    loggedIn: {
      handler: 'handleMqtt',
      immediate: true
    }
  },
  methods: {
    handleMqtt (value) {
      if (!this.$mqtt) {
        if (value) {
          const mqttOptions = {
            clientId: this.$auth.user.email,
            username: this.$auth.user.email,
            reconnectPeriod: 5000,
            password: this.$auth.getToken('local')
          }
          Vue.use(VueMqtt, process.env.WS_URL, mqttOptions)
          const channel = '/' + this.$auth.user.uuid + '/notifications'
          const channel2 = '/' + this.$auth.user.uuid + '/fromanotherArea'
          const channels = [
            channel,
            channel2
          ]
          this.$mqtt.subscribe(channels, {}, () => {
            this.$mqtt.on('message', (topic, message, packet) => {
              if (topic === channel2) {
                this.$toast.info(JSON.parse(message).message)
              } else if (topic === channel) {
                const constractor = {
                  icon: 'mdi-account',
                  type: 'success'
                }
                this.$toast.show(message, constractor)
                this.$auth.fetchUser()
              }
            })
          })
        }
      }
    }
  }
}
</script>
