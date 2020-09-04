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
              <v-img
                :src="video.thumbnail"
                height="200px"
                contain
              />
              <v-card-title>
                {{ video.title }}
              </v-card-title>
              <v-card-subtitle v-html="video.content" />
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
    return $api.$get('media/list').then((response) => {
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
    jumpToVideo (id) {
      this.$router.push('/video/' + id)
    }
  }
}
</script>
