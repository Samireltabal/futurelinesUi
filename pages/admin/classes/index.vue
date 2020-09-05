<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="12" md="12" lg="12">
      <v-skeleton-loader
        :loading="loading"
        type="table-heading, table-thead, table-tbody, table-tfoot"
      >
        <v-data-table
          :headers="headers"
          :items="subjects"
          dense
          :options="tableoptions"
          class="elevation-1"
        >
          <template v-slot:item.classes="{ item }">
            <span v-for="singleClass in item.classes" :key="singleClass.id" style="display:block;" class="py-1">
              <span>
                {{ singleClass.subject.subject_name }} - {{ singleClass.teacher.name }} <v-btn x-small fab icon color="error" @click="detachSubfromTeacher(singleClass.id)"><v-icon>mdi-delete</v-icon></v-btn></span>
            </span>
          </template>
          <template v-slot:item.options="{ item }">
            <AddSubject :class-data="item" :subjects="subjectsObj" @addSuccess="$fetch" />
          </template>
        </v-data-table>
        <v-row dense class="mt-2">
          <v-col cols="12" lg="3">
            <v-card>
              <v-card-subtitle>
                <h2>تهيئة الفصول</h2>
              </v-card-subtitle>
              <v-card-text>
                <v-btn block color="warning" class="black--text" @click="generateClasses()">
                  تهيئة الفصول
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card>
              <v-card-subtitle>
                <h2>عدد الفصول</h2>
              </v-card-subtitle>
              <v-card-subtitle>
                <h3>{{ subjects.length }} فصل</h3>
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card>
              <v-card-subtitle>
                <h2>تسكين الطلاب</h2>
              </v-card-subtitle>
              <v-card-text>
                <v-btn block color="warning" class="black--text" @click="housing()">
                  تسكين الطلاب في الفصول
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3" />
        </v-row>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
import { AddSubject } from '@/components/Classes/addSubject'
export default {
  layout: 'admin',
  ssr: false,
  components: {
    AddSubject
  },
  async fetch () {
    await this.$api.get('/classes').then((response) => {
      this.subjects = response.data
      this.loading = false
    })
    await this.$api.get('/subjects').then((response) => {
      this.subjectsObj = response.data
    })
  },
  data () {
    return {
      loading: true,
      subjects: {},
      subjectsObj: {},
      title: 'Page Title',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id'
        },
        { text: 'إسم الفصل', value: 'room_name' },
        { text: 'الطلبة', value: 'students.length' },
        { text: 'المواد', value: 'classes' },
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
    generateClasses () {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'سيتم حذف البيانات القديمة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$api.get('classes/generate').then(() => {
            window.Swal.fire(
              'نجاح العمليه',
              'تمت التهيئة بنجاح',
              'success'
            )
            this.$fetch()
          }).catch(() => {
            window.Swal.fire(
              'فشل العمليه',
              'خطأ اثناء التهيئة',
              'error'
            )
          })
        }
      })
    },
    housing () {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'لا يمكن إسترجاع البيانات بعد التسكين',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'تسكين',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$api.get('classes/studenthousing').then(() => {
            window.Swal.fire(
              'نجاح العمليه',
              'تمت التهيئة بنجاح',
              'success'
            )
            this.$fetch()
          }).catch(() => {
            window.Swal.fire(
              'فشل العمليه',
              'خطأ اثناء التهيئة',
              'error'
            )
          })
        }
      })
    },
    fetchTeachers () {
      this.$api.get('/admin/list/teachers').then((response) => {
        this.teachers = response.data
      })
    },
    attchSubtoTeacher (teacherId, classId, SubjectId) {
      this.$api.post('classes/addSubject', {
        class_room_id: classId,
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
    detachSubfromTeacher (id) {
      this.$api.post('classes/removeSubject', {
        id
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
