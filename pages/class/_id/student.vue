<template>
  <v-row>
    <v-col cols="12" lg="12" md="12" sm="12">
      <v-card>
        <v-card-title>
          فصل {{ $route.params.id }}
        </v-card-title>
        <v-card-text>
          <iframe
            width="100%"
            height="450px"
            :src="url"
            frameborder="0"
            allowfullscreen
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="12" md="12" sm="12">
      <v-card>
        <v-card-title>
          المحادثه
        </v-card-title>
        <v-card-text>
          <v-list dense>
          <v-list-item v-for="item in items" :key="item.name">
            <v-row>
              <v-col cols="12" lg="2" md="2">
                <span class="green--text"> <v-icon>mdi-account</v-icon> {{ item.user.name }} </span>
              </v-col>
              <v-col cols="12" lg="8" md="8">
                <v-icon>mdi-message</v-icon> {{ item.content }}
              </v-col>
              <v-col cols="12" lg="2" md="2">
                  <v-icon>mdi-clock</v-icon> {{ new Date(item.created_at).toLocaleTimeString() }}
              </v-col>
            </v-row>
          </v-list-item>
          </v-list>
          <v-row>
              <v-col>
                <v-textarea placeholder="الرساله" v-model="message" outlined />
                <v-btn color="success" block small outlined>إضافه تعليق</v-btn>
              </v-col>
            </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  async fetch() {
    this.$api.get('/chat/get/' + this.$route.params.id).then((response) => {
      this.items = response.data.data
    })
  },
  mounted () {
    if (this.$mqtt) {
      const channel = '/stream/' + this.$route.params.id
      this.$mqtt.subscribe(channel, {}, () => {
        this.$mqtt.on('message', (topic, message, packet) => {
          if(topic === channel) {
            window.swal.fire(
              'ok',
              'ok',
              'success'
            )
          }
        })
      })
    }
  },
  data () {
    return {
        items: [],
        message: ''
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
