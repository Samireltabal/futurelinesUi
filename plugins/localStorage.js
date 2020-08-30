import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'vuex',
    paths: ['locale.locale', 'menu.data', 'cart', 'wishlist', 'auth', 'settings', 'verification']
  })(store)
}
