import {
  SET_ACTIVED_DIALOGUE
} from '../core/types'

const state = {
  actived: '',
  entities: {
    '10001': {
      text: '<p>床前<mark>明月光</mark>，</p><p>疑似<mark>地上霜</mark>，</p><p>舉頭望<mark>明月</mark>，</p><p>低頭思<mark>故鄉</mark>。</p>',
      items: [
        { text: '10002', dialogue: '10002' },
        { text: '10003', dialogue: '10003' },
        { text: '10004', dialogue: '10004' }
      ]
    },
    '10002': { text: '我是 10002。', items: [] },
    '10003': { text: '我是 10003。', items: [] },
    '10004': { text: '我是 10004。', items: [] }
  }
}

const mutations = {
  [SET_ACTIVED_DIALOGUE] (state, dialogueId = '') {
    state.actived = dialogueId
  }
}

export default {
  state,
  mutations
}
