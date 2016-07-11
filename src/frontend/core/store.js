import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import dialogues from '../mutations/dialogues'
import resume from '../mutations/resume'

const store = new Vuex.Store({
  modules: {
    dialogues,
    resume
  }
})

export default store
