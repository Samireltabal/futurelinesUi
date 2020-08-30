<template>
  <v-row>
    <v-col cols="12" xl="12">
      <v-row>
        <v-col cols="12" xl="6">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <span>Created at : </span><date>{{ new Date(task.created_at).toString() }}</date>
        </v-col>
        <v-col cols="12" xl="6">
          <v-dialog v-model="addUserModal" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="mr-2">
                  mdi-account-plus
                </v-icon> add user
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Add User</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field label="Legal first name*" required />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field label="Legal middle name" hint="example of helper text only on focus" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Legal last name*"
                        hint="example of persistent helper text"
                        persistent-hint
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Email*" required />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Password*" type="password" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="['0-17', '18-29', '30-54', '54+']"
                        label="Age*"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                        label="Interests"
                        multiple
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="addUserModal = false">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="addUserModal = false">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="addCommentModal" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="mr-2">
                  mdi-comment-plus
                </v-icon> add comment
              </v-btn>
            </template>
          </v-dialog>
          <v-btn
            color="primary"
            dark
            small
          >
            <v-icon class="mr-2">
              mdi-check
            </v-icon> mark as completed
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'SingleTask',
  props: {
    task: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      addUserModal: false,
      addCommentModal: false
    }
  }
}
</script>
