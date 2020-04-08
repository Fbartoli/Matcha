export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (store.getters['user/token']) {
    store.dispatch('interact/setMessage', 'You are already logged in.')
    return redirect('/')
  }
}
