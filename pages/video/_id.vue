<template>
  <v-layout
    justify-center
    align-center
  >
    <v-row>
      <v-col cols="12" lg="12">
        <h2 class="grey--text text--darken-2 ma-4">
          {{ data.title }}
        </h2>
      </v-col>
      <v-col>
        <v-row>
          <v-col
            cols="12"
            lg="12"
            md="12"
            sm="12"
          >
            <v-card>
              <videoPlayer
                :options="playerOptions"
              />
              <v-card-title>
                {{ data.title }}
              </v-card-title>
              <v-card-subtitle v-html="data.content" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import 'video.js/dist/video-js.css'

import { videoPlayer } from 'vue-video-player'
export default {
  name: 'Home',
  components: {
    videoPlayer
  },
  asyncData ({ $api, params }) {
    return $api.$get('media/show/' + params.id).then((response) => {
      return { data: response }
    }).catch(() => {
      return { data: 'network error' }
    })
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    api () {
      return process.env.API_BASE
    },
    playerOptions () {
      return {
        autoplay: true,
        muted: false,
        language: 'ar',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          // mp4
          src: this.data.url
          // webm
          // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        poster: this.data.thumbnail
      }
    },
    loggedIn () {
      return this.$auth.loggedIn
    },
    completed () {
      if (this.$auth.loggedIn && this.$auth.user.student.length) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ping () {
      this.$api.get('ping').then((response) => {
        this.data = response.data
      })
    }
  }
}
</script>
