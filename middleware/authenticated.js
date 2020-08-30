export default async function ({ $auth }) {
  if (process.client && $auth.loggedIn) {
    await $auth.fetchUser().then(() => {}).catch(async function () {
      await $auth.logout()
    })
  }
}
