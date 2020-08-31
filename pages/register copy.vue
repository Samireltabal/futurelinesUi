<template>
  <v-row align="center" justify="center">
    <v-col
      cols="12"
      sm="8"
      lg="4"
      md="6"
    >
      <v-card class="elevation-3">
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <v-toolbar-title>{{ $t('Sign Up') }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="error.status" type="error" transition="scroll-y-transition" prominent>
            {{ $t(error.message.message) }}
          </v-alert>
          <v-alert v-if="success.status" type="success" transition="scroll-y-transition" prominent>
            {{ success.data }}
          </v-alert>
          <authForm :button-text="$t('Sign Up')" :has-name="true" :callback="register" :errors="error" @resetForm="clearData" />
          <v-overlay
            :absolute="true"
            :value="loading"
            :opacity="0.8"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import authForm from '@/components/Auth/authForm'
export default {
  middleware ({ store, redirect }) {
    if (store.state.auth.loggedIn) {
      return redirect('/')
    }
  },
  components: {
    authForm
  },
  data () {
    return {
      error: {
        status: false,
        message: ''
      },
      success: {
        status: false,
        data: ''
      },
      loading: false
    }
  },
  computed: {
    title () {
      return this.$t('logintitle')
    }
  },
  methods: {
    register (userInfo) {
      this.loading = true
      this.$api.post('auth/signup', userInfo).then((response) => {
        this.error = {
          status: false,
          message: ''
        }
        this.success = {
          status: true,
          data: response.data.message
        }
        this.loading = false
        setTimeout(() => {
          this.success = {
            status: false,
            message: ''
          }
          this.loading = false
          this.$router.push('/login')
        }, 1000)
      }).catch((error) => {
        this.error = {
          status: true,
          message: error.response.data
        }
        this.loading = false
      })
    },
    clearData () {
      this.error = {
        status: false,
        message: ''
      }
    }
  },
  head () {
    return { title: this.title }
  }
}
</script>
