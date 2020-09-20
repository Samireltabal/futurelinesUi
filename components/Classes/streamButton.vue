<template>
  <pre>
    <v-btn :disabled="student_paid" color="success" @click="goToStream()">
      إبدأ الدرس
    </v-btn>
    {{ singleClass.stream_id }}
  </pre>
</template>
<script>
export default {
  name: 'StreamButton',
  props: {
    singleClass: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      stream: {},
      notReady: true
    }
  },
  computed: {
    student_paid () {
      if (this.$auth.user.student.length) {
        return !this.$auth.user.student[0].paid
      } else {
        return false
      }
    },
    token () {
      return this.$auth.getToken('local')
    }
  },
  methods: {
    goToStream () {
      window.open('https://stream.futurelines.live:5443/WebRTCAppEE/student.html?classId=' + this.singleClass.stream_id + '&token=' + this.token)
    }
  }
}
</script>
