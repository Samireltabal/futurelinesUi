export const state = () => {
  return {
    locale: 'ar'
  }
}

export const mutations = {
  set_locale (state, locale) {
    state.locale = locale
    this.$api.setHeader('X-localization', locale)
    this.$axios.setHeader('X-localization', locale)
  }
}

export const actions = {
  set_locale (context, locale) {
    this.$api.setHeader('X-localization', locale)
    this.$axios.setHeader('X-localization', locale)
    context.commit('set_locale', locale)
  }
}
