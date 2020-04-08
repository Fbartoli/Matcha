export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (store.getters['user/token'] === null) {
    store.dispatch('interact/setMessage', 'You are disconnected, please login ;)')
    return redirect('/login')
  }
}
