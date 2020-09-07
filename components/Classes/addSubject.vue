<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ma-0"
          outlined
          color="teal"
          small
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-school</v-icon> إضافة مادة للفصل
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          إضافة مادة للفصل
        </v-card-title>
        <v-card-text>
          <form>
            <v-select
              v-model="subject_id"
              :items="subjects"
              item-text="subject_name"
              item-value="id"
              label="المادة"
            />
            <v-select
              v-model="teacher_id"
              :items="teachers"
              item-text="name"
              item-value="id"
              label="المدرس"
            />
          </form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="addSubject()"
          >
            إضافة المادة
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    classData: {
      required: true,
      type: Object
    },
    subjects: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      subject_id: null,
      dialog: false,
      teacher_id: null,
      teachers: {}
    }
  },
  watch: {
    subject_id (val) {
      this.$api.get('/subjects/' + val + '/teachers').then((response) => {
        this.teachers = response.data
      })
    }
  },
  methods: {
    addSubject () {
      this.$api.post('classes/addSubject', {
        class_room_id: this.classData.id,
        subject_id: this.subject_id,
        teacher_id: this.teacher_id
      }).then(() => {
        this.dialog = false
        this.$emit('addSuccess')
        window.Swal.fire(
          'نجاح العمليه',
          'تمت التهيئة بنجاح',
          'success'
        )
      })
    }
  }
}
</script>
