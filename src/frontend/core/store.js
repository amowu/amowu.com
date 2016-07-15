import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from '../mutations/auth'
import dialogues from '../mutations/dialogues'
import resume from '../mutations/resume'

const store = new Vuex.Store({
  modules: {
    auth,
    dialogues,
    resume
  }
})

export default store
