export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.getters['user/token']) {
    store.dispatch('interact/setMessage', 'You are disconnected, please login ; )')
    return redirect('/login')
  }
  if (!store.getters['user/loadedUsers'].profile_complete) {
    store.dispatch('interact/setMessage', 'Please, complete your profile before to continue')
    return redirect('/login/profile/settings')
  }
}
