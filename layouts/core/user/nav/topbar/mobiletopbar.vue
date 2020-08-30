<template>
  <v-app-bar
    :clipped-left="false"
    hide-on-scroll
    elevation="0"
    flat
    tile
    color="#fff"
    app
  >
    <v-app-bar-nav-icon @click.stop="$emit('drawerClicked')" />
    <v-spacer />
    <img src="@/assets/images/logo.png" :alt="appName" class="mt-3 ml-2" style="max-height:40px; width:auto;">
  </v-app-bar>
</template>
<script>

import moment from 'moment'
export default {
  name: 'MobileTopBar',
  directives: {
    time: {
      bind (el, value) {
        const unparsedDate = new Date(value.value)
        const date = moment(unparsedDate.toISOString()).fromNow() // here u modify data
        el.textContent = date // and set to the view
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.loggedIn
    },
    appName () {
      return process.env.APPLICATION_NAME || 'syncit'
    },
    lang () {
      return this.$store.state.locale.locale
    },
    wsConnected () {
      if (this.$mqtt) {
        if (this.$mqtt.connected) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    notifications () {
      if (this.$auth.loggedIn) {
        return this.$auth.user.unread_notifications
      } else {
        return 0
      }
    },
    newNotificationsCount () {
      if (this.$auth.loggedIn) {
        return this.$auth.user.UnreadNotificationsCount
      } else {
        return 0
      }
    }
  },
  watch: {
    lang: {
      handler: 'changeLang',
      immediate: true
    }
  },
  methods: {
    markAsRead () {
      if (this.$auth.loggedIn) {
        if (this.$auth.user.UnreadNotificationsCount) {
          this.$api.get('/auth/markNotificationsAsRead').then(() => {
            this.$auth.fetchUser()
          })
        }
      }
    },
    changeLang (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('locale/set_locale', lang)
      if (lang === 'ar') {
        this.$vuetify.rtl = true
      } else {
        this.$vuetify.rtl = false
      }
    },
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
    refreshUser () {
      this.$auth.fetchUser()
    },
    logout () {
      this.$api.setToken(false)
      this.$auth.logout().then(() => {
        this.$router.push('/')
      })
      this.$mqtt.end()
    },
    handleIcon (name) {
      // eslint-disable-next-line no-useless-escape
      if (name === 'poke') {
        return 'mdi-thumb-up'
      } else if (name === 'info') {
        return 'mdi-facebook'
      } else {
        return 'mdi-twitter'
      }
    }
  }
}
</script>
