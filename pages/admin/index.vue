<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="12" md="12" lg="12">
      <v-skeleton-loader
        :loading="loading"
        type="table-heading, table-thead, table-tbody, table-tfoot"
      >
        <p> lorem </p>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'admin',
  ssr: false,
  data () {
    return {
      loading: false,
      title: 'Page Title'
    }
  }
}
</script>
