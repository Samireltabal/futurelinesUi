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
                      :editor="editor"
                      v-model="vidObj.content"
                      :config="editorConfig"
                    />
                    <v-file-input 
                      label="اختيار الفيديو"
                    />
                    <v-switch
                      v-model="vidObj.active"
                      :label="`تفعيل الفيديو مباشراً : ${vidObj.active.toString()}`"
                    ></v-switch>
                    <v-btn @click="uploadVideo" block color="success">
                        <v-icon>mdi-plus</v-icon> إضافة الفيديو
                    </v-btn>
                </form>
              </v-card-text>
            <v-card-footer>
                <pre>{{ vidObj }}</pre>
            </v-card-footer>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import Vue from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use( CKEditor );
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'newMedia',
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
    uploadVideo() {
        window.Swal.fire(
            'Success',
            'success',
            'success'
        )
    }
  }
}
</script>
