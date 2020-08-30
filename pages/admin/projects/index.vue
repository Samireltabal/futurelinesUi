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
          :items="projects"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:[`item.completed`]="{ item }">
            <v-chip :color="item.completed ? 'green' : 'red'" dark>
              {{ item.verified ? 'YES' : 'NO' }}
            </v-chip>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            <span v-time="item.created_at" />
          </template>
          <template v-slot:[`item.repos`]="{ item }">
            <v-list-item
              v-for="(repo, index) in item.repos"
              :key="index"
            >
              <v-list-item-content>
                <a :href="'https://www.github.com/' + repo.url" class="text-decoration-none" target="_blank">
                  <v-list-item-title>
                    <v-chip>
                      <v-icon class="mr-1">mdi-github</v-icon> {{ repo.repo_name }}
                    </v-chip>
                  </v-list-item-title>
                </a>
              </v-list-item-content>
            </v-list-item>
            <v-chip v-if="! item.repos.length">
              N/A
            </v-chip>
          </template>
          <template v-slot:[`item.tasks`]="{ item }">
            <v-list-item
              v-for="(task, index) in item.tasks"
              :key="index"
              dense
            >
              <v-list-item-content>
                <v-list-item-title>{{ task.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-chip v-if="! item.tasks.length">
              N/A
            </v-chip>
          </template>
          <template v-slot:[`item.options`]="{ item }">
            <addTask :project="item" @taskAdded="listProjects" />
            <addRepo :project="item" @taskAdded="listProjects" />
            <v-btn
              x-small
              color="teal"
              outlined
              @click="$router.push('/admin/projects/show/' + item.id)"
            >
              <v-icon small>
                mdi-eye
              </v-icon>
              read more
            </v-btn>
          </template>
        </v-data-table>
        <!-- end datatable -->
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
import addTask from '@/components/projects/addTask'
import addRepo from '@/components/projects/addRepo'
export default {
  middleware: ['auth', 'verified', 'admin'],
  layout: 'admin',
  components: {
    addTask,
    addRepo
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
  ssr: false,
  inject: ['theme'],
  data: () => ({
    loading: true,
    transition: 'scale-transition',
    tile: false,
    type: 'list-item-avatar-three-line',
    types: [],
    projects: {},
    roles: {},
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id'
      },
      { text: 'Project Name', value: 'project_name' },
      { text: 'Customer Name', value: 'customer.name' },
      { text: 'Started at', value: 'created_at' },
      { text: 'Repos Attached', value: 'repos' },
      { text: 'Tasks', value: 'tasks' },
      { text: 'Completion', value: 'completed' },
      { text: 'Options', value: 'options' }
    ]
  }),

  mounted () {
    this.listProjects()
  },
  methods: {
    listProjects () {
      this.$api.get('projects/all').then((response) => {
        this.projects = response.data
        this.loading = false
      })
    }
  }
}
</script>
