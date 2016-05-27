import { Vuex } from '../core'

import dialogues from '../mutations/dialogues'
import resume from '../mutations/resume'

export default new Vuex.Store({
  modules: {
    dialogues,
    resume
  }
})
