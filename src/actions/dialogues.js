import {
  SET_ACTIVED_DIALOGUE
} from '../core/types'

export const setActivedDialogue = makeAction(SET_ACTIVED_DIALOGUE)

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
