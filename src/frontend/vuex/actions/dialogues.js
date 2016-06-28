import {
  SET_ACTIVED_DIALOGUE
} from '../const'

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}

export const setActivedDialogue = makeAction(SET_ACTIVED_DIALOGUE)
