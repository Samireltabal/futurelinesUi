<template>
  <v-layout fluid>
    <v-row class="text-center">
      <v-col cols="12" sm="12">
        <v-alert v-if="error.status" type="error" prominent>
          <h3>{{ error.message }}</h3>
        </v-alert>
      </v-col>
      <v-col cols="12" sm="12">
        <v-alert v-if="success.status" type="success" transition="scroll-y-transition" prominent>
          {{ success.data }}
        </v-alert>
        <img
          src="@/assets/images/logo.png"
          alt="Futurelines.net"
          class="mb-5"
        >
        <p>
          برجاء مراجعة بريدك الإلكتروني لكود التفعيل
        </p>
      </v-col>
      <v-col cols="12" sm="12">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="12" justify="center" align="center">
            <form justify="center" align="center" class="otp-container">
              <input
                ref="digit1"
                v-model="code[0]"
                type="text"
                maxlength="1"
                class="otp-input"
                autofocus
                :disabled="isLoading"
                onFocus="this.select()"
                @keyup="$event.target.nextElementSibling.focus()"
              >
              <input
                v-model="code[1]"
                type="text"
                maxlength="1"
                class="otp-input"
                :disabled="isLoading"
                onFocus="this.select()"
                @keyup="$event.target.nextElementSibling.focus()"
              >
              <input
                v-model="code[2]"
                type="text"
                maxlength="1"
                class="otp-input"
                :disabled="isLoading"
                onFocus="this.select()"
                @keyup="$event.target.nextElementSibling.focus()"
              >
              <input
                v-model="code[3]"
                type="text"
                maxlength="1"
                class="otp-input"
                :disabled="isLoading"
                onFocus="this.select()"
                @keyup="$event.target.nextElementSibling.focus()"
              >
              <input
                v-model="code[4]"
                type="text"
                maxlength="1"
                class="otp-input"
                :disabled="isLoading"
                onFocus="this.select()"
                @keyup="$event.target.nextElementSibling.focus()"
              >
              <input
                v-model="code[5]"
                type="text"
                maxlength="1"
                class="otp-input"
                :disabled="isLoading"
                onFocus="this.select()"
                @keyup="submitOtp"
              >
            </form>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12">
        <v-flex>
          <v-btn class="mt-5" size="lg" :disabled="cannotRequest" type="primary" @click="requestResend">
            ارسال الكود مره اخرى
          </v-btn>
        </v-flex>
        <v-overlay :value="isLoading">
          <v-progress-circular indeterminate size="64" />
        </v-overlay>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  middleware: ['auth', 'notVerified'],
  ssr: false,
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
  mounted () {

  },
  methods: {
    submitOtp () {
      this.isLoading = true
      this.$api.post('/auth/verify', { otp: this.code }).then(() => {
        this.$emit('verifySuccess')
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

</style>
