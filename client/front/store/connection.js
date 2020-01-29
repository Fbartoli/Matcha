import axios from 'axios'
// import cookies from 'js-cookie'
// npm i js-cookie cookie --save

export const state = () => ({
  user: null
})

export const mutations = {
  set_user (store, data) {
    store.user = data
  },
  reset_user (store) {
    store.user = null
  }
}

export const actions = {
  fetch ({ commit }) {
    return axios.auth.me()
      .then((response) => {
        commit('set_user', response.data.result)
        axios.defaults.headers.common['x-access-token'] = response.data.token
        // cookies.set('x-access-token', response.data.token, { expires: 999999 })
        return response
      })
      .catch((error) => {
        commit('reset_user')
        delete axios.defaults.headers.common['x-access-token']
        // cookies.remove('x-access-token')
        return error
      })
  },
  login ({ commit }, data) {
    return axios.auth.login(data)
      .then((response) => {
        commit('set_user', response.data.user)
        return response
      })
  },
  reset ({ commit }) {
    commit('reset_user')
    return Promise.resolve()
  }
}
