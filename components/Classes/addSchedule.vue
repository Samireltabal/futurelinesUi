<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="red lighten-2"
        dark
        v-bind="attrs"
        v-on="on"
      >
        إضافه موعد
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="grey lighten-2">
        {{ singleClass.subject.subject_name }}
      </v-card-title>
      <v-card-text>
        <form>
          <v-time-picker
            v-model="start_at"
            landscape
            :allowed-hours="[13,14,15,16,17]"
            :allowed-minutes="[5,10,15,20,25,30,35,40,45,50,55,0]"
          />
          <v-select
            v-model="weekday_id"
            :items="days"
            item-text="name"
            item-value="id"
          />
          <v-text-field v-model="duration" type="number" value="40" />
        </form>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          large
          @click="addSched"
        >
          إضافه
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'AddSchedule',
  props: {
    singleClass: {
      type: Object,
      required: true
    }
  },
  async fetch () {
    await this.$api.get('schedules/days').then((response) => {
      this.days = response.data
    })
  },
  data () {
    return {
      start_at: '13:00',
      weekday_id: null,
      days: {},
      duration: 40,
      dialog: false
    }
  },
  methods: {
    addSched () {
      const data = {
        weekday_id: this.weekday_id,
        single_class_id: this.singleClass.id,
        start_at: this.start_at,
        duration: this.duration,
        class_room_id: this.singleClass.room.id
      }
      this.$api.post('schedules/create', data).then(() => {
        window.Swal.fire(
          'نجاح العمليه',
          'تمت الإضافه بنجاح',
          'success'
        )
        this.dialog = false
        this.$emit('scheduleAdded')
      })
    }
  }
}
</script>
