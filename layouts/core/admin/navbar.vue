<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      flat
      :right="$vuetify.rtl"
      app
    >
      <v-list dense>
        <mobileMenuItem
          v-for="(item, i) in items"
          :key="i"
          :item="item"
        />
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="false"
      hide-on-scroll
      elevation="0"
      flat
      tile
      color="#fff"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <client-only>
        <a
          v-if="! $auth.loggedIn"
          icon
          class="mx-1 px-0"
          title="login"
          @click="$router.push('/login')"
        >
          <v-icon>
            mdi-login
          </v-icon>
        </a>
        <a icon class="mx-1 px-1" @click.prevent>
          <v-icon :color="wsConnected ? 'green' : 'red'">mdi-circle</v-icon>
        </a>
        <a
          icon
          href="#"
          class="mx-1 px-0 text-caption grey--text text--darken-1 text-decoration-none text-black"
          @click.prevent="changeLocale"
        >
          {{ $i18n.locale === 'ar' ? "ع" : "en" }}
        </a>
        <a
          v-if="$auth.loggedIn"
          icon
          class="mx-1 px-0"
          @click.stop="refreshUser"
        >
          <v-icon>
            mdi-account
          </v-icon>
        </a>
        <a
          v-if="$auth.loggedIn"
          icon
          title="Logout"
          class="mx-1 px-0"
          @click.stop="logout"
        >
          <v-icon>
            mdi-logout
          </v-icon>
        </a>
        <v-menu
          left
          bottom
          dense
          flat
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-badge
                :content="newNotificationsCount"
                :value="newNotificationsCount"
                color="teal"
                overlap
              >
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-list
            dense
            flat
          >
            <v-subheader>{{ $t('notifications') }}</v-subheader>
            <v-list-item
              v-for="item in notifications"
              :key="item.id"
              @click="() => {}"
            >
              <v-list-item-icon>
                <v-icon v-text="handleIcon(item.data.type)" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="! item.read_at">
                    <v-icon x-small color="green">mdi-circle</v-icon>
                  </span>
                  {{ item.data.message }}
                  <small v-time="item.created_at" />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="notifications.length">
              <v-list-item-content>
                <v-list-item-content>
                  <v-row>
                    <v-col cols="12" sm="5" class="pa-1">
                      <v-btn text x-small tile @click="$router.push('/notifications/')">
                        More
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="5" class="pa-1">
                      <v-btn text x-small tile @click="markAsRead">
                        mark all as read
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="! notifications.length">
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('No Notifications Found') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </client-only>
    </v-app-bar>
  </div>
</template>
<script>
import Vue from 'vue'
import VueMqtt from 'vue-mqtt'
import moment from 'moment'
import mobileMenuItem from '~/components/Menus/mobileMenuItem'
export default {
  name: 'Navbar',
  components: {
    mobileMenuItem
  },
  directives: {
    time: {
      bind (el, value) {
        const unparsedDate = new Date(value.value)
        const date = moment(unparsedDate.toISOString()).fromNow() // here u modify data
        el.textContent = date // and set to the view
      }
    }
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Admin Home',
          to: '/admin/',
          type: 'link',
          hasChild: false
        },
        {
          title: 'User Controls',
          type: 'header',
          hasChild: false
        },
        {
          icon: 'mdi-account-group',
          title: 'Accounts',
          to: '/admin/accounts',
          type: 'link',
          hasChild: false
        },
        {
          title: 'Projects',
          type: 'header',
          hasChild: false
        },
        {
          icon: 'mdi-tag-multiple',
          title: 'Porjects',
          type: 'parent',
          hasChild: true,
          children: [
            {
              icon: 'mdi-plus',
              title: 'New Project',
              type: 'link',
              to: '/admin/projects/new'
            },
            {
              icon: 'mdi-database',
              title: 'All Projects',
              type: 'link',
              to: '/admin/projects/'
            }
          ]
        },
        {
          title: 'Shop',
          type: 'header',
          hasChild: false
        },
        {
          icon: 'mdi-store',
          title: 'Products',
          to: '/products',
          type: 'parent',
          hasChild: true,
          children: [
            {
              icon: 'mdi-store',
              title: 'Products',
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
              icon: 'mdi-tag-multiple',
              title: 'Categories',
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
              icon: 'mdi-tag-multiple',
              title: 'Orders',
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
          icon: 'mdi-lock',
          title: 'Verified',
          type: 'link',
          to: '/verified/'
        },
        {
          icon: 'mdi-home',
          title: 'Website Home',
          type: 'link',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      title: process.env.APPLICATION_NAME
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.loggedIn
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
    },
    loggedIn: {
      handler: 'handleMqtt',
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
    handleMqtt (value) {
      if (!this.$mqtt) {
        if (value) {
          const mqttOptions = {
            clientId: this.$auth.user.email,
            username: this.$auth.user.email,
            reconnectPeriod: 5000,
            password: this.$auth.getToken('local')
          }
          Vue.use(VueMqtt, process.env.WS_URL, mqttOptions)
          const channel = '/' + this.$auth.user.uuid + '/notifications'
          const channel2 = '/' + this.$auth.user.uuid + '/fromanotherArea'
          const channels = [
            channel,
            channel2
          ]
          this.$mqtt.subscribe(channels, {}, () => {
            this.$mqtt.on('message', (topic, message, packet) => {
              if (topic === channel2) {
                this.$toast.info(JSON.parse(message).message)
              } else if (topic === channel) {
                const constractor = {
                  icon: 'mdi-account',
                  type: 'success'
                }
                this.$toast.show(message, constractor)
                this.$auth.fetchUser()
              }
            })
          })
        }
      }
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
    }
  }
}
</script>
