import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store, isHMR, isServer, isClient }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  if (isHMR) { return }
  if (isClient) {
    window.onNuxtReady((nuxt) => {
      // eslint-disable-next-line no-undef
      createPersistedState()(store) // vuex plugins can be connected to store, even after creation
    })
  }

  app.i18n = new VueI18n({
    locale: store.state.locale.locale,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages: {
      en: require('~/locales/en.json'),
      ar: require('~/locales/ar.json')
    }
  })

  app.i18n.path = (link) => {
    return `/${app.i18n.locale}/${link}`
  }
}
