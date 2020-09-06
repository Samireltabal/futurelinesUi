<template>
  <v-btn :disabled="student_paid" color="success" @click="goToStream()">
    إبدأ الدرس
  </v-btn>
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
  async fetch () {
    await this.$api.get('/stream/getStream/' + this.singleClass.subject.subject_id + '/' + this.singleClass.grade.id + '/' + this.singleClass.subject.teacher_id).then((response) => {
      this.stream = response.data
    })
  },
  data () {
    return {
      stream: {}
    }
  },
  computed: {
    student_paid () {
      if (this.$auth.user.student.length) {
        return !this.$auth.user.student[0].paid
      } else {
        return false
      }
    }
  },
  methods: {
    goToStream () {
      this.$router.push('/class/' + this.stream.id + '/student')
    }
  }
}
</script>
