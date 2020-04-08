export const state = () => ({
  // Websocket
  loadedSnackbarStatus: false,
  loadedSnackbarMessage: '',
  loadedNotifications: {},
  loadedAlertNotifications: 0,
  loadedStatus: {}
})
export const mutations = {
  // Websocket
  setSnackbarMessage (state, message) {
    state.loadedSnackbarMessage = message
  },
  setSnackbarStatus (state, value) {
    state.loadedSnackbarStatus = value
  },
  setNotifications (state, notif) {
    state.loadedNotifications = notif
  },
  countAlertNotifications (state, copyNotif) {
    state.loadedAlertNotifications = 0
    for (let i = 0; copyNotif.length; i++) {
      if (copyNotif[i].read === 0) {
        state.loadedAlertNotifications += 1
      }
    }
  },
  readNotifications (state, notifId) {
    for (let i = 0; state.loadedNotifications.length; i++) {
      if (state.loadedNotifications[i].id === notifId) {
        state.loadedNotifications[i].read = 1
        if (state.loadedAlertNotifications > 0) {
          state.loadedAlertNotifications -= 1
        }
      }
    }
  },
  setLogoutWebsocket (state) {
    state.loadedSnackbarStatus = false
    state.loadedSnackbarMessage = ''
    state.loadedNotifications = {}
    state.loadedAlertNotifications = 0
    state.loadedStatus = {}
  },
  setStatus (state, status) {
    state.loadedStatus = status
  }
}
export const actions = {
  // Websocket
  setSnackbarMessage ({ commit }, message) {
    commit('setSnackbarMessage', message)
    commit('setSnackbarStatus', true)
  },
  setSnackbarStatus ({ commit }, boolean) {
    commit('setSnackbarStatus', boolean)
  },
  setNotifications ({ commit }, notif) {
    commit('setNotifications', notif)
    commit('countAlertNotifications', notif)
  },
  readNotifications ({ commit }, notifId) {
    commit('readNotifications', notifId)
  },
  setLogoutWebsocket ({ commit }) {
    commit('setLogoutWebsocket')
  },
  setStatus ({ commit }, status) {
    commit('setStatus', status)
  }
}

export const getters = {
  // Websocket
  loadedSnackbarMessage (state) {
    return state.loadedSnackbarMessage
  },
  loadedSnackbarStatus (state) {
    return state.loadedSnackbarStatus
  },
  loadedNotifications (state) {
    return state.loadedNotifications
  },
  loadedAlertNotifications (state) {
    return state.loadedAlertNotifications
  },
  loadedStatus (state) {
    return state.loadedStatus
  }
}
