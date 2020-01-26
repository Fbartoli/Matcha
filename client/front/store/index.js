import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedAuths: [],
      loadedInfos: []
    },
    mutations: {
      setAuths (state, auths) {
        state.loadedAuths = auths
      },
      addAuths (state, auth) {
        state.loadedAuths.push(auth)
      },
      editAuths (state, editedAuth) {
        const authIndex = state.loadedAuths.findIndex(
          auth => auth.id === editedAuth.id
        )
        state.loadedAuths[authIndex] = editedAuth
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
            const authsArray = []
            for (const key in res.data) {
              authsArray.push({ ...res.data[key], id: key })
            }
            vuexContext.commit('setAuths', authsArray)
          })
          .catch(e => context.error(e))
        // return new Promise ((resolve, reject) => {
        //   vuexContext.commit("setAuths", [
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
      addAuth (vuexContext, auth) {
        const createdAuth = {
          ...auth
        }
        return axios
          .auth('', createdAuth)
          .then((result) => {
            vuexContext.commit('addAuth', { ...createdAuth, id: result.data })
          })
        // eslint-disable-next-line
        .catch(e => console.log (e))
      },
      editAuth (vuexContext, editedAuth) {
        return axios.put('URL.json')
          .then((res) => {
            vuexContext.commit('editAuth', editedAuth)
          })
        // eslint-disable-next-line
        .catch(e => console.log (e))
      },
      setAuths (vuexContext, auths) {
        vuexContext.commit('setAuths', auths)
      },
      setInfos (vuexContext, infos) {
        vuexContext.commit('setInfos', infos)
      }
    },
    getters: {
      loadedAuths (state) {
        return state.loadedAuths
      },
      loadedInfos (state) {
        return state.loadedInfos
      }
    }
  })
}

export default createStore
