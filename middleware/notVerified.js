export default function ({ store, redirect }) {
  if (process.client && store.state.auth.user.verified) {
    return redirect('/')
  }
}
