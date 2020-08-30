<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="teal"
        outlined
        x-small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>
          mdi-github
        </v-icon> Add Repo
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ project.project_name }}</v-list-item-title>
            <v-list-item-subtitle>Add new repo</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list>
        <v-list-item>
          <v-text-field
            v-model="form.repo_name"
            :counter="50"
            label="Repository Name"
            required
          />
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="form.url"
            append-icon="mdi-github"
            label="Repository Url"
            prefix="https://www.github.com/"
            placeholder="{user}/{repo}"
            required
          />
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="menu = false">
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="save()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  name: 'AddRepo',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
      form: {
        repo_name: '',
        url: '',
        project_id: this.project.id
      }
    }
  },
  methods: {
    save () {
      const uri = 'projects/' + this.project.id + '/addrepo'
      this.$api.post(uri, this.form).then((response) => {
        this.menu = false
        this.$emit('taskAdded')
      }).catch((error) => {
        this.$toast.error(error.response.data.message)
      })
    }
  }

}
</script>
