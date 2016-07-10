import {
  SET_ACTIVED_DIALOGUE
} from '../core/type'

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}

export const setActivedDialogue = makeAction(SET_ACTIVED_DIALOGUE)
