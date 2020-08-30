<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="12" md="12" lg="12" class="page mx-2">
      <h1>New Project</h1>
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-skeleton-loader
              :loading="loading"
              type="list-item"
            >
              <v-text-field
                v-model="data.project_name"
                label="Project Title"
                append-icon="mdi-rename-box"
                outlined
                clearable
                :loading="Submitting"
              />
            </v-skeleton-loader>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <v-skeleton-loader
                  :loading="loading"
                  type="list-item"
                >
                  <v-combobox
                    v-model="model"
                    :items="items"
                    label="Customer Name"
                    :search-input.sync="search"
                    item-text="Description"
                    item-value="name"
                    outlined
                    return-object
                  />
                </v-skeleton-loader>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <v-skeleton-loader
                  :loading="loading"
                  type="list-item"
                >
                  <v-text-field
                    v-model="data.customer_phone"
                    label="Customer Phone"
                    append-icon="mdi-phone"
                    outlined
                    clearable
                    :loading="Submitting"
                  />
                </v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="6">
                <v-skeleton-loader
                  :loading="loading"
                  type="list-item"
                >
                  <v-text-field
                    v-model="data.customer_email"
                    label="Customer Email"
                    append-icon="mdi-email"
                    outlined
                    clearable
                    :loading="Submitting"
                  />
                </v-skeleton-loader>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6">
                <v-skeleton-loader
                  :loading="loading"
                  type="list-item"
                >
                  <v-text-field
                    v-model="data.customer_company"
                    label="Customer Company"
                    append-icon="mdi-store"
                    outlined
                    clearable
                    :loading="Submitting"
                  />
                </v-skeleton-loader>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-skeleton-loader
                :loading="loading"
                type="list-item"
              >
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="data.project_deadline"
                      label="Project Deadline"
                      append-icon="mdi-calendar"
                      readonly
                      clearable
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="data.project_deadline" @input="menu = false" />
                </v-menu>
              </v-skeleton-loader>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-skeleton-loader
                :loading="loading"
                type="list-item"
              >
                <v-text-field
                  v-model="data.github_repo"
                  label="Github Repository"
                  append-icon="mdi-github"
                  outlined
                  clearable
                  :loading="Submitting"
                />
              </v-skeleton-loader>
            </v-col>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-skeleton-loader
              :loading="loading"
              type="article"
            >
              <v-textarea
                v-model="data.project_description"
                outlined
                label="Project Description"
              />
            </v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="12">
            <v-btn
              block
              color="success"
              large
              class="color--darken-2"
              @click="submit"
            >
              <v-icon>mdi-plus</v-icon>  Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'admin',
  ssr: false,
  data () {
    return {
      loading: true,
      title: 'Page Title',
      Submitting: false,
      menu: false,
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      type: '',
      search: null,
      date: '',
      nonce: 1,
      data: {
        project_name: '',
        customer_name: '',
        customer_phone: '',
        customer_company: '',
        customer_email: '',
        project_deadline: '',
        project_description: '',
        github_repo: ''
      }
    }
  },
  computed: {
    fields () {
      if (!this.model) {
        return []
      }
      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        const Description = entry.Description.length > this.descriptionLimit
          ? entry.Description.slice(0, this.descriptionLimit) + '...'
          : entry.Description

        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    search (val) {
      // Items have already been loaded
      if (val.length < 1) {
        val = 'null'
      }
      this.isLoading = true

      // Lazily load input items
      const uri = process.env.API_URL + 'projects/customers?keyword=' + val
      fetch(uri)
        .then(res => res.json())
        .then((res) => {
          const { count, entries } = res
          this.count = count
          this.entries = entries
        })
        .finally(() => (this.loading = false))
    },
    model (val) {
      this.type = typeof val
      if (typeof val === 'object') {
        this.data.customer_name = val.name
        this.data.customer_phone = val.phone
        this.data.customer_company = val.company
        this.data.customer_email = val.email
      } else if (typeof val === 'string') {
        this.data.customer_name = val
      }
    }
  },
  mounted () {
    this.ping()
  },
  methods: {
    ping () {
      this.$api.$get('ping').then(() => {
        this.loading = false
      })
    },
    retriveCustomers () {
      const keyword = this.search
      const uri = 'projects/customers?keyword=' + keyword
      this.$api.get(uri).then((response) => {
        this.items = response.data
      })
    },
    submit () {
      this.$api.post('projects/new', this.data).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    validate () {

    }
  }

}
</script>
