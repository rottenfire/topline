import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/localStorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user')
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      setItem('user', user)
    }
  },
  actions: {

  }
})
