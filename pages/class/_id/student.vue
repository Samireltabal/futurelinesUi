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
          <v-row>
            <v-col>
              <v-textarea v-model="message" placeholder="الرساله" outlined />
              <v-btn color="success" block small outlined @click="postComment">
                إضافه تعليق
              </v-btn>
            </v-col>
          </v-row>
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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  async fetch () {
    await this.$api.get('/chat/get/' + this.$route.params.id).then((response) => {
      this.items = response.data.data
    })
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
  },
  mounted () {
    const channel = '/stream/' + this.$route.params.id
    this.$mqtt.subscribe([channel], {}, () => {
      this.$mqtt.on('message', (topic, message, packet) => {
        if (message.toString() === 'CHAT_UPDATED') {
          this.$fetch()
        }
        if (message.toString() === 'STREAM_ENDED') {
          window.Swal.fire(
            'إنتهى البث المباشر',
            'سيتم تحويلك لصفحة الجدول الأن',
            'info'
          )
          setTimeout(() => {
            this.$router.push('/')
          }, 5000)
        }
      })
    })
    this.$api.post('/chat/add', {
      stream_id: this.$route.params.id,
      content: 'متصل الأن'
    }).then(() => {
      this.$fetch()
    })
  },
  methods: {
    postComment () {
      const obj = {
        stream_id: this.$route.params.id,
        content: this.message
      }
      this.$api.post('/chat/add', obj).then(() => {
        this.$fetch()
        this.message = ''
      })
    }
  }
}
</script>
