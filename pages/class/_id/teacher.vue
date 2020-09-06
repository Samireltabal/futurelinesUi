<template>
  <v-layout>
    <v-col cols="12" lg="10" sm="12">
      <v-card>
        <v-card-title>
          فصل {{ $route.params.id }}
        </v-card-title>
        <v-card-text>
          <v-btn large block color="success" @click="gotostream">
            إبدأ البث
          </v-btn>
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
      return 'https://api.futurelines.net/api/stream/publish/' + this.$route.params.id + '/' + this.token
    }
  },
  methods: {
    gotostream () {
      window.open(this.url, '_blank')
    }
  }
}
</script>
