<template>
  <v-layout fluid>
    <v-row class="text-center">
      <v-col v-if="error.status" cols="12" sm="12">
        <v-alert type="error" prominent>
          <h3>{{ error.message }}</h3>
        </v-alert>
      </v-col>
      <v-col cols="12" sm="12">
        <v-alert v-if="success.status" type="success" transition="scroll-y-transition" prominent>
          {{ success.data }}
        </v-alert>
        <img
          src="@/assets/images/logo.png"
          alt="Futurelines.net"
          class="mb-2"
        >
        <h3>تسجيل بيانات الطالب</h3>
      </v-col>
      <v-col cols="12" sm="12">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="12" justify="center" align="center">
            <form
              ref="form"
              type=""
              lazy-validation
            >
              <v-text-field
                v-model="formdata.student_name"
                :rules="nameRules"
                label="إسم الطالب ثلاثي"
                required
              />

              <v-select
                v-model="formdata.grade_id"
                :items="grades"
                item-text="grade_name"
                item-value="id"
                :rules="[v => !!v || 'الصف الدراسي مطلوب']"
                label="الصف الدراسي"
                required
              />

              <v-select
                v-model="formdata.path_id"
                :items="pathes"
                item-text="path_name"
                item-value="id"
                :rules="[v => !!v || 'المسار مطلوب']"
                label="المسار التعليمي"
                required
              />

              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="formdata.birth_date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formdata.birth_date"
                    label="تاريخ ميلاد الطالب"
                    prepend-icon="mdi-calendar"
                    :rules="[v => !!v || 'تاريخ الميلاد مطلوب']"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="formdata.birth_date"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn text color="primary" @click="menu = false">
                    الغاء
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(formdata.birth_date)">
                    اختيار
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-select
                v-model="formdata.gender"
                :items="genders"
                item-text="text"
                item-value="val"
                :rules="[v => !!v || 'النوع مطلوب']"
                label="النوع"
                required
              />

              <v-select
                v-model="formdata.nationality"
                :items="nationalities"
                :rules="[v => !!v || 'الجنسيه مطلوبه']"
                label="الجنسيه"
                required
              />

              <v-select
                v-model="formdata.country"
                :items="nationalities"
                :rules="[v => !!v || 'الدوله مطلوبه']"
                label="الدوله المتواجد بها الآن"
                required
              />

              <v-text-field
                v-model="formdata.address"
                :rules="[v => !!v || 'العنوان مطلوب']"
                label="العنوان الحالي للطالب"
                required
              />
              <v-text-field
                v-model="formdata.phone_number"
                :rules="[v => !!v || 'رقم الواتساب مطلوب']"
                label="رقم واتساب ولي الآمر"
                required
              />
              <!-- <v-file-input
                v-model="file"
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="صورة الطالب"
                prepend-icon="mdi-camera"
                label="صورة الطالب"
              /> -->
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="submitForm"
              >
                إدخال البيانات
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
                حذف الجميع
              </v-btn>
            </form>
            <v-col v-if="stepper" class="mt-2">
              <v-btn
                color="grey lighten-3"
                class="mr-4"
                @click="refreshData"
              >
                تحديث البيانات
              </v-btn>

              <v-btn
                color="grey lighten-3"
                class="mr-4"
                @click="$router.push('/')"
              >
                تخطي التسجيل
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  props: {
    stepper: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    valid: true,
    name: '',
    file: null,
    menu: false,
    formdata: {
      student_name: '',
      phone_number: '',
      gender: '',
      birth_date: '',
      country: '',
      grade_id: '',
      path_id: '',
      address: '',
      nationality: ''
    },
    rules: [
      v => !!v || 'يجب الا يتجاوز حجم الصوره 2 ميجا'
    ],
    genders: [
      { text: 'ذكر', val: 'male' },
      { text: 'انثى', val: 'female' }
    ],
    nameRules: [
      v => !!v || 'اسم الطالب الثلاثي مطلوب'
    ],
    email: '',
    emailRules: [
      v => !!v || 'البريد الالكتروني مطلوب',
      v => /.+@.+\..+/.test(v) || 'البريد الإلكتروني غير صحيح'
    ],
    select: null,
    nationalities: [
      'مصر',
      'المملكه العربيه السعوديه',
      'الاردن',
      'سوريا',
      'العراق',
      'فلسطين',
      'لبنان',
      'الجزائر',
      'تونس',
      'المغرب',
      'ليبيا',
      'السودان',
      'موريتانيا',
      'الإمارات العربيه المتحده',
      'البحرين',
      'عمان',
      'قطر',
      'الكويت',
      'اليمن',
      'جيبوتي',
      'الصومال',
      'جزر القمر'
    ],
    isLoading: false,
    pathes: [],
    grades: [],
    cannotRequest: false,
    error: {
      status: false,
      message: ''
    },
    success: {
      status: false,
      data: ''
    },
    checkbox: false
  }),
  mounted () {
    this.getGrades()
    this.getPathes()
  },
  methods: {
    refreshData () {
      this.getGrades()
      this.getPathes()
    },
    submitForm () {
      // eslint-disable-next-line prefer-const
      let formbody = new FormData()
      // formbody.append('image', this.file)
      formbody.append('student_name', this.formdata.student_name)
      formbody.append('gender', this.formdata.gender)
      formbody.append('phone_number', this.formdata.phone_number)
      formbody.append('birth_date', this.formdata.birth_date)
      formbody.append('grade_id', this.formdata.grade_id)
      formbody.append('path_id', this.formdata.path_id)
      formbody.append('address', this.formdata.address)
      formbody.append('nationality', this.formdata.nationality)
      formbody.append('country', this.formdata.country)
      // console.log(formbody.entries)
      // this.$api.defaults.headers.common['content-type'] = 'multipart/form-data'
      // this.$api.setHeader('Content-type', 'multipart/form-data')
      this.$api.post('/students/new', formbody, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then((response) => {
        this.$emit('success', response.data)
      }).catch(() => {
        window.Swal.fire(
          'فشل العمليه',
          'برجاء مراجعة البيانات',
          'error'
        )
      })
    },
    getGrades () {
      this.$api.get('students/pathes').then((response) => {
        this.pathes = response.data
      })
    },
    getPathes () {
      this.$api.get('students/grades').then((response) => {
        this.grades = response.data
      })
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
<style lang="css" scoped>

</style>
