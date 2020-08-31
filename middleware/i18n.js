export default function ({ nuxt, isHMR, app, store, route, params, error, redirect }) {
  const defaultLocale = 'ar'
  const activeLocale = 'ar'
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) { return }
  // Get locale from params
  const locale = activeLocale || defaultLocale

  // Set locale
  store.dispatch('locale/set_locale', locale)
  app.i18n.locale = 'ar'
  // If route is /<defaultLocale>/... -> redirect to /...
  if (locale === defaultLocale && route.fullPath.indexOf('/' + defaultLocale) === 0) {
    const toReplace = '^/' + defaultLocale + (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '')
    const re = new RegExp(toReplace)
    return redirect(
      route.fullPath.replace(re, '/')
    )
  }
}
