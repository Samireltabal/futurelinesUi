<template>
  <v-layout>
    <v-flex class="text-center">
      <v-card>
        <img
          src="@/assets/images/logo.png"
          alt="Vuetify.js"
          class="mb-5"
        >
        <v-card-title>
          <h1>جدول الحصص</h1>
        </v-card-title>
        <v-card-text>
          <v-card v-for="(data ,day) in timetable" :key="day">
            <v-card-title>
              {{ day }}
            </v-card-title>
            <v-card-text>
              <v-list-group>
                <v-list-item v-for="singleClass in data" :key="singleClass.id">
                  <v-list-item-title>
                    <h5> المادة : {{ singleClass.subject.subject_name }} ( {{ singleClass.grade.grade_name }} ) </h5>
                    <h6> الساعه : {{ singleClass.start_at }} - المدة : {{ singleClass.duration }} دقيقه </h6>
                  </v-list-item-title>
                  <!-- <v-list-item-subtitle>
                     
                  </v-list-item-subtitle> -->
                  <v-list-item-action v-if="$auth.user.role === 'student'">
                    <StreamButton :single-class="singleClass" />
                  </v-list-item-action>
                  <v-list-item-action v-if="$auth.user.role === 'teacher'">
                    <v-btn icon @click="startStream(data.stream_id)">
                      إبدأ الحصة
                      <v-icon color="green darken-1">
                        mdi-play
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>
              <v-card-text />
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { StreamButton } from '@/components/Classes/streamButton'
export default {
  layout: 'default',
  components: {
    StreamButton
  },
  middleware: ['auth'],
  async fetch () {
    await this.$api.get('/schedules/mytable').then((response) => {
      this.timetable = response.data
    })
  },
  data () {
    return {
      timetable: {}
    }
  },
  methods: {
    startStream (singleClass) {
      const data = {
        subject_id: singleClass.subject.subject_id,
        grade_id: singleClass.grade.id,
        start_at: singleClass.start_at,
        weekday_id: singleClass.weekday_id
      }
      this.$api.post('stream/start', data).then((response) => {
        this.$router.push('/class/' + response.data.id + '/teacher')
      })
    }
  }
}
</script>
