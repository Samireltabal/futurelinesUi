export default function ({ store, $axios, $auth, redirect }, inject) {
  const api = $axios.create({
    baseURL: process.env.API_URL,
    timeout: 5000,
    headers: {
      common: {
        Accept: 'Application/json, */*',
        'X-localization': store.state.locale.locale
      }
    },
    credentials: false
  })
  inject('api', api)
}
