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
      <v-card width="680">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            nuxt
            block
            large
            to="/register"
          >
            بدأ التسجيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'Home',
  asyncData ({ $api }) {
    return $api.$get('ping').then((response) => {
      return { data: response }
    }).catch(() => {
      return { data: 'network error' }
    })
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    api () {
      return process.env.API_BASE
    }
  },
  methods: {
    changeLocale () {
      if (this.$vuetify.rtl) {
        this.$vuetify.rtl = false
        this.$i18n.locale === 'en' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'en'
        this.$store.dispatch('locale/set_locale', 'en')
      } else {
        this.$vuetify.rtl = true
        this.$i18n.locale === 'ar' ? this.$i18n.locale = 'ar' : this.$i18n.locale = 'ar'
        this.$store.dispatch('locale/set_locale', 'ar')
      }
    },
    ping () {
      this.$api.get('ping').then((response) => {
        this.data = response.data
      })
    }
  }
}
</script>
