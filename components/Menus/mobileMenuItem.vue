<template>
  <v-subheader v-if="item.type === 'header'">
    {{ item.title }}
  </v-subheader>
  <!-- start link item -->
  <v-list-item
    v-else-if="item.type === 'link'"
    router
    :to="item.to"
    exact
    :class="checkVisibility(item.visibleTo) ? '' : 'd-none'"
  >
    <v-list-item-action>
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
  <!-- end link item -->
  <!-- start hasChild group -->
  <v-list-group
    v-else
    :prepend-icon="item.icon"
    :value="false"
  >
    <!-- group title start -->
    <template v-slot:activator>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </template>
    <!-- group title end -->
    <!-- start children loop -->
    <div v-for="(child, i) in item.children" :key="i">
      <!-- child has children -->
      <v-list-group
        v-if="child.hasChild"
        no-action
        sub-group
        :value="false"
      >
        <template v-slot:activator>
          <v-list-item-action>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> {{ child.title }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(subChild, k) in child.children"
          :key="k"
          :to="subChild.to"
        >
          <v-list-item-action>
            <v-icon>{{ subChild.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ subChild.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <!-- end child has child -->
      <!-- child is a link -->
      <v-list-item
        v-else
        :to="child.to"
      >
        <v-list-item-action>
          <v-icon>{{ child.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ child.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- end child is a link -->
    </div>
    <!-- end children loop -->
  </v-list-group>
  <!-- end hasChild group -->
</template>
<script>
export default {
  name: 'MobileMenuItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    role () {
      if (this.$store.state.auth.loggedIn) {
        return this.$store.state.auth.user.role
      } else {
        return 'all'
      }
    }
  },
  methods: {
    checkVisibility (role) {
      if (role === 'all') {
        return true
      }
      if (process.client && this.role === role) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
