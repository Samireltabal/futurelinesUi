export default function ({ store, $axios, $auth, redirect }, inject) {
  const github = $axios.create({
    baseURL: process.env.GITHUB_BASE_URL,
    timeout: 5000,
    headers: {
      common: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token ' + process.env.GITHUB_API_KEY
      }
    },
    credentials: false
  })
  inject('github', github)
}
