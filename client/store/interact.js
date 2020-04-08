import axios from 'axios'
import socket from '~/plugins/socket.io.js'

export const state = () => ({
  // Interact
  serverMessage: 'default',
  serverMessageStatus: false,
  loadedChatHistory: [],
  loadedLikes: [],
  loadedViews: []
})

export const mutations = {
  // Interact
  setMessage (state, message) {
    state.serverMessage = message
    state.serverMessageStatus = true
  },
  setMessageStatusOff (state) {
    state.serverMessageStatus = false
  },
  setChatHistory (state, history) {
    state.loadedChatHistory = history
  },
  setLikes (state, likes) {
    state.loadedLikes = likes
  },
  setViews (state, views) {
    state.loadedViews = views
  },
  setLogoutInteract (state) {
    state.serverMessage = null
    state.serverMessageStatus = false
    state.loadedLikes = []
    state.loadedViews = []
    state.loadedChatHistory = []
  }
}

export const actions = {
  // Interact
  setMessage ({ commit }, message) {
    commit('setMessage', message)
  },
  setMessageStatusOff ({ commit }) {
    commit('setMessageStatusOff')
  },
  setChatHistory ({ commit }, history) {
    commit('setChatHistory', history)
  },
  setLikes ({ commit }, likes) {
    commit('setLikes', likes)
  },
  setViews ({ commit }, views) {
    commit('setViews', views)
  },
  setLogoutInteract ({ commit }) {
    commit('setLogoutInteract')
  },
  sendLove ({ dispatch, rootGetters }, target) {
    axios({
      method: 'post',
      url: process.env.serverUrl + '/social/like',
      data: {
        username: target
      },
      headers: {
        'Authorization': 'Bearer ' + rootGetters['user/token']
      }
    })
      .then((response) => {
        if (response.data.client.includes('Liked and matched with')) {
          socket.emit('likeback', rootGetters['user/loadedUsers'].username, target)
        } else {
          socket.emit('like', rootGetters['user/loadedUsers'].username, target)
        }
        dispatch('interact/setMessage', 'I like !', { root: true })
      })
      // eslint-disable-next-line
      .catch((error) => {
        dispatch('interact/setMessage', error.response.data.client, { root: true })
      })
  }
}

export const getters = {
  // Interact
  serverMessage (state) {
    return state.serverMessage
  },
  serverMessageStatus (state) {
    return state.serverMessageStatus
  },
  loadedChatHistory (state) {
    return state.loadedChatHistory
  },
  loadedLikes (state) {
    return state.loadedLikes
  },
  loadedViews (state) {
    return state.loadedViews
  }
}
