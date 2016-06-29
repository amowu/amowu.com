import { Vuex } from '../core'

import dialogues from './mutations/dialogues'
import resume from './mutations/resume'

const store = new Vuex.Store({
  modules: {
    dialogues,
    resume
  }
})

export default store
