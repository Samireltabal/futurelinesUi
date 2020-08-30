export default function ({ $auth, store, redirect }) {
  if (process.client && !(store.state.auth.user.role === 'employee' || store.state.auth.user.role === 'admin')) {
    return redirect('/notauthorised', { message: 'not allowed to do this action , Employees only' })
  }
}
