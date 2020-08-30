<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <v-responsive
        :max-width="type.indexOf('table') > -1 ? 900 : 500"
        class="mx-auto"
      >
        <v-responsive
          class="mx-auto mb-12"
          max-width="500"
        >
          <div class="d-flex pa-3 align-center flex-wrap">
            <v-select
              v-model="type"
              :items="types"
              class="mr-12"
              hide-details
              label="Pre-made Types"
              filled
              style="max-width: 250px;"
            />

            <div>
              <v-switch
                v-model="boilerplate"
                inset
                hide-details
                label="Boilerplate"
              />

              <v-switch
                v-model="tile"
                inset
                hide-details
                label="Tile"
              />
            </div>
          </div>
        </v-responsive>

        <v-skeleton-loader
          ref="skeleton"
          :boilerplate="boilerplate"
          :type="type"
          :tile="tile"
          class="mx-auto"
        />
      </v-responsive>
      <blockquote class="blockquote">
        &#8220;Page For Employee Users Only&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  middleware: ['auth', 'verified', 'employee'],
  ssr: false,
  inject: ['theme'],
  data: () => ({
    boilerplate: false,
    tile: false,
    type: 'list-item-avatar-three-line',
    types: []
  }),

  mounted () {
    this.types = Object.keys(this.$refs.skeleton.rootTypes)
  }
}
</script>
