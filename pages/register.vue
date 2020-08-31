<template>
  <v-row align="center" justify="center">
    <v-col>
      <v-alert type="success" transition="scroll-y-transition" prominent>
        التسجيل مغلق الأن .. سيتم فتح باب التسجيل قريباً
      </v-alert>
      <v-stepper v-model="e1" disabled>
        <v-overlay
          :absolute="true"
          :value="true"
          :opacity="0.8"
        />
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            تسجيل بيانات الدخول
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 2" step="2">
            تسجيل بيانات الطالب
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="3">
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
              color="grey lighten-1"
              height="200px"
            />

            <v-btn
              color="primary"
              @click="e1 = 3"
            >
              Continue
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card
              class="mb-12"
              color="grey lighten-1"
              height="200px"
            />

            <v-btn
              color="primary"
              @click="e1 = 1"
            >
              Continue
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>
<script>
import authForm from '@/components/Auth/authForm'
export default {
  middleware ({ store, redirect }) {
    if (store.state.auth.loggedIn) {
      return redirect('/')
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    authForm
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
      e1: 1
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
          data: response.data.message
        }
        this.loading = false
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
