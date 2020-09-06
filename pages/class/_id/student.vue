<template>
  <v-layout>
    <h1>{{ $route.params.id }}</h1>
    <iframe
      width="100%"
      height="50vh"
      :src="url"
      frameborder="0"
      allowfullscreen
    />
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
      stream_id: '931358145727022020468299'
    }
  },
  computed: {
    token () {
      return this.$auth.getToken('local')
    },
    url () {
      return 'https://api.futurelines.net/api/stream/show/' + this.stream_id + '/' + this.token
    }
  }
}
</script>
