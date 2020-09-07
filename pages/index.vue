<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
        <img src="@/assets/images/logo.png">
      </div>
      <v-card v-if="!completed && loggedIn" width="680" class="mt-4">
        <v-card-title>
          <h2>
            لا يوجد ملف طالب مربوط بالحساب
          </h2>
        </v-card-title>
        <v-card-text>
          <h4>برجاء تسجيل بيانات الطالب</h4>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            nuxt
            block
            :disabled="completed"
            large
            to="/account/student"
          >
            تسجيل الطالب
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="$auth.loggedIn && $auth.user.verified && $auth.user.student.length" class="mt-4">
        <v-card-text>
          <h4>لقد اكملت كل الخطوات بنجاح</h4>
          <p>
            الطالب <span class="red--text text-decoration-underline">{{ $auth.user.student[0].student_name }}</span> في الصف <span class="red--text text-decoration-underline">{{ $auth.user.student[0].grade.grade_name }}</span> في مسار <span class="red--text text-decoration-underline">{{ $auth.user.student[0].path.path_name }}</span> مسجل لدينا بالفعل
          </p>
          <p>
            سيتم إعلامك عن طريق البريد الإلكتروني عند وجود تحديثات في الموقع
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn block large color="purple" class="white--text" @click="$router.push('/timetable')">
            جدول الدراسة
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="!loggedIn" width="680" class="mt-4">
        <v-card-title>
          <h2>
            مدرسة فيوتشر لاينز
          </h2>
        </v-card-title>
        <v-card-text>
          <h3>
            تعلن إدارة فيوتشر لاينز عن فتح باب تسجيل الطلبه
          </h3>
          <h4>برجاء إتباع خطوات التسجيل عن طريق الرابط التالي .. كل طالب يجب ان يمتلك حساب بريد إلكتروني مفعل لإستقبال رسالة التأكيد و الجدول الخاص بالدراسه</h4>
          <h1 class="my-6 red--text">
            إرشادات
          </h1>
          <p>
            <ul>
              <li>في حالة ظهور رسالة هذا البريد الإلكتروني مسجل بالفعل : برجاء إستخدام صفحة تسجيل الدخول لإكمال تسجيل الطالب</li>
              <li>تفعيل البريد الإلكتروني غير ضروري لتسجيل الطالب و لكن يجب إستخدام بريد صحيح اثناء الدراسة</li>
              <li>في حالة عدم وصول رسالة التفعيل .. برجاء مراجعه البريد سبام او جانك ميل</li>
            </ul>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            nuxt
            class="mx-5 px-5"
            large
            to="/register"
          >
            طالب جديد
          </v-btn>
          <v-btn
            color="success"
            nuxt
            large
            class="mx-5 px-5"
            to="/login"
          >
            تسجيل دخول
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="$auth.loggedIn && !$auth.user.verified" width="680" class="mt-4">
        <v-card-title>
          <h2>
            حسابك غير مفعل
          </h2>
        </v-card-title>
        <v-card-text>
          <h4>برجاء تفعيل الحساب حتى تتمكن من تسجيل الطالب</h4>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            nuxt
            block
            large
            to="/account/verify"
          >
            تفعيل الحساب
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      data: {}
    }
  },
  computed: {
    api () {
      return process.env.API_BASE
    },
    loggedIn () {
      return this.$auth.loggedIn
    },
    completed () {
      if (this.$auth.loggedIn && this.$auth.user.student.length) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ping () {
      this.$api.get('ping').then((response) => {
        this.data = response.data
      })
    }
  }
}
</script>
