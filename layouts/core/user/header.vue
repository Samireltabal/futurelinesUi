<template>
  <navbar />
</template>
<script>
import Vue from 'vue'
import VueMqtt from 'vue-mqtt'
import navbar from './navbar'
export default {
  name: 'Header',
  components: {
    navbar
  },
  computed: {
    loggedIn () {
      return this.$auth.loggedIn
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
            reconnectPeriod: 60000,
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
