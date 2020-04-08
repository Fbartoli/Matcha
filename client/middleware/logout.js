export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (store) {
    store.dispatch('user/setLogoutUser')
    store.dispatch('websocket/setLogoutWebsocket')
    store.dispatch('interact/setLogoutInteract')
    store.dispatch('geoloc/setLogoutGeoloc')
    store.dispatch('search/setLogoutSearch')
    store.dispatch('interact/setMessageStatusOff')
    store.dispatch('interact/setMessage', 'Disconnected !')
    return redirect('/')
  }
}
