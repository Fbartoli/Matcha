export default function ({ store, redirect }) {
  if (!store.getters['user/token']) {
    store.dispatch('interact/setMessage', 'You are disconnected, please login ; )')
    return redirect('/login')
  }
  return redirect('/')
}
