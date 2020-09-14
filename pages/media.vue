<template>
  <v-layout
    justify-center
    align-center
  >
    <v-row>
      <v-col cols="12" lg="12">
        <h2 class="grey--text text--darken-2 ma-4">
          المعرض
        </h2>
      </v-col>
      <v-col>
        <v-row>
          <v-col
            v-for="video in data"
            :key="video.id"
            cols="12"
            lg="3"
            md="4"
            sm="12"
          >
            <v-card :to="'/video/' + video.id">
              <img
                :id="video.id"
                :src="video.thumb"
                height="200px"
                contain
                @error="handle(video.id)"
              >
              <v-card-title>
                {{ video.title }}
              </v-card-title>
              <v-card-subtitle v-html="video.description" />
              <v-card-actions>
                <v-btn text @click="jumpToVideo(video.id)">
                  مشاهدة <v-icon>mdi-play</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>

export default {
  name: 'Home',
  asyncData ({ $api }) {
    return $api.$get('v2/vod/list').then((response) => {
      return { data: response }
    }).catch(() => {
      return { data: 'network error' }
    })
  },
  data () {
    return {
      data: {},
      ifImageBroken: false,
      brokenText: ''
    }
  },
  computed: {
  },
  methods: {
    jumpToVideo (id) {
      this.$router.push('/video/' + id)
    },
    handle (id) {
      document.getElementById(id).src = require('../assets/images/logo.png')
    }
  }
}
</script>
