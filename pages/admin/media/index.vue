<template>
  <v-row align="center" justify="center">
    <v-col
      cols="12"
      sm="12"
      lg="12"
      md="12"
    >
      <v-btn
        color="teal"
        outlined
        @click="$router.push('/admin/media/new')"
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
        <v-col cols="12" md="12">
          بحث
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="بحث ب كود الحصه"
            single-line
            hide-details
          /></v-text-field>
        </v-col>
        <!-- datatable -->
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
          <template v-slot:item.file_name="{ item }">
            {{ item.file_name }}
          </template>
          <template v-slot:item.stream_id="{ item }">
            {{ item.grade.grade_name }} - {{ item.subject.subject_name }} - {{ item.teacher.name }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status ? 'green' : 'red'" small dark>
              {{ item.status ? 'مفعل' : 'غير مدرج' }}
            </v-chip>
          </template>
          <template v-slot:item.thumb="{ item }">
            <v-img :src="item.thumb" thumbnail max-height="60px" width="60px" contain />
          </template>
          <template v-slot:item.options="{ item }">
            <v-btn
              class="ma-0"
              outlined
              color="teal"
              x-small
              icon
              fab
              @click="gotovideo(item.id)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <Play :item="item" @videoDeleted="listUser()" />
            <v-btn
              class="ma-0"
              outlined
              color="error"
              x-small
              icon
              fab
              @click="deleteVideo(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ showTime(item.created_at) }}
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
import moment from 'moment'
import { Play } from '~/components/Media/play'
export default {
  middleware: ['auth', 'verified', 'admin'],
  layout: 'admin',
  ssr: false,
  components: {
    Play
  },
  inject: ['theme'],
  data: () => ({
    loading: true,
    transition: 'scale-transition',
    tile: false,
    page: 1,
    search: '',
    itemsPerPage: 20,
    pageCount: 0,
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
      { text: 'إسم الملف', value: 'file_name' },
      { text: 'الفصل', value: 'stream_id' },
      { text: 'صوره', value: 'thumb' },
      { text: 'خصائص', value: 'options' },
      { text: 'مسجل منذ', value: 'created_at' },
      { text: 'الحاله', value: 'status' }
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
      this.page = 1
      this.listUser()
    },
    page () {
      this.listUser()
    },
    search () {
      this.listUser()
    },
    roleSelected () {
      this.page = 1
      this.listUser()
    }
  },
  mounted () {
    this.listUser()
    this.listRoles()
  },
  methods: {
    listUser () {
      let uri = 'v2/vod/admin/list?'
      uri += 'count=' + this.itemsPerPage
      uri += '&page=' + this.page
      if (this.search !== '' && this.search !== null) {
        uri += '&search=' + this.search
      }
      this.$api.get(uri).then((response) => {
        this.accounts = response.data
        this.page = response.data.current_page
        this.pageCount = response.data.last_page
        this.itemsPerPage = response.data.per_page
        this.loading = false
      })
    },
    showTime (time) {
      return moment(time).fromNow()
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
          this.$api.get('/v2/vod/delete/' + mediaId).then((response) => {
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
    playVideo (url) {
      window.open(url, '_blank')
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
