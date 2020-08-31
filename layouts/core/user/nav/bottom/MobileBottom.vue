<template>
  <v-bottom-navigation
    v-model="bottomNav"
    app
  >
    <v-btn @click.prevent="$router.push('/')">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn @click.prevent="$router.push('/notifications')">
      <v-icon :class="newNotificationsCount ? 'custom-loader' : ''" :color="newNotificationsCount ? 'teal' : ''">
        {{ newNotificationsCount ? 'mdi-bell-ring' : 'mdi-bell-sleep' }}
      </v-icon>
    </v-btn>
    <v-btn v-if="loggedIn" @click.prevent="$router.push('/account/profile')">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn @click.prevent="$router.push('/timetable')">
      <v-icon>mdi-timetable</v-icon>
    </v-btn>
    <v-btn v-if="!loggedIn" @click.prevent="$router.push('/login')">
      <v-icon>mdi-login</v-icon>
    </v-btn>
    <v-btn v-if="loggedIn" @click.prevent="$auth.logout()">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  data () {
    return {
      bottomNav: 'recent'
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.loggedIn
    },
    newNotificationsCount () {
      if (this.$auth.loggedIn) {
        return this.$auth.user.UnreadNotificationsCount
      } else {
        return 0
      }
    }
  }
}
</script>
<style>
  .custom-loader {
    animation: loader 0.5s infinite alternate;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(15deg);
    }
    to {
      transform: rotate(-15deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(15deg);
    }
    to {
      transform: rotate(-15deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(15deg);
    }
    to {
      transform: rotate(-15deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(15deg);
    }
    to {
      transform: rotate(-15deg);
    }
  }
</style>
