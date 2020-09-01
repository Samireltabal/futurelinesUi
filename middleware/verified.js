export default function ({ $auth, store, redirect }) {
  if (process.client && !store.state.auth.user.verified) {
    return redirect('/notauthorised', { message: 'يجب عليك تفعيل الحساب عن طريق البريد الإلكتروني' })
  }
}
