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
          title: 'Home',
          to: '/',
          type: 'link',
          hasChild: false
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
          type: 'link',
          hasChild: false
        },
        {
          title: 'User Controls',
          type: 'header',
          hasChild: false
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Accounts',
          to: '/inspire',
          type: 'parent',
          hasChild: true,
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
            },
            {
              icon: 'mdi-account-plus',
              title: 'Register',
              type: 'link',
              to: '/register'
            }
          ]
        },
        {
          icon: 'mdi-lock',
          title: 'Verified',
          type: 'link',
          to: '/verified/'
        },
        {
          icon: 'mdi-account',
          title: 'Admin',
          type: 'link',
          to: '/admin/'
        },
        {
          icon: 'mdi-account',
          title: 'Employee',
          type: 'link',
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
