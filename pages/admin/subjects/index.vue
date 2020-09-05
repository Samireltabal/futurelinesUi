<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="12" md="12" lg="12">
      <v-skeleton-loader
        :loading="loading"
        type="table-heading, table-thead, table-tbody, table-tfoot"
      >
        <v-row dense class="mt-2">
          <v-col cols="12" lg="3">
            <v-card height="100px">
              <v-card-subtitle>
                خصائص
              </v-card-subtitle>
              <v-card-text>
                <v-btn block color="success" class="black--white" @click.stop="dialog = true">
                  إضافة مادة جديده
                </v-btn>
                <v-dialog
                  v-model="dialog"
                  max-width="290"
                >
                  <v-card>
                    <v-card-title>
                      إضافة مادة جديده
                    </v-card-title>

                    <v-card-text>
                      <form>
                        <v-text-field
                          v-model="subject_name"
                          placeholder="إسم المادة"
                        />
                      </form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        color="green darken-1"
                        text
                        @click="resetAdd()"
                      >
                        إلغاء
                      </v-btn>

                      <v-btn
                        color="green darken-1"
                        text
                        @click="newSubject()"
                      >
                        إضافه
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card>
              <v-card-subtitle>
                <h2>عدد المواد</h2>
              </v-card-subtitle>
              <v-card-subtitle>
                <h3>{{ subjects.length }} مادة</h3>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card>
              <v-card-subtitle>
                <h2>عدد المدرسين</h2>
              </v-card-subtitle>
              <v-card-subtitle>
                <h3>{{ teachers.length }} مدرس</h3>
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="subjects"
          dense
          :options="tableoptions"
          class="elevation-1"
        >
          <template v-slot:item.teachers="{ item }">
            <span v-for="teacher in item.teachers" :key="teacher.id" style="display:block;" class="py-1">
              {{ teacher.name }} <v-btn x-small fab icon color="error" @click="detachSubfromTeacher(teacher.id, item.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </span>
          </template>
          <template v-slot:item.classes="{ item }">
            <span v-for="singleclass in item.classes" :key="singleclass.id" class="my-0" style="display:block;">
              {{ singleclass.room.room_name }}
            </span>
          </template>
          <template v-slot:item.options="{ item }">
            <v-menu
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ma-0"
                  outlined
                  color="teal"
                  small
                  icon
                  fab
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="teacher in teachers"
                  :key="teacher.id"
                  @click="attchSubtoTeacher(teacher.id, item.id)"
                >
                  <v-list-item-title>{{ teacher.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              class="ma-0"
              outlined
              color="error"
              small
              icon
              fab
              @click="deleteSubject(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'admin',
  ssr: false,
  async fetch () {
    await this.$api.get('/subjects').then((response) => {
      this.subjects = response.data
      this.loading = false
    })
  },
  data () {
    return {
      loading: true,
      dialog: false,
      subjects: {},
      title: 'Page Title',
      teachers: {},
      subject_name: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id'
        },
        { text: 'إسم المادة', value: 'subject_name' },
        { text: 'المدرسين', value: 'teachers' },
        { text: 'الفصول الدراسية', value: 'classes' },
        { text: 'الخيارات', value: 'options' }
      ],
      tableoptions: {
        itemsPerPage: 20
      }
    }
  },
  beforeMount () {
    this.fetchTeachers()
  },
  methods: {
    fetchTeachers () {
      this.$api.get('/admin/list/teachers').then((response) => {
        this.teachers = response.data
      })
    },
    newSubject () {
      this.$api.post('subjects/create', {
        subject_name: this.subject_name
      }).then(() => {
        this.$fetch()
        this.subject_name = ''
        this.dialog = false
      })
    },
    resetAdd () {
      this.subject_name = ''
      this.dialog = false
    },
    attchSubtoTeacher (teacherId, SubjectId) {
      this.$api.post('admin/teacher/subject/attach', {
        subject_id: SubjectId,
        teacher_id: teacherId
      }).then((response) => {
        this.$fetch()
        window.Swal.fire(
          'نجاح العملية',
          response.data.message,
          'success'
        )
      }).catch((error) => {
        this.$fetch()
        window.Swal.fire(
          'فشل في العملية',
          error.response.data.message,
          'error'
        )
      })
    },
    deleteSubject (subjectId) {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'لا يمكن إسترجاع البيانات بعد حذفها',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$api.get('/subjects/delete/' + subjectId).then((response) => {
            window.Swal.fire(
              'نجاح العمليه',
              'تم الحذف بنجاح',
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
      })
    },
    detachSubfromTeacher (teacherId, SubjectId) {
      this.$api.post('admin/teacher/subject/detach', {
        subject_id: SubjectId,
        teacher_id: teacherId
      }).then((response) => {
        this.$fetch()
        window.Swal.fire(
          'نجاح العملية',
          response.data.message,
          'success'
        )
      }).catch((error) => {
        this.$fetch()
        window.Swal.fire(
          'فشل في العملية',
          error.response.data.message,
          'error'
        )
      })
    }
  }
}
</script>
