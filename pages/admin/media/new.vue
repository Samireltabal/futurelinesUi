<template>
  <v-layout
    justify-center
    align-center
  >
    <v-row>
      <v-col cols="12" lg="12">
        <h2 class="grey--text text--darken-2 ma-4">
          {{ data.title }}
        </h2>
      </v-col>
      <v-col>
        <v-row>
          <v-col
            cols="12"
            lg="12"
            md="12"
            sm="12"
          >
            <v-card>
              <v-card-title>
                إضافة فيديو جديد
              </v-card-title>
              <v-card-text>
                <form @submit="uploadVideo">
                  <v-text-field
                    v-model="vidObj.title"
                    label="عنوان الفيديو"
                  />
                  <ckeditor
                    v-model="vidObj.content"
                    :editor="editor"
                    :config="editorConfig"
                    class="column"
                  />
                  <v-file-input
                    v-model="file"
                    label="اختيار الفيديو"
                  />
                  <v-switch
                    v-model="vidObj.active"
                    :label="`تفعيل الفيديو مباشراً : ${vidObj.active.toString()}`"
                  />
                  <v-btn block color="success" @click="uploadVideo">
                    <v-icon>mdi-plus</v-icon> إضافة الفيديو
                  </v-btn>
                </form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
Vue.use(CKEditor)

export default {
  name: 'NewMedia',
  layout: 'admin',
  data () {
    return {
      data: {},
      vidObj: {
        title: '',
        content: '',
        active: false
      },
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$auth.loggedIn
    }
  },
  methods: {
    uploadVideo () {
      const formbody = new FormData()
      formbody.append('video', this.file)
      formbody.append('title', this.vidObj.title)
      formbody.append('active', this.vidObj.active)
      formbody.append('content', this.vidObj.content)
      this.$api.post('/media/new', formbody, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(() => {
        window.Swal.fire(
          'Success',
          'success',
          'success'
        )
      }).catch(() => {
        window.Swal.fire(
          'فشل العمليه',
          'برجاء مراجعة البيانات',
          'error'
        )
      })
    }
  }
}
</script>
