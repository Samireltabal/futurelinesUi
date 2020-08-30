export default function ({ $auth, store, redirect }) {
  if (process.client && !store.state.auth.user.verified) {
    return redirect('/notauthorised', { message: 'You must verify your account' })
  }
}
