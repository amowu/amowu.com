import {
  SET_ACTIVED_DIALOGUE
} from '../core/types'

const state = {
  actived: '',
  entities: {
    '10001': {
      text: '<p>床前明月光，</p><p>疑似地上霜，</p><p>舉頭望明月，</p><p>低頭思故鄉。</p>',
      next: {
        items: [
          { text: '相思', dialogue: '10002' },
          { text: 'Quick open Rsume', route: '/user/amowu' },
          { text: '離開' }
        ]
      }
    },
    '10002': {
      text: '<p>紅豆生南國，</p><p>春來發幾枝。</p><p>願君多采擷，</p><p>此物最相思。</p>',
      next: {
        items: [
          { text: 'Open Resume', dialogue: '10003' },
          { text: 'Kiss goodbye', dialogue: '10004' }
        ]
      }
    },
    '10003': { text: 'OK, open the Resume', next: { route: '/user/amowu' } },
    '10004': { text: 'OK, kiss you and goodbye', next: { dialogue: '10005' } },
    '10005': { text: 'goodbye', next: {} }
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
