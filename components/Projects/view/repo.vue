<template>
  <v-row>
    <v-col cols="12" xl="12">
      <h3>
        {{ repo.repo_name }}
        <v-btn
          class="ml-2"
          :loading="loading"
          outlined
          tile
          @click="fetchRepo()"
        >
          <v-icon>mdi-refresh</v-icon>  Retrive data
        </v-btn>
      </h3>
    </v-col>
    <v-col v-if="dataRetrived" cols="12" xl="12">
      <v-row>
        <v-col cols="12" xl="3">
          <v-card
            class="mx-auto"
            outlined
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                >
                  Repo Owner
                </v-card-title>
                <v-card-subtitle v-text="repoData.owner.login" />
              </div>

              <v-avatar
                class="ma-3"
                size="64"
                tile
              >
                <v-img :src="repoData.owner.avatar_url" />
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" xl="3">
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title>
              Information
            </v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item two-line>
                  <v-list-item-title>
                    created at
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ repoData.created_at }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-title>
                    updated at
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ repoData.updated_at }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item two-line dense>
                  <v-list-item-title>
                    Last Push
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ repoData.pushed_at }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item two-line dense>
                  <v-list-item-title>
                    Language
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ repoData.language }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item two-line dense>
                  <v-list-item-title>
                    size
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ repoData.size }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item two-line dense>
                  <v-list-item-title>
                    Visibility
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="repoData.private">
                    <v-icon>mdi-lock</v-icon> Private
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    <v-icon>mdi-lock-open</v-icon> Public
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xl="3">
          <v-card
            class="mx-auto"
            outlined
          >
            <v-card-title>
              Links
            </v-card-title>
            <v-card-text>
              <v-list>
                <a :href="repoData.html_url" class="text-decoration-none" target="_blank">
                  <v-list-item>
                    <v-icon>mdi-link</v-icon> Repo link
                  </v-list-item>
                </a>
                <v-list-item>
                  <v-icon>mdi-github</v-icon> Commits : {{ commits.length }}
                </v-list-item>
                <v-list-item v-if="commits[0]" three-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon>mdi-calendar</v-icon> last commit : {{ commits[0].commit.author.date }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon>mdi-account</v-icon> {{ commits[0].commit.author.name }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      message : {{ commits[0].commit.message }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'SingleRepo',
  props: {
    repo: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      repoData: {},
      dataRetrived: false,
      loading: false,
      commits: {}
    }
  },
  methods: {
    fetchRepo () {
      this.$github.get('repos/' + this.repo.url).then((response) => {
        this.repoData = response.data
        this.dataRetrived = true
        this.$github.get('repos/' + this.repo.url + '/commits').then((resp) => {
          this.commits = resp.data
        })
      })
    },
    retrive () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
  }
}
</script>
