import VueMqtt from 'vue-mqtt'
import Vue from 'vue'

export function connect ({ store, $auth }, inject) {
  if ($auth.loggedIn) {
    const mqttOptions = {
      clientId: $auth.user.email,
      username: $auth.user.email,
      reconnectPeriod: 5000,
      password: $auth.getToken('local')
    }
    const MQTT = Vue.use(VueMqtt, process.env.WS_URL, mqttOptions)
    inject('mqtt', MQTT)
  } else {
    return false
  }
}

// export function Subscribe_State(channel) {
//   var state = channel + '/devstate'
//   let channels = [
//     state
//   ]
//   this.$mqtt.subscribe(channels, {}, () => {
//     this.$mqtt.on('message', (topic, message, packet) => {
//       if (topic === state) {
//         if (packet.payload.toString() === 'ONLINE') {
//           return true
//         } else {
//           return false
//         }
//       }
//     })
//   })
// }
