<template>
  <div class="col-lg-12  elevation-0">
    <!-- <h3>{{ buttonText }}</h3> -->
    <div class="theme-card">
      <v-form @submit.prevent="callback(userInfo)">
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-if="hasName"
                id="name"
                v-model="userInfo.name"
                type="text"
                class="py-0"
                :error-messages="validate('name') ? errors.message.errors['name'] : ''"
                :error="validate('name')"
                :placeholder="$t('Name')"
                name="name"
              />
              <v-text-field
                id="email"
                v-model="userInfo.email"
                type="text"
                class="py-0"
                :error-messages="validate('email') ? errors.message.errors['email'] : ''"
                :error="validate('email')"
                :placeholder="$t('Email')"
                name="email"
              />
              <v-text-field
                v-if="hasName"
                id="phone"
                v-model="userInfo.phone"
                type="text"
                class="py-0"
                :error-messages="validate('phone') ? errors.message.errors['phone'] : ''"
                :error="validate('phone')"
                :placeholder="$t('Phone')"
                name="phone"
              />
            </v-col>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                id="password"
                v-model="userInfo.password"
                type="password"
                class="py-0"
                :error-messages="validate('password') ? errors.message.errors['password'] : ''"
                :error="validate('password')"
                :placeholder="$t('Password')"
                autocomplete
                name="password"
              />
              <v-text-field
                v-if="hasName"
                id="password_confirmation"
                v-model="userInfo.password_confirmation"
                type="password"
                class="py-0"
                :placeholder="$t('Password Confirmation')"
                autocomplete
                name="password_confirmation"
              />
            </v-col>
            <v-col v-if="!hasName">
              <v-checkbox
                v-model="userInfo.remember"
                :label="$t('Remember Me')"
              />
            </v-col>
            <v-btn
              type="submit"
              class="btn btn-solid"
              color="primary"
              block
            >
              {{ buttonText }}
            </v-btn>
            <v-btn
              v-if="hasName"
              class="btn btn-solid mt-2"
              color="error"
              block
              @click="resetForm"
            >
              {{ $t('Reset') }}
            </v-btn>
            <v-row v-if="!isForm" class="my-0">
              <v-col>
                <nuxt-link
                  class="text-decoration-none text-center"
                  color="primary"
                  :to="hasName ? '/login' : '/register'"
                >
                  {{ hasName ? $t('Already have account ?') : $t('Create new account') }}
                </nuxt-link>
                <nuxt-link
                  v-if="!hasName"
                  class="text-decoration-none text-center mx-4"
                  color="primary"
                  to="/restore"
                >
                  إستعادة كلمة المرور
                </nuxt-link>
              </v-col>
            </v-row>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    callback: {
      type: Function,
      required: true
    },
    hasName: {
      type: Boolean,
      default: false
    },
    isForm: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      required: true
    },
    errors: {
      type: Object,
      default: null
    }
  },
  middleware: 'guest',
  data () {
    return {
      userInfo: {
        name: '',
        remember: 0,
        phone: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    validate (key) {
      if (this.hasName && this.errors.status) {
        return Object.keys(this.errors.message.errors).includes(key)
      } else {
        return false
      }
    },
    resetForm () {
      this.userInfo = {
        name: null,
        email: null,
        password: null,
        password_confirmation: null
      }
      this.$emit('resetForm')
    }
  }
}
</script>
