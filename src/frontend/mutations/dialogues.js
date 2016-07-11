import {
  SET_ACTIVED_DIALOGUE
} from '../core/type'

const state = {
  actived: '',
  entities: {
    '10001': {
      text: '<p>嗨，你好！我是 <span style="color: yellow">Amo Wu</span>，一隻喜歡寫程式的台灣原生種程序猿。🙈</p><p>曾經待過 3 年以上遊戲圈的碼農🤓，並參與開發 8000+ PCU 的 Web MMO RPG，擁有豐富的 RIA 經驗。</p><i class="ellipsis horizontal icon"></i><i class="sort descending icon"></i>',
      next: { dialogue: '10002' }
    },
    '10002': {
      text: '<p>目前是一位專注於 Internet 雲端＆前端相關技術的攻城獅。🦁</p><p>同時我也正在找一份工作，如果您對我的履歷有興趣，歡迎隨時聯絡我！謝謝。😊</p>',
      next: {
        items: [
          { text: '打開履歷表', route: '/user/amowu' },
          { text: '結束對話', dialogue: '10003' }
        ]
      }
    },
    '10003': {
      text: 'OK，有機會我們再多聊聊。😘',
      next: {}
    },
    '10004': {
      text: '<p>⋯⋯嗯！？😳</p><p>難道說⋯⋯你看得見我？？🤔</p><i class="ellipsis horizontal icon"></i><i class="sort descending icon"></i>',
      next: { dialogue: '10005' }
    },
    '10005': {
      text: '<p>這位大俠請留步。不得了，不得了！你有道靈光從天靈蓋噴出來，你知道嗎？😮</p><p>年紀輕輕的，就有一身橫練的筋骨⋯⋯簡直是百年難得一見的<del>敲碼</del>練武奇才！</p><p>如果有一天，讓你打通任督二脈，那還不飛天啊！😱</p><i class="ellipsis horizontal icon"></i><i class="sort descending icon"></i>',
      next: { dialogue: '10006' }
    },
    '10006': {
      text: '<p>正所謂　我不入地獄，誰入地獄，警惡懲奸，維護世界和平這任務就交給你了，好不好？</p>',
      next: {
        items: [
          { text: '你是誰？', dialogue: '10007' },
          { text: '好！😋', dialogue: '10008' },
          { text: '我只是來發個 Issue 的', dialogue: '10009' },
          { text: '很明顯我就是那個人，但 GitHub 是啥？', dialogue: '10010' },
          { text: '結束對話', dialogue: '10011' }
        ]
      }
    },
    '10007': {
      text: '<p>我是 Octocat，台語讀作<ruby>章<rt>ㄊㄚ</rt>魚<rt>ㄎㄡˇ</rt>貓<rt>ㄋㄧㄠ</rt></ruby>。負責維護這個世界秩序的國王。😎</p><i class="ellipsis horizontal icon"></i><i class="sort descending icon"></i>',
      next: {
        items: [
          { text: '好吧，然後咧？', dialogue: '10006' },
          { text: '你是國王？那我不就你皇祖母', dialogue: '10011' }
        ]
      }
    },
    '10008': {
      text: '<p>我這有個 GitHub Repo 是無價之寶，你我有緣，就不跟你收錢，我們一起來 Contribute 吧！</p>',
      next: {
        items: [
          { text: '打開 GitHub Repo', url: 'https://github.com/amowu/amowu.com' },
          { text: 'GitHub 是啥？', dialogue: '10011' },
          { text: '離開對話', dialogue: '10011' }
        ]
      }
    },
    '10009': {
      text: '<p>⋯⋯前方右轉不送<i class="external icon"></i>🙄</p>',
      next: { url: 'https://github.com/amowu/amowu.com/issues' }
    },
    '10010': {
      text: '<p>⋯⋯很明顯你不是。😒</p>', next: {}
    },
    '10011': {
      text: '<p>⋯⋯寶寶心裡苦，但寶寶不說。☹️</p>', next: {}
    },
    '10012': {
      text: '<p>前面是通往<mark>天龍國</mark>的道路，像你這種來歷不明的訪客是無法通行的，等你申請到<mark>鄉民證</mark>之後再過來吧。</p>',
      next: {
        items: [
          { text: '什麼是鄉民證？', dialogue: '10013' },
          { text: '結束對話' }
        ]
      }
    },
    '10013': {
      text: '<p>鄉民證是一張能夠證明你身份、世界通用的憑證，需要去各地方的<mark>村長家</mark>辦理申請。</p>',
      next: {
        items: [
          { text: '村長家在哪？', dialogue: '10014' },
          { text: '我知道了' }
        ]
      }
    },
    '10014': {
      text: '<p>很遺憾，這個小鎮的村長家正在整修中，不便之處敬請原諒。</p>',
      next: {}
    },
    '10015': {
      text: '<p>看見我們盾牌上的徽章嗎？傳說中這些是代表創建這個世界的眾神⋯⋯</p><p><sapn style="color: #03A9F4;">藍色</sapn>代表的是掌管美麗之神，聽說在世界各地供奉的形象都不同⋯⋯。😅</p><p><span style="color: #FF9800;">橘色</span>代表的是掌管秩序之神。</p><p><span style="color: #FFEB3B;">黃色</span>代表的是掌管靈魂之神，聽說在世界各地還延伸出各種不同教義的對立信仰。😨</p>',
      next: {}
    },
    '10016': {
      text: '<p><mark>天龍國</mark>很繁華喲，有高大的城堡、熱鬧的城下町，雖然我還是比較喜歡人情味濃的<mark>地虎國</mark>⋯⋯。有機會的話一定要去走走！😊</p>',
      next: {}
    },
    '10017': {
      text: '<p>⋯⋯難得今天沒有下雨呢。</p><p>咦！沒見過的生面孔耶，你好啊！😄</p>',
      next: {
        items: [
          { text: '你好，請問這裡是哪呢？', dialogue: '10018' },
          { text: '你在這裡做什麼呢？', dialogue: '10019' },
          { text: '結束對話', dialogue: '10020' }
        ]
      }
    },
    '10018': {
      text: '<p>這裡是一個被稱作<mark>若雨鎮</mark>的小村鎮。</p><p>因為常常下雨的關係⋯⋯不過從這裡可以前往<mark>天龍國</mark>和<mark>香蔥鎮</mark>兩個地方喲！同時兼具都市機能與休閒度假，所以我很喜歡。😘</p>',
      next: {
        items: [
          { text: '你在這裡做什麼呢？', dialogue: '10019' },
          { text: '結束對話', dialogue: '10020' }
        ]
      }
    },
    '10019': {
      text: '<p>據說只要在這口池許願，就能遇見自己的情人，我的白馬王子到底什麼時候才會出現呢⋯⋯？</p>',
      next: {}
    },
    '10020': {
      text: '<p>祝妳玩得愉快。☺️</p>',
      next: {}
    },
    '10021': {
      text: '<p>前陣子的大雨土石流把這顆石頭給沖下來，導致<mark>雲杉洞穴</mark>的入口被堵住了⋯⋯</p>',
      next: {
        items: [
          { text: '雲杉洞穴是？', dialogue: '10022' },
          { text: '結束對話', dialogue: '10023' }
        ]
      }
    },
    '10022': {
      text: '<p>我身後這座<mark>白玉山</mark>，是橫貫<mark>福爾摩沙大陸</mark>的山脈，平時要去北方城鎮都必須經由這口隧道通行⋯⋯</p><i class="ellipsis horizontal icon"></i><i class="sort descending icon"></i>',
      next: { dialogue: '10023' }
    },
    '10023': {
      text: '<p>現在沒辦法去<mark>香蔥鎮</mark>玩了！大家真的要好好愛護環境啊⋯⋯。😭</p>',
      next: {}
    },
    '10024': {
      text: '<p>我們曾是勇於冒險挑戰的海洋民族⋯⋯</p><p>越過這片大海之後就是更寬廣的世界了⋯⋯。</p>',
      next: {}
    }
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
