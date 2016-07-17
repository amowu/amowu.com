import Vue from 'vue'
import Vuex from 'vuex'

import { ROUTE_CHANGED } from './type'

Vue.use(Vuex)

import auth from '../mutations/auth'
import dialogues from '../mutations/dialogues'
import resume from '../mutations/resume'

const store = new Vuex.Store({
  modules: {
    auth,
    dialogues,
    resume
  },
  mutations: {
    [ROUTE_CHANGED]: (state, { path }) => {
      analytics.page({
        path
      })
    }
  }
})

export default store
