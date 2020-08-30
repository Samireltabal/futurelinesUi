<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1> {{ status }} {{ origin }} </h1>
        <p>
          {{ message }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  ssr: false,
  data () {
    return {
      message: ''
    }
  },
  computed: {
    origin () {
      return this.$route.query.origin
    },
    status () {
      if (this.$route.query.error) {
        return 'failed'
      } else {
        return 'successfull'
      }
    }
  },
  mounted () {
    if (this.$route.query.error) {
      this.$toast.error('Error while authenticating')
      this.message = this.$route.query.error
    } else if (this.$route.query.token) {
      this.$toast.success('Successfully authenticated')
      this.$auth.setUserToken(this.$route.query.token).then(() => {
        this.message = 'Successfully Logged In'
        this.$api.setToken(this.$route.query.token, 'Bearer')
      })
    }
  }
}
</script>
