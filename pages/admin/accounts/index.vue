<template>
  <v-row align="center" justify="center">
    <v-col
      cols="12"
      sm="12"
      lg="12"
      md="12"
    >
      <v-skeleton-loader
        :loading="loading"
        type="table-heading, table-thead, table-tbody, table-tfoot"
      >
        <!-- datatable -->
        <v-data-table
          :headers="headers"
          :items="accounts"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.verified="{ item }">
            <v-chip :color="item.verified ? 'green' : 'red'" dark>
              {{ item.verified ? 'YES' : 'NO' }}
            </v-chip>
          </template>
          <template v-slot:item.role="{ item }">
            <v-chip
              v-for="(role, index) in item.roles"
              :key="index"
              close
              color="teal"
              text-color="white"
              @click:close="revoke(item.id, role.name)"
            >
              {{ role.name }}
            </v-chip>
          </template>
          <template v-slot:item.provider="{ item }">
            <v-chip v-for="( provider, index ) in item.social" :key="index" outlined>
              <v-icon>{{ handleServiceLogo(provider.service) }}</v-icon>
            </v-chip>
            <v-chip v-if="! item.social.length" outlined>
              <v-icon>{{ handleServiceLogo('database') }}</v-icon>
            </v-chip>
          </template>
          <template v-slot:item.options="{ item }">
            <v-btn
              class="ma-0"
              outlined
              color="teal"
              small
              icon
              fab
              @click="handle(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              class="ma-0"
              outlined
              :color="item.verified ? 'teal' : 'error'"
              small
              icon
              fab
              @click="handle(item)"
            >
              <v-icon>{{ item.verified ? 'mdi-pause-circle' : 'mdi-play-circle' }}</v-icon>
            </v-btn>
            <v-btn
              class="ma-0"
              outlined
              color="teal"
              small
              icon
              fab
              @click="poke(item.id)"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <v-btn
              class="ma-0"
              outlined
              color="error"
              small
              icon
              fab
              @click="unpoke(item.id)"
            >
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            <v-menu
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ma-0"
                  outlined
                  color="teal"
                  small
                  icon
                  fab
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-database</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(role, index) in roles"
                  :key="index"
                  @click="attachRole(item.id, role.name)"
                >
                  <v-list-item-title>{{ role.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
        <!-- end datatable -->
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
export default {
  middleware: ['auth', 'verified', 'admin'],
  layout: 'admin',
  ssr: false,
  inject: ['theme'],
  data: () => ({
    loading: true,
    transition: 'scale-transition',
    tile: false,
    type: 'list-item-avatar-three-line',
    types: [],
    accounts: {},
    roles: {},
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id'
      },
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Member Since', value: 'registered' },
      { text: 'Verified', value: 'verified' },
      { text: 'Role', value: 'role' },
      { text: 'Pokes', value: 'Pokes' },
      { text: 'Provider', value: 'provider' },
      { text: 'Options', value: 'options' }
    ],
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%'
      }
    ]
  }),

  mounted () {
    this.listUser()
    this.listRoles()
  },
  methods: {
    listUser () {
      this.$api.get('pokes/users').then((response) => {
        this.accounts = response.data
        this.loading = false
      })
    },
    poke (id) {
      const data = {
        user_id: id
      }
      this.$api.post('pokes/poke', data).then(() => {
        this.listUser()
      })
    },
    attachRole (user, role) {
      const data = {
        user_id: user,
        role
      }
      this.$api.post('roles/grant', data).then(() => {
        this.$toast.success('Action completed')
        this.listUser()
      })
    },
    revoke (user, role) {
      const data = {
        user_id: user,
        role
      }
      this.$api.post('roles/revoke', data).then(() => {
        this.$toast.success('Action completed')
        this.listUser()
      })
    },
    unpoke (id) {
      const data = {
        user_id: id
      }
      this.$api.post('pokes/unpoke', data).then(() => {
        this.listUser()
      })
    },
    listRoles () {
      this.$api.get('roles').then((response) => {
        this.roles = response.data
      })
    },
    handleServiceLogo (name) {
      return 'mdi-' + name
    }
  }
}
</script>
