<template>
  <v-layout>
    <v-col cols="12" lg="10" sm="12">
      <v-card>
        <v-card-title>
          فصل {{ $route.params.id }}
        </v-card-title>
        <v-card-text>
          <iframe
            width="100%"
            height="700px"
            :src="url"
            frameborder="0"
            allowfullscreen
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    token () {
      return this.$auth.getToken('local')
    },
    url () {
      return 'https://api.futurelines.net/api/stream/show/' + this.$route.params.id + '/' + this.token
    }
  }
}
</script>
