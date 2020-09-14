<template>
  <v-dialog
    v-model="dialog"
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
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ item.teacher.name + ' - ' + item.subject.subject_name + ' - ' + item.grade.grade_name }}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <video ref="myvideo" :src="item.video" playinline controls />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="title" placeholder="عنوان الفيديو" />
            <v-textarea v-model="description" placeholder="وصف الفيديو" />
            <v-checkbox v-model="status" label="تفعيل الفيديو" />
            <v-btn block color="success" @click="submitEdit()">
              تعديل و نشر
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="StopandClose()"
        >
          غلق الفيديو
        </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          @click="deleteVideo(item.id)"
        >
          <v-icon>mdi-delete</v-icon> حذف الفيديو
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'Play',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      title: '',
      description: '',
      status: false
    }
  },
  mounted () {
    this.title = this.item.title
    this.description = this.item.description
    this.status = this.item.status
  },
  methods: {
    StopandClose () {
      this.$refs.myvideo.pause()
      this.dialog = false
    },
    submitEdit () {
      const data = {
        id: this.item.id,
        title: this.title,
        description: this.description,
        status: this.status
      }
      this.$api.post('v2/vod/update', data).then(() => {
        this.dialog = false
        this.$emit('videoDeleted')
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
            this.dialog = false
            this.$emit('videoDeleted')
          }).catch(() => {
            window.Swal.fire(
              'فشل العمليه',
              'خطأ اثناء الحذف',
              'error'
            )
          })
        }
      })
    }
  }
}
</script>
