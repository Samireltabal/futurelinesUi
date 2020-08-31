<template>
  <client-only>
    <mobile v-if="isMobile" :items="items" />
    <web v-else :items="items" />
  </client-only>
</template>
<script>
import mobile from './nav/mobile'
import web from './nav/web'
export default {
  name: 'Navbar',
  components: {
    mobile,
    web
  },
  data () {
    return {
      items: [
        {
          icon: 'mdi-apps',
          title: 'الرئيسية',
          to: '/',
          visibleTo: 'all',
          type: 'link',
          hasChild: false
        },
        {
          icon: 'mdi-account-plus',
          title: 'التسجيل',
          to: '/register',
          visibleTo: 'all',
          type: 'link',
          hasChild: false
        },
        {
          icon: 'mdi-school',
          title: 'عن المدرسة',
          to: '/about',
          visibleTo: 'all',
          type: 'link',
          hasChild: false,
          children: [
            {
              icon: 'mdi-login',
              title: 'Login',
              to: '/login',
              type: 'parent',
              hasChild: true,
              children: [
                {
                  icon: 'mdi-login',
                  title: 'Login',
                  type: 'link',
                  to: '/login'
                },
                {
                  icon: 'mdi-account-plus',
                  title: 'Register',
                  type: 'link',
                  to: '/register'
                }
              ]
            }
          ]
        },
        {
          icon: 'mdi-email-plus',
          title: 'إتصل بنا',
          type: 'link',
          visibleTo: 'all',
          to: '/contact'
        },
        {
          icon: 'mdi-account',
          title: 'Admin',
          type: 'link',
          visibleTo: 'admin',
          to: '/admin/'
        },
        {
          icon: 'mdi-account',
          title: 'Employee',
          type: 'link',
          visibleTo: 'admin',
          to: '/employee/'
        }
      ]
    }
  },
  computed: {
    isMobile () {
      if (this.$device.isDesktop) {
        return false
      } else if (this.$device.isMobileOrTablet) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
