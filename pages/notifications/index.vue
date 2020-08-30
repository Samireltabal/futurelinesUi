<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="12">
      <v-skeleton-loader
        :loading="loading"
        type="list-item-avatar"
      >
        <v-list>
          <v-list-item
            v-for="item in notifications.data"
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
        </v-list>
        <!-- end datatable -->
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
export default {
  middleware: ['auth', 'verified'],
  name: 'Notifications',
  directives: {
    time: {
      bind (el, value) {
        const unparsedDate = new Date(value.value)
        const date = moment(unparsedDate.toISOString()).fromNow() // here u modify data
        el.textContent = date // and set to the view
      }
    }
  },
  layout: 'default',
  ssr: false,
  inject: ['theme'],
  data: () => ({
    loading: true,
    notifications: {}
  }),

  mounted () {
    this.listUser()
  },
  methods: {
    listUser () {
      this.$api.get('auth/notifications').then((response) => {
        this.notifications = response.data
        this.loading = false
      })
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
