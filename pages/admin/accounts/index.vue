<template>
  <v-row align="center" justify="center">
    <v-container>
      <v-row dense>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد المسجلين</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3>{{ stats.users }} حساب</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد المديرين</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3>{{ stats.admins }} حساب</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد المدرسين</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3>{{ stats.teachers }} مدرس</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد الطلبه</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3><span class="green--text">{{ stats.registered }}</span> / <span class="red--text">{{ stats.students }}</span> طالب</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-col
      cols="12"
      sm="12"
      lg="12"
      md="12"
    >
      <v-skeleton-loader
        :loading="loading"
        type="table-heading, table-thead, table-tbody, table-tfoot"
      >
        <!-- datatable -->
        <v-data-table
          :headers="headers"
          :items="accounts"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.verified="{ item }">
            <v-chip :color="item.verified ? 'green' : 'red'" small dark>
              {{ item.verified ? 'YES' : 'NO' }}
            </v-chip>
          </template>
          <template v-slot:item.role="{ item }">
            <v-chip
              v-for="(role, index) in item.roles"
              :key="index"
              close
              small
              color="teal"
              text-color="white"
              @click:close="revoke(item.id, role.name)"
            >
              {{ role.name }}
            </v-chip>
          </template>
          <template v-slot:item.student="{ item }">
            <span v-for="(value, key) in item.student" :key="key">
              <v-avatar
                size="42px"
              >
                <img :src="value.photo" :alt="value.student_name">
              </v-avatar> <small v-if="value != null">
                {{ value.id }} - {{ value.student_name }} - {{ value.grade.grade_name }} - {{ value.path.path_name }} </small>
              <v-btn
                v-if="item.student.length > 1"
                fab
                small
                icon
                color="teal"
                @click="deleteStudent(value.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn><br>
            </span>
          </template>
          <template v-slot:item.nationality="{ item }">
            <span v-for="(value, key) in item.student" :key="key">
              <small v-if="value != null">{{ value.nationality }}</small><br>
            </span>
          </template>
          <template v-slot:item.phone="{ item }">
            <span v-for="(value, key) in item.student" :key="key">
              <small v-if="value != null">{{ value.phone_number }}</small><br>
            </span>
          </template>
          <template v-slot:item.options="{ item }">
            <v-btn
              class="ma-0"
              outlined
              color="teal"
              small
              icon
              disabled
              fab
              @click="handle(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="ma-0"
              outlined
              :color="item.verified ? 'teal' : 'error'"
              small
              :disabled="item.verified"
              icon
              fab
              @click="verifyMail(item.id)"
            >
              <v-icon>mdi-email-check</v-icon>
            </v-btn>
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
                  <v-icon>mdi-database</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(role, index) in roles"
                  :key="index"
                  @click="attachRole(item.id, role.name)"
                >
                  <v-list-item-title>{{ role.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
        <!-- end datatable -->
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
export default {
  middleware: ['auth', 'verified', 'admin'],
  layout: 'admin',
  ssr: false,
  inject: ['theme'],
  data: () => ({
    loading: true,
    transition: 'scale-transition',
    tile: false,
    type: 'list-item-avatar-three-line',
    types: [],
    accounts: {},
    roles: {},
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id'
      },
      { text: 'الاسم', value: 'name' },
      { text: 'البريد الإلكتروني', value: 'email' },
      { text: 'Role', value: 'role' },
      { text: 'إسم الطالب', value: 'student' },
      { text: 'الجنسية', value: 'nationality' },
      { text: 'رقم التليفون', value: 'phone' },
      { text: 'Options', value: 'options' },
      { text: 'مسجل منذ', value: 'registered' },
      { text: 'مفعل', value: 'verified' }
    ],
    stats: {},
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%'
      }
    ]
  }),

  mounted () {
    this.listUser()
    this.listRoles()
  },
  methods: {
    listUser () {
      this.$api.get('admin/users').then((response) => {
        this.accounts = response.data
        this.loading = false
      })
      this.$api.get('students/stats').then((response) => {
        this.stats = response.data
      })
    },
    verifyMail (userId) {
      this.$api.post('/admin/user/verify', { userId }).then(() => {
        this.$toast.success('تم تفعيل البريد الإلكتروني')
        this.listUser()
      })
    },
    deleteStudent (studentId) {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'لا يمكن إسترجاع بيانات الطالب بعد حذفها',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$api.post('/admin/student/delete', { studentId }).then((response) => {
            window.Swal.fire(
              'نجاح العمليه',
              'تم الحذف بنجاح',
              'success'
            )
            this.listUser()
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
    poke (id) {
      const data = {
        user_id: id
      }
      this.$api.post('pokes/poke', data).then(() => {
        this.listUser()
      })
    },
    attachRole (user, role) {
      const data = {
        user_id: user,
        role
      }
      this.$api.post('roles/grant', data).then(() => {
        this.$toast.success('Action completed')
        this.listUser()
      })
    },
    revoke (user, role) {
      const data = {
        user_id: user,
        role
      }
      this.$api.post('roles/revoke', data).then(() => {
        this.$toast.success('Action completed')
        this.listUser()
      })
    },
    unpoke (id) {
      const data = {
        user_id: id
      }
      this.$api.post('pokes/unpoke', data).then(() => {
        this.listUser()
      })
    },
    listRoles () {
      this.$api.get('roles').then((response) => {
        this.roles = response.data
      })
    },
    handleServiceLogo (name) {
      return 'mdi-' + name
    }
  }
}
</script>
