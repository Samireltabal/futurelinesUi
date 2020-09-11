<template>
  <v-row align="center" justify="center">
    <v-col>
      <v-row>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-title>
              بيانات حساب : {{ user.name }}
            </v-card-title>
            <v-card-subtitle>
              البريد الإلكتروني : {{ user.email }}
            </v-card-subtitle>
            <v-card-subtitle>
              مسجل منذ : {{ user.registered }}
            </v-card-subtitle>
            <v-card-subtitle>
              الدور في المنصة : {{ user.role }}
            </v-card-subtitle>
            <v-card-subtitle>
              التفعيل : {{ user.verified ? "مفعل" : "غير مفعل" }}
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col v-if="user.role === 'student'" cols="12" md="3">
          <v-card>
            <v-card-title>
              بيانات الطالب
            </v-card-title>
            <v-card-text v-if="user.student.length">
              <h4>إسم الطالب : {{ user.student[0].student_name }}</h4>
              <h4>رقم التليفون : {{ user.student[0].phone_number }}</h4>
              <h4>العنوان : {{ user.student[0].address }}</h4>
              <h4>دولة السكن : {{ user.student[0].country }}</h4>
              <h4>الجنسية : {{ user.student[0].nationality }}</h4>
              <h4>الصف : {{ user.student[0].grade.grade_name }}</h4>
              <h4>المسار : {{ user.student[0].path.path_name }}</h4>
            </v-card-text>
            <v-card-text v-else>
              <h4>لا يوجد بيانات مسجلة للطالب</h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="user.role === 'teacher'" cols="12" md="3">
          Teacher Panel
        </v-col>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-title>
              تغيير كلمة المرور
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="password" type="password" label="كلمة المرور الجديدة" hint="يجب ان تكون 8 حروف \ ارقام او اكثر"/>
              <v-text-field v-model="password_confirmation" type="password" label="تأكيد كلمة المرور الجديدة" />
            </v-card-text>
            <v-card-action>
              <v-btn color="success" block @click="changePassword">
                تغيير كلمة المرور
              </v-btn>
            </v-card-action>
          </v-card>
        </v-col>
        <v-col v-if="user.role === 'student'" cols="12" md="3">
          <v-card>
            <v-card-title>
              بيانات الدفع
            </v-card-title>
            <v-card-text v-if="user.student.length">
              <h4> حالة الدفع : {{ user.student[0].paid ? "تم الدفع" : "لا يوجد دفع" }} </h4>
              <h4> اخر تاريخ للدفع : {{ user.student[0].paid_at ? user.student[0].paid_at : 'لا يوجد' }} </h4>
            </v-card-text>
            <v-card-text v-else>
              <h4>لا يوجد بيانات مسجلة للطالب</h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'admin',
  async validate ({ params, $api, redirect }) {
    return await $api.get('v2/admin/accounts/show/' + params.id).then((response) => {
      return true
    }).catch((error) => {
      return redirect('/notauthorised', { message: error.response.data })
    })
  },
  async fetch () {
    await this.$api.get('v2/admin/accounts/show/' + this.$route.params.id).then((response) => {
      this.user = response.data
    })
  },
  data () {
    return {
      user: {},
      password: '',
      password_confirmation: ''
    }
  },
  methods: {
    changePassword () {
      const data = {
        user_id: this.user.id,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      this.$api.post('v2/admin/accounts/password', data).then((response) => {
        this.password = ''
        this.password_confirmation = ''
        this.$fetch()
        window.Swal.fire(
          'تم التغيير بنجاح',
          'تم تغيير كلمة المرور بنجاح',
          'success'
        )
      }).catch(() => {
        window.Swal.fire(
          'فشل العملية',
          'خطأ اثناء تغيير كلمة المرور',
          'error'
        )
      })
    }
  }
}
</script>
