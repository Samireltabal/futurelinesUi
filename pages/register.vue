<template>
  <v-row align="center" justify="center">
    <v-col>
      <!-- <v-alert type="success" transition="scroll-y-transition" prominent>
        التسجيل مغلق الأن .. سيتم فتح باب التسجيل قريباً
      </v-alert> -->
      <v-stepper v-model="e1" disabled>
        <v-overlay
          :absolute="true"
          :value="false"
          :opacity="0.8"
        />
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            تسجيل بيانات الدخول
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 2" step="2">
            تفعيل البريد الالكتروني
          </v-stepper-step>
          <v-divider />

          <v-stepper-step :complete="e1 > 3" step="3">
            تسجيل بيانات الطالب
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="4">
            تأكيد البيانات
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row align="center" justify="center">
              <v-col align="center" justify="center">
                <v-card class="elevation-0" width="800">
                  <v-toolbar
                    color="primary"
                    dark
                    flat
                  >
                    <v-toolbar-title>{{ $t('Sign Up') }}</v-toolbar-title>
                    <v-spacer />
                  </v-toolbar>
                  <v-card-text>
                    <v-alert v-if="error.status" type="error" transition="scroll-y-transition" prominent>
                      {{ $t(error.message.message) }}
                    </v-alert>
                    <v-alert v-if="success.status" type="success" transition="scroll-y-transition" prominent>
                      {{ success.data }}
                    </v-alert>
                    <authForm
                      :button-text="$t('Sign Up')"
                      :has-name="true"
                      :callback="register"
                      :errors="error"
                      :is-form="true"
                      @resetForm="clearData"
                    />
                    <v-overlay
                      :absolute="true"
                      :value="loading"
                      :opacity="0.8"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card
              class="mb-12"
              width="400"
            />
            <verification @verifySuccess="verificationDone" />
          </v-stepper-content>

          <v-stepper-content step="3">
            <studentForm @success="studentRegistered" />
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card
              class="mb-6"
            >
              <h3>نجاح التسجيل</h3>
              <div>
                <v-layout fluid>
                  <v-row class="text-center">
                    <v-col cols="12" sm="12">
                      <img
                        src="@/assets/images/logo.png"
                        alt="Futurelines.net"
                        class="mb-2"
                      >
                      <h4>تم التسجيل بنجاح</h4>
                      <p>سيتم إعلامكم في حالة وجود تحديثات على الموقع او على الجدول عن طريق البريد الإلكتروني</p>
                      <small>إدارة فيوتشر لاينز</small>
                    </v-col>
                  </v-row>
                </v-layout>
              </div>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>
<script>
import authForm from '@/components/Auth/authForm'
import verification from '@/components/Verification'
import studentForm from '@/components/studentForm'
export default {
  middleware ({ store, redirect }) {
    if (store.state.auth.loggedIn) {
      return redirect('/')
    }
  },
  components: {
    authForm,
    verification,
    studentForm
  },
  data () {
    return {
      error: {
        status: false,
        message: ''
      },
      success: {
        status: false,
        data: ''
      },
      loading: false,
      e1: 1,
      student: {}
    }
  },
  computed: {
    title () {
      return this.$t('logintitle')
    }
  },
  methods: {
    register (userInfo) {
      this.loading = true
      this.$api.post('auth/signup', userInfo).then((response) => {
        this.error = {
          status: false,
          message: ''
        }
        this.success = {
          status: true,
          data: 'تم التسجيل بنجاح ، برجاء متابعة الخطوات'
        }
        this.loading = false
        this.$auth.setUserToken(response.data.access_token)
        this.$api.setToken(response.data.access_token, 'Bearer')
        this.$auth.fetchUser().then(() => {
          this.e1 = 2
        })
        setTimeout(() => {
          this.success = {
            status: false,
            message: ''
          }
          this.loading = false
        }, 1000)
        this.el = 2
      }).catch((error) => {
        this.error = {
          status: true,
          message: error.response.data
        }
        this.loading = false
      })
    },
    studentRegistered (object) {
      this.e1 = this.e1 + 1
      this.student = object
    },
    verificationDone () {
      this.e1 = 3
    },
    clearData () {
      this.error = {
        status: false,
        message: ''
      }
    }
  },
  head () {
    return { title: this.title }
  }
}
</script>
