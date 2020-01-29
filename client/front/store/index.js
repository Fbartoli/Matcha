import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedUsers: [],
      loadedInfos: []
    },
    mutations: {
      setUsers (state, users) {
        state.loadedUsers = users
      },
      addUsers (state, user) {
        state.loadedUsers.push(user)
      },
      editUsers (state, editedUser) {
        const userIndex = state.loadedUsers.findIndex(
          user => user.id === editedUser.id
        )
        state.loadedUsers[userIndex] = editedUser
      },
      setInfos (state, infos) {
        state.loadedInfos = infos
      }
    },
    actions: {
      nuxtServerInit (vuexContext, context) {
        // add URL of the DATABASE, return an object with the properties so we need to convert it in array
        return axios.get()
          .then((res) => {
            const usersArray = []
            for (const key in res.data) {
              usersArray.push({ ...res.data[key], id: key })
            }
            vuexContext.commit('setUsers', usersArray)
          })
          .catch(e => context.error(e))
        // return new Promise ((resolve, reject) => {
        //   vuexContext.commit("setUsers", [
        //     {
        //       id: "888",
        //       username: "user_888",
        //       password: "secretcryptomagicpass",
        //       name: "name_888",
        //       surname: "surname_888",
        //       token: "token_888",
        //       email: "email888@888_testmatcha.fr",
        //       birth_date: "01/04/2000",
        //       location: "",
        //       photo: "",
        //     }
        //   ])
        //   resolve ()
        // })
      },
      addUser (vuexContext, user) {
        const createdUser = {
          ...user
        }
        return axios
          .user('', createdUser)
          .then((result) => {
            vuexContext.commit('addUser', { ...createdUser, id: result.data })
          })
        // eslint-disable-next-line
        .catch(e => console.log (e))
      },
      editUser (vuexContext, editedUser) {
        return axios.put('URL.json')
          .then((res) => {
            vuexContext.commit('editUser', editedUser)
          })
        // eslint-disable-next-line
        .catch(e => console.log (e))
      },
      setUsers (vuexContext, users) {
        vuexContext.commit('setUsers', users)
      },
      setInfos (vuexContext, infos) {
        vuexContext.commit('setInfos', infos)
      }
    },
    getters: {
      loadedUsers (state) {
        return state.loadedUsers
      },
      loadedInfos (state) {
        return state.loadedInfos
      }
    }
  })
}

export default createStore
