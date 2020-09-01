<template>
  <v-layout fluid>
    <verification @verifySuccess="verificationDone" />
  </v-layout>
</template>
<script>
import verification from '@/components/Verification'
export default {
  middleware: ['auth', 'notVerified'],
  ssr: false,
  components: {
    verification
  },
  data () {
    return {
      code: ['', '', '', '', '', ''],
      isLoading: false,
      cannotRequest: false,
      error: {
        status: false,
        message: ''
      },
      success: {
        status: false,
        data: ''
      }
    }
  },
  computed: {

  },
  methods: {
    verificationDone () {
      this.$router.push('/')
    },
    submitOtp () {
      this.isLoading = true
      this.$api.post('/auth/verify', { otp: this.code }).then(() => {
        this.$router.push('/')
      }).catch((error) => {
        this.error = {
          status: true,
          message: error.response.data.message
        }
        setTimeout(() => {
          this.isLoading = false
          if (process.client) {
            this.$refs.digit1.$el.focus()
          }
        }, 500)
      })
    },
    requestResend () {
      this.cannotRequest = true
      this.$api.get('/auth/reverify').then((response) => {
        this.success = {
          status: true,
          data: response.data.message
        }
        this.error = {
          status: false,
          message: ''
        }
        setTimeout(() => {
          this.cannotRequest = false
        }, 5000)
      }).catch((error) => {
        this.cannotRequest = false
        this.error = {
          status: true,
          message: error.response.data.message
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 5px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: "center";
}
.otp-input.error {
  border: 1px solid red !important;
}
</style>
