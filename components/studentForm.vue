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
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-text-field
                v-model="formdata.student_name"
                :rules="nameRules"
                label="إسم الطالب ثلاثي"
                required
                ></v-text-field>

                <v-text-field
                v-model="formdata.phone_number"
                :rules="phone"
                label="رقم واتساب ولي الآمر"
                required
                ></v-text-field>

                <v-select
                v-model="formdata.country"
                :items="genders"
                :item-text="text"
                :item-value="val"
                :rules="[v => !!v || 'النوع مطلوب']"
                label="النوع"
                required
                ></v-select>

                <v-select
                v-model="formdata.nationality"
                :items="nationalities"
                :rules="[v => !!v || 'الجنسيه مطلوبه']"
                label="الجنسيه"
                required
                ></v-select>

                <v-select
                v-model="formdata.country"
                :items="nationalities"
                :rules="[v => !!v || 'الدوله مطلوبه']"
                label="الدوله المتواجد بها الآن"
                required
                ></v-select>

                <v-text-field
                v-model="formdata.address"
                :rules="phone"
                label="رقم واتساب ولي الآمر"
                required
                ></v-text-field>

                <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
                >
                Validate
                </v-btn>

                <v-btn
                color="error"
                class="mr-4"
                @click="reset"
                >
                Reset Form
                </v-btn>

                <v-btn
                color="warning"
                @click="resetValidation"
                >
                Reset Validation
                </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
  export default {
    data: () => ({
      valid: true,
      name: '',
      formdata: {
          'student_name': '',
          'phone_number': '',
          'gender': '',
          'birth_date': '',
          'country': '',
          'grade_id': '',
          'path_id': '',
          'address': '',
          'nationality': ''
      },
      genders: [
          {text: "ذكر" , val: 'male'},
          {text: "انثى" , val: 'female'}
      ],
      nameRules: [
        v => !!v || 'اسم الطالب الثلاثي مطلوب',
      ],
      email: '',
      emailRules: [
        v => !!v || 'البريد الالكتروني مطلوب',
        v => /.+@.+\..+/.test(v) || 'البريد الإلكتروني غير صحيح',
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
      cannotRequest: false,
      error: {
        status: false,
        message: ''
      },
      success: {
        status: false,
        data: ''
      },
      checkbox: false,
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>
<style lang="css" scoped>

</style>
this.$emit('success')