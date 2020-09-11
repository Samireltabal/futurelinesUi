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
              <h3>{{ accounts.total_accounts }} حساب</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد المديرين</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3>{{ accounts.admins }} حساب</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد المدرسين</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3>{{ accounts.teachers }} مدرس</h3>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card>
            <v-card-subtitle>
              <h2>عدد الطلبه</h2>
            </v-card-subtitle>
            <v-card-subtitle>
              <h3><span class="green--text">{{ accounts.registered }}</span> / <span class="red--text">{{ accounts.students }}</span> طالب</h3>
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
        <v-row>
          <v-col>
            <v-checkbox v-model="filters" label="عرض الخيارات" />
          </v-col>
        </v-row>
        <v-row v-if="filters">
          <v-col cols="12" md="6">
            بحث
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="بحث بالإسم او بالبريد الإلكتروني"
              single-line
              hide-details
            /></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-radio-group v-model="roleSelected">
              <template v-slot:label>
                <div><strong>الخيارات</strong></div>
              </template>
              <v-radio value="student">
                <template v-slot:label>
                  <div>عرض <strong class="success--text">الطلبه فقط</strong></div>
                </template>
              </v-radio>
              <v-radio value="teacher">
                <template v-slot:label>
                  <div>عرض <strong class="primary--text">المدرسين فقط</strong></div>
                </template>
              </v-radio>
              <v-radio value="admin">
                <template v-slot:label>
                  <div>عرض <strong class="primary--text">الادارة فقط</strong></div>
                </template>
              </v-radio>
              <v-radio :value="null">
                <template v-slot:label>
                  <div>عرض <strong class="primary--text">الكل</strong></div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="accounts.data"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          dense
          hide-default-footer
          :search="search"
          class="elevation-1"
          @page-count="pageCount = $event"
        >
          <template v-slot:item.verified="{ item }">
            <v-chip :color="item.verified ? 'green' : 'red'" small dark>
              {{ item.verified ? 'YES' : 'NO' }}
            </v-chip>
            <v-btn
              class="ma-0"
              outlined
              x-small
              icon
              fab
              @click="$router.push('/admin/accounts/show/' + item.id)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
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
                v-if="item.student.length"
                fab
                small
                icon
                color="error"
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
          <template v-slot:item.paid_at="{ item }">
            <span v-for="(value, key) in item.student" :key="key">
              <small v-if="value != null">{{ value.paid_at }}</small><br>
            </span>
          </template>
          <template v-slot:item.options="{ item }">
            <v-btn
              class="ma-0"
              outlined
              color="teal"
              x-small
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
              x-small
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
                  x-small
                  icon
                  fab
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon xs>
                    mdi-database
                  </v-icon>
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
            <v-btn
              v-if="item.student.length"
              class="ma-0"
              outlined
              :color="item.student[0].paid ? 'teal' : 'error'"
              x-small
              icon
              fab
              @click="markAsPaid(item.id)"
            >
              <v-icon>mdi-currency-usd</v-icon>
            </v-btn>
            <v-btn
              class="ma-0"
              outlined
              color="error"
              x-small
              icon
              fab
              @click="deleteAccount(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount" />
          <v-select
            v-model="itemsPerPage"
            item-text="text"
            item-value="value"
            :items="selectOptions"
            label="عدد النتائج المعروضه"
          />
        </div>
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
    search: '',
    page: 1,
    itemsPerPage: 10,
    pageCount: 0,
    type: 'list-item-avatar-three-line',
    types: [],
    filters: false,
    accounts: {},
    roles: {},
    roleSelected: [],
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
      { text: 'تاريخ الدفع', value: 'paid_at' },
      { text: 'مسجل منذ', value: 'registered' },
      { text: 'مفعل', value: 'verified' }
    ]
  }),
  computed: {
    selectOptions () {
      return [
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: '50', value: 50 },
        { text: 'كل النتائج', value: this.accounts.total_accounts }
      ]
    }
  },
  watch: {
    itemsPerPage () {
      this.listUser()
    },
    page () {
      this.listUser()
    },
    search () {
      this.listUser()
    },
    roleSelected () {
      this.listUser()
    }
  },

  mounted () {
    this.listUser()
    this.listRoles()
  },
  methods: {
    listUser () {
      let uri = 'v2/admin/accounts/list?'
      uri += 'count=' + this.itemsPerPage
      uri += '&page=' + this.page
      if (this.search !== '' && this.search !== null) {
        uri += '&search=' + this.search
      }
      if (this.roleSelected.length) {
        uri += '&role=' + this.roleSelected
      }
      this.$api.get(uri).then((response) => {
        this.accounts = response.data
        this.page = response.data.current_page
        this.pageCount = response.data.last_page
        this.itemsPerPage = response.data.per_page
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
    markAsPaid (userId) {
      this.$api.get('/students/markaspaid/' + userId).then((response) => {
        this.$toast.success(response.data.message)
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
    deleteAccount (studentId) {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'لا يمكن إسترجاع بيانات الحساب بعد حذفها',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'إحذف',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$api.get('v2/admin/accounts/delete/' + studentId).then((response) => {
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
    listRoles () {
      this.$api.get('roles').then((response) => {
        this.roles = response.data
      })
    }
  }
}
</script>
