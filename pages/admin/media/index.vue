<template>
  <v-row align="center" justify="center">
    <v-col
      cols="12"
      sm="12"
      lg="12"
      md="12"
    >
        <v-btn 
            @click="$router.push('/admin/media/new')"
            color="teal"
            outlined
        >
            <v-icon>mdi-plus</v-icon> اضافه فيديو جديد
        </v-btn>
    </v-col>
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
          <template v-slot:item.thumbnail="{ item }">
            <v-img :src="item.thumbnail" thumbnail max-height="200px" contain/>
          </template>
          <template v-slot:item.options="{ item }">
            <v-btn
              class="ma-0"
              outlined
              color="teal"
              small
              icon
              fab
              @click="gotovideo(item.id)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="ma-0"
              outlined
              :color="item.active ? 'teal' : 'error'"
              small
              icon
              fab
              @click="activate(item.id)"
            >
              <v-icon>{{ item.active ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
            <v-btn
                  class="ma-0"
                  outlined
                  color="error"
                  small
                  icon
                  fab
                  @click="deleteVideo(item.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
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
      { text: 'العنوان', value: 'title' },
      { text: 'الوصف', value: 'content' },
      { text: 'صوره', value: 'thumbnail' },
      { text: 'خصائص', value: 'options' },
      { text: 'مسجل منذ', value: 'created_at' }
    ]
  }),

  mounted () {
    this.listUser()
    this.listRoles()
  },
  methods: {
    listUser () {
      this.$api.get('media/listadmin').then((response) => {
        this.accounts = response.data
        this.loading = false
      })
    },
    activate (mediaId) {
      window.Swal.fire({
        title: 'هل انت متأكد',
        text: 'تغيير حاله الفيديو',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'تغيير',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.value) {
          this.$api.get('/media/toggle/' + mediaId).then((response) => {
            window.Swal.fire(
              'نجاح العمليه',
              'تم التغيير بنجاح',
              'success'
            )
            this.listUser()
          }).catch(() => {
            window.Swal.fire(
              'فشل العمليه',
              'خطأ اثناء التعديل',
              'error'
            )
          })
        }
      })
    },
    deleteVideo (mediaId) {
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
          this.$api.get('/media/remove/' + mediaId).then((response) => {
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
