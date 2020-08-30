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
          <v-toolbar-title>{{ $t('logintitle') }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="error.status" type="error">
            {{ error.message.message ? $t(error.message.message) : $t(error.message.error) }}
          </v-alert>
          <authForm :button-text="$t('logintitle')" :has-name="false" :callback="loginUser" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import authForm from '@/components/Auth/authForm'
// import { connect } from '@/plugins/ws'
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
      }
    }
  },
  computed: {
    title () {
      return this.$t('logintitle')
    }
  },
  methods: {
    loginUser (userInfo) {
      this.$auth.loginWith('local', {
        data: userInfo
      }).then((response) => {
        this.$api.setToken(response.data.access_token, 'Bearer')
        this.$auth.fetchUser()
      }).catch((error) => {
        this.error = {
          status: true,
          message: error.response.data
        }
      })
    }
  },
  head () {
    return { title: this.title }
  }
}
</script>
