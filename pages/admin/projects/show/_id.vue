<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="12" md="12" lg="12" class="page">
      <v-layout class="d-flex justify-space-between mb-4">
        <h3
          class="mr-2"
          outlined
          tile
        >
          {{ project.project_name }}
        </h3>
        <v-btn
          class="ml-2"
          :loading="$fetchState.pending"
          outlined
          tile
          @click="$fetch()"
        >
          Refresh
        </v-btn>
      </v-layout>
      <div
        class="d-flex justify-space-between mt-4 pa-2"
      >
        <div class="d-flex justify-space-between">
          <ul class="project_customer">
            <li v-for="(value, key) in project.customer" :key="key">
              {{ key }} : <span>{{ value }}</span>
            </li>
          </ul>
        </div>
        <div>
          <v-col>
            <h3>Project Progress</h3>
          </v-col>
          <v-col>
            <v-progress-linear
              :value="project.rate"
              color="light-green darken-4"
              height="30"
              striped
            >
              <template v-slot="{ value }">
                <strong class="white--text">{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-col>
        </div>
        <div>
          <v-list-item
            v-for="(repo, index) in project.repos"
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
          <v-chip v-if="! project.repos">
            N/A
          </v-chip>
        </div>
        <div>Alive</div>
      </div>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="12" class="page">
      <h3>Tasks</h3>
      <v-list>
        <v-list-item v-for="task in project.tasks" :key="task.id">
          <single-task :task="task" />
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12" sm="12" md="12" lg="12" class="page">
      <h3>Repos</h3>
      <div v-for="repo in project.repos" :key="repo.id">
        <single-repo :repo="repo" />
      </div>
    </v-col>
  </v-row>
</template>
<script>
import SingleTask from '@/components/projects/view/task'
import SingleRepo from '@/components/projects/view/repo'
export default {
  layout: 'admin',
  ssr: false,
  components: {
    SingleTask,
    SingleRepo
  },
  async validate ({ params, $api, redirect }) {
    return await $api.get('projects/show/' + params.id).then((response) => {
      this.loading = false
      return true
    }).catch((error) => {
      return redirect('/notauthorised', { message: error.response.data })
    })
  },
  async fetch () {
    await this.$api.get('/projects/show/' + this.$route.params.id).then((response) => {
      this.project = response.data
    })
  },
  data () {
    return {
      loading: false,
      project: {},
      title: 'Page Title'
    }
  },
  activated () {
    // Call fetch again if last fetch more than 30 sec ago
    if (this.$fetchState.timestamp <= Date.now() - 30000) {
      this.$fetch()
    }
  },
  methods: {
    retriveProject () {
      this.$api.get('projects/show/' + this.$route.params.id).then((response) => {
        this.project = response.data
      })
    }
  }
}
</script>
