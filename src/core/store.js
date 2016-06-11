import { Vuex } from '../core'

import dialogues from '../vuex/mutations/dialogues'
import resume from '../vuex/mutations/resume'

const store = new Vuex.Store({
  modules: {
    dialogues,
    resume
  }
})

export default store
