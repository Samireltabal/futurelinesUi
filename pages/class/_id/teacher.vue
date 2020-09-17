<template>
  <v-row>
    <v-col cols="12" lg="12" md="12" sm="12">
      <v-card>
        <v-card-title>
          فصل {{ $route.params.id }}
        </v-card-title>
        <v-card-text>
          <v-btn large block color="success" @click="gotostream">
            إبدأ البث
          </v-btn>
          <v-btn large block color="error" class="mt-5" @click="endStream">
            اغلق الفصل
          </v-btn>
          <v-btn small block color="warning" class="black--text mt-5" @click="alternateStream">
            البث البديل \ في حالة فشل الإتصال بالطرق المعتادة
          </v-btn>
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
      return 'https://api.futurelines.net/api/stream/publish/' + this.$route.params.id + '/' + this.token
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
  },
  methods: {
    endStream () {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'لا يمكن إسترجاع بيانات الطالب بعد حذفها',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'انهي الفصل',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$mqtt.publish('/stream/' + this.$route.params.id, 'END_STREAM')
        }
      })
    },
    alternateStream () {
      window.Swal.fire({
        title: 'الطريقة البديله للبث',
        text: 'طريقة احتياطيه للساده المدرسين الغير قادرين علي البث في الصفحة العادية - متابعة الشات تكون عن طريق الصفحة الحاليه',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'الذهاب لصفحة البث المؤقت',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          const alternate = 'https://stream.futurelines.live:5443/WebRTCAppEE/index.html?name=' + this.$route.params.id
          window.open(alternate, '_blank')
        }
      })
    },
    postComment () {
      const obj = {
        stream_id: this.$route.params.id,
        content: this.message
      }
      this.$api.post('/chat/add', obj).then(() => {
        this.$fetch()
        this.message = ''
      })
    },
    gotostream () {
      window.open(this.url, '_blank')
    }
  }
}
</script>
