<template>
  <v-skeleton-loader
    :loading="loading"
    type="table-heading, table-thead, table-tbody, table-tfoot"
  >
    <v-card>
      <v-card-title>
        <h3>{{ message }}</h3>
      </v-card-title>
      <v-card-subtitle>
        <v-select
          v-model="selection"
          :items="classes"
          item-text="room_name"
          item-value="id"
        />
      </v-card-subtitle>
      <v-card-text>
        <v-tabs
          v-model="tab"
          background-color="primary"
          dark
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          show-arrows
        >
          <v-tab
            v-for="classRoom in classes"
            :key="classRoom.id"
          >
            {{ classRoom.room_name }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="classDetails in classes"
            :key="classDetails.id"
          >
            <v-card flat>
              <v-card-text>
                <v-list>
                  <v-list-group
                    v-for="singleClass in classDetails.classes"
                    :key="singleClass.id"
                    prepend-icon="mdi-calendar"
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <span class="red--text text--darken-4">{{ singleClass.subject.subject_name }} - {{ singleClass.teacher.name }}</span>
                      </v-list-item-content>
                    </template>

                    <v-list-item
                      v-for="schedule in singleClass.schedules"
                      :key="schedule.id"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ schedule.start_at }} - {{ schedule.day.name }} ( {{ schedule.duration }} دقيقه )
                          <v-btn fab icon large color="red" @click="deleteSchedule(schedule.id)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <addSchedule :single-class="singleClass" @scheduleAdded="$fetch" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                </v-list>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-skeleton-loader>
</template>
<script>
import addSchedule from '@/components/classes/addSchedule'
export default {
  name: 'Calendar',
  ssr: false,
  layout: 'admin',
  components: {
    addSchedule
  },
  async fetch () {
    await this.$api.get('classes').then((response) => {
      this.classes = response.data
      this.loading = false
    })
  },
  data () {
    return {
      tab: null,
      classes: {},
      loading: true,
      message: 'calendar page'
    }
  },
  computed: {
    selection: {
      get () {
        return this.tab + 1
      },
      set (value) {
        this.tab = value - 1
      }
    }
  },
  methods: {
    deleteSchedule (id) {
      this.$api.get('schedules/delete/' + id).then(() => {
        window.Swal.fire(
          'نجاح العمليه',
          'تمت الحذف بنجاح',
          'success'
        )
        this.$fetch()
      }).catch(() => {
        window.Swal.fire(
          'فشل العمليه',
          'خطأ اثناء الحذف',
          'error'
        )
      })
    }
  }
}
</script>
