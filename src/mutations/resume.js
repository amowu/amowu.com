const state = {
  'basics': {
    'name': 'Amo Wu',
    'label': 'Front-End Engineer',
    'picture': 'http://www.gravatar.com/avatar/778858b33950746e7049bfc33e94ac50',
    'email': 'amo260@gmail.com',
    'phone': '',
    'website': 'http://amowu.com',
    'blog': 'http://blog.amowu.com',
    'summary': '台灣原生種程序猿 F2E formosanus。待過 4 年遊戲圈的碼農，曾經參與開發 Web MMO RPG（8000 PCU）。目前為專注 Internet 技術的前端攻城獅。',
    'location': {
      'city': 'New Taipei City',
      'countryCode': 'TW'
    },
    'profiles': [{
      'network': 'LinkedIn',
      'url': 'https://www.linkedin.com/in/amowu'
    }, {
      'network': 'GitHub',
      'url': 'https://github.com/amowu'
    }, {
      'network': 'Twitter',
      'url': 'https://twitter.com/amo_wu'
    }, {
      'network': 'Behance',
      'url': 'https://www.behance.net/amo_wu'
    }, {
      'network': 'SlideShare',
      'url': 'http://www.slideshare.net/AMO26'
    }]
  },
  'works': [{
    'company': '遊戲橘子',
    'position': '資深程式設計師',
    'website': 'http://corp.gamania.com',
    'picture': 'http://cdn.amowu.com/1c35290.png',
    'startDate': '2011-04-11',
    'endDate': '2014-08-29',
    'projects': [{
      'name': '末日少女',
      'picture': 'http://cdn.amowu.com/brXTjMsBCR7SjzZfikMWc6uluM0.jpeg',
      'startDate': '2012-08',
      'endDate': '2013-07',
      'summary': '<p>《末日少女》是一款大型多人同時連線角色扮演類型的網頁遊戲（Web MMO RPG）。</p><p>我主要<mark>負責 Client 端的遊戲邏輯與 UI 的程式設計</mark>，需要與 Server 端程式人員配合 API 的介接，持續地與企劃、美術、音效人員保持溝通，面向 PM 展示開發進度，可以說是站在最前線的角色，雖然是一份挑戰性高的工作但卻充滿成就感。</p><p>《末日少女》的開發耗時一年以上，途中遇過遊戲設計全部砍掉重練、組織變動、團隊成員大換血等低潮事件，雖然曾抱遲疑，但我沒放棄並與幾位核心成員持續不斷迭代改善，一起度過這些難關，最終成功上市獲得<mark>最大同時在線人數 8000 人</mark>的好成績，並且<mark>賣給日本知名網站</mark>營運至今。</p><p>在這個專案有幸與一群厲害的人工作，技術部份我<mark>學到了如何參與大型多人專案</mark>，例如 data driven MVC 架構與 event driven 單向資料流架構等，對於日後學習 Angular、React & Redux 等 front-end web development 的概念起到很大的幫助，並且也<mark>學習到如何與 Socket 端程式人員合作撰寫即時連線的程式</mark>。</p><p>除了日常進行的任務之外，我也<mark>主動協助企劃人員開發可以提升他們效率的工具</mark>（例：NPC 對話輸入、翻譯字數價格計算等）。</p>',
      'skills': [{
        'name': 'Flex',
        'color': 'black'
      }, {
        'name': 'Flash',
        'color': 'red'
      }, {
        'name': 'ActionScript 3.0',
        'color': 'red'
      }, {
        'name': 'PureMVC',
        'color': ''
      }, {
        'name': 'Amfphp',
        'color': ''
      }, {
        'name': 'PHP',
        'color': ''
      }, {
        'name': 'MySQL',
        'color': ''
      }, {
        'name': 'Node.js',
        'color': ''
      }, {
        'name': 'Socket.IO',
        'color': ''
      }, {
        'name': 'SVN',
        'color': ''
      }],
      'medias': [{
        'network': 'website',
        'url': 'http://xd.age-corp.jp/dmm/'
      }, {
        'network': 'YouTube',
        'url': 'https://www.youtube.com/watch?v=3URpSS73xlY'
      }, {
        'network': 'Twitter',
        'url': 'https://twitter.com/zombigirl_kari'
      }]
    }, {
      'name': 'Gu Morning 早安咕咕',
      'picture': 'http://cdn.amowu.com/EFSTFWfYlPmWEw5ovcrU3JJ8eM4.jpeg',
      'startDate': '2011-05',
      'endDate': '2012-01',
      'summary': '<p>《Gu Morning 早安咕咕》是一款結合《俄羅斯方塊》要素的益智類型手機遊戲。</p><p>這是我在<mark>新人試用期間負責的專案</mark>，因為主管希望可以降低手機遊戲跨平台的開發成本，所以首次嘗試讓我研究 HTML5 的相關技術。</p><p>在 HTML5 還不成熟的初期階段踩了不少坑，也因此讓我在 JavaScript 的技術上獲得很大的成長，並在<mark>三個月的時間內快速交付出原型</mark>，最後經過大家的努力成功讓《Gu Morning 早安咕咕》在 iOS 與 Android 平台上市，並<mark>成為部門第一款擁有收入來源的產品</mark>。</p><p>在 HTML5 game engine 資源還很缺乏的時期，花了很多精力在尋找合適的方案與<mark>學習如何參與開源社群</mark>，最後找到了 <a href="https://github.com/aduros/hydra" target="_blank">Hydra</a> 這款簡單的 HTML5 game engine，並且在使用 <a href="https://github.com/google/closure-compiler" target="_blank">Google Closure Compiler</a> 當中學習到組織大量 JavaScript 程式碼的技巧。</p><p>為了跨平台，我們使用了 PhoneGap 將 HTML5 運行在 iOS 與 Android 的 WebView 元件上，因為 DOM render 的效能不如原生應用，之後的專案《Gu Morning 早安咕咕 2》引以為鑒，改採 Canvas render 的方式開發，<mark>效能獲得大幅提升</mark>。</p>',
      'skills': [{
        'name': 'HTML5',
        'color': 'orange'
      }, {
        'name': 'CSS3',
        'color': 'blue'
      }, {
        'name': 'JavaScript',
        'color': 'yellow'
      }, {
        'name': 'Hydra',
        'color': ''
      }, {
        'name': 'Google Closure Compiler',
        'color': ''
      }, {
        'name': 'PhoneGap',
        'color': ''
      }, {
        'name': 'SVN',
        'color': ''
      }],
      'medias': [{
        'network': 'iOS',
        'url': 'https://itunes.apple.com/us/app/gu-morning/id474441856?ls=1&mt=8'
      }, {
        'network': 'Android',
        'url': 'https://play.google.com/store/apps/details?id=com.gamania.gumorning'
      }, {
        'network': 'website',
        'url': 'http://corp.gamania.com/mobilegame/gumorning/ch/index.html'
      }, {
        'network': 'YouTube',
        'url': 'https://www.youtube.com/watch?v=RULZzZxLl5U'
      }, {
        'network': 'SlideShare',
        'url': 'http://www.slideshare.net/AMO26/javascript-62068889'
      }, {
        'network': 'SlideShare',
        'url': 'http://www.slideshare.net/AMO26/gumorning'
      }]
    }, {
      'name': '其他專案',
      'picture': '',
      'startDate': '',
      'endDate': '',
      'summary': '<p>算上其它未上市的產品，我在遊戲橘子一共參與過 7 件專案的開發（Facebook Social Game x 2、Mobile Game x 4、Web Game x 1），大部分都是負責 Client 端的程式設計，擁有豐富的 UI & UX 實作經驗。晉升資深程式設計師之後，獲得一次帶領團隊的機會，並以《末日少女》的經驗，協助新團隊建置適合 Unity 的 Client & Server 架構，並在 DevOps 還未盛行的時期就<mark>引入 Git flow 與 Jenkins 來達成 CI & CD 的自動化環境，提升整體開發效率，獲得主管與成員們的讚賞</mark>。</p>',
      'skills': [{
        'name': 'Unity',
        'color': ''
      }, {
        'name': 'C#',
        'color': ''
      }, {
        'name': 'SQLite',
        'color': ''
      }, {
        'name': 'Git',
        'color': ''
      }, {
        'name': 'git-flow',
        'color': ''
      }, {
        'name': 'Python',
        'color': ''
      }, {
        'name': 'Jenkins',
        'color': ''
      }, {
        'name': 'ImpactJS',
        'color': ''
      }],
      'medias': []
    }]
  }],
  'educations': [{
    'institution': '國立台北科技大學',
    'area': '資訊工程系',
    'studyType': '學士',
    'website': 'http://www.ntut.edu.tw',
    'picture': 'http://cdn.amowu.com/015e2ec.png',
    'startDate': '2005-08-01',
    'endDate': '2009-06-20',
    'highlights': [
      '擔任應用英文系工讀生，負責系上網頁架設與維護、英文單字互動遊戲活動的程式設計。',
      '擔任學生輔導中心工讀生，負責活動網頁的設計、動畫製作等工作。'
    ],
    'projects': [{
      'name': 'Little March',
      'picture': 'http://cdn.amowu.com/tAjv.jpeg',
      'startDate': '2012-08',
      'endDate': '2013-07',
      'summary': '<p>這是我的大學畢業專題，一款參考《<a href="http://www.lf2.net/" target="_blank">小朋友齊打交</a>》設計的作品，與原作不同的地方是，《Little March》將 2D 角色結合了 3D 世界場景，並提供最大 4 人即時網路連線對戰功能的格鬥類型遊戲，榮獲實務專題競賽佳作的成績。</p>',
      'skills': [{
        'name': 'C#',
        'color': ''
      }, {
        'name': 'XNA Game Studio',
        'color': ''
      }, {
        'name': '.Net Framework',
        'color': ''
      }, {
        'name': 'SketchUp',
        'color': ''
      }],
      'medias': [{
        'network': 'YouTube',
        'url': 'https://www.youtube.com/watch?v=SUjawFj702M'
      }, {
        'network': 'SlideShare',
        'url': 'http://www.slideshare.net/AMO26/ss-62068992'
      }]
    }, {
      'name': 'Metal Slug 魂斗羅',
      'picture': 'http://cdn.amowu.com/QIPZJIrPMnx6OZcrI7d6g82xZeE.jpeg',
      'startDate': '2011-05',
      'endDate': '2012-01',
      'summary': '<p>這是我在「物件導向程式設計實習」課負責的期末專題，一款參考《<a href="https://zh.wikipedia.org/wiki/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B4%E7%B3%BB%E5%88%97" target="_blank">越南大作戰</a>》設計的 2D 橫向捲軸射擊遊戲，並加入許多惡搞元素，獲得教授與同學的好評，這也是我人生第一款開發完整的遊戲作品。</p>',
      'skills': [{
        'name': 'C++',
        'color': ''
      }],
      'medias': [{
        'network': 'YouTube',
        'url': 'https://www.youtube.com/watch?v=7dOJZarg9TA'
      }, {
        'network': 'SlideShare',
        'url': 'http://www.slideshare.net/AMO26/ss-62069037'
      }]
    }, {
      'name': '其他專案',
      'picture': '',
      'startDate': '',
      'endDate': '',
      'summary': '<p>更多學生時期的作品請參考這份早期的 <a href="https://drive.google.com/open?id=0BxPhtlCrkuIFN2FlZGVmYzEtZDk5Ni00MmZjLTg1ZWUtOWY0ZWE0M2QxODA1" target="_blank"><i class="file pdf outline icon"></i>Resume.pdf</a>。</p>',
      'skills': [
        { 'name': 'C', 'color': '' },
        { 'name': 'C++', 'color': '' },
        { 'name': 'C#', 'color': '' },
        { 'name': 'ASP.NET', 'color': '' },
        { 'name': 'Microsoft SQL Server', 'color': '' },
        { 'name': 'Java', 'color': '' },
        { 'name': 'PHP', 'color': '' },
        { 'name': 'MySQL', 'color': '' },
        { 'name': 'OpenGL', 'color': '' },
        { 'name': 'OpenCV', 'color': '' },
        { 'name': 'Prolog', 'color': '' }
      ],
      'medias': []
    }]
  }],
  'skills': [{
    'name': 'Front-End Web Development',
    'keywords': [{
      'name': 'HTML',
      'highlights': []
    }, {
      'name': 'CSS',
      'highlights': [
        'Bootstrap, Semantic UI, Material Design UI, ...'
      ]
    }, {
      'name': 'JavaScript',
      'highlights': [
        'Node.js, ECMAScript2015, AngularJS, React & Redux, Vue.js & Vuex, ...'
      ]
    }]
  }, {
    'name': 'Game Development',
    'keywords': [{
      'name': 'Flash',
      'highlights': [
        'Flex, ActionScript 3.0, ...'
      ]
    }, {
      'name': 'Unity',
      'highlights': []
    }, {
      'name': 'HTML5',
      'highlights': [
        'ImpactJS, Phaser, ...'
      ]
    }]
  }, {
    'name': 'Cloud Computing',
    'keywords': [{
      'name': 'XaaS',
      'highlights': [
        'Amazon Web Services, Google Cloud Platform‎, ...',
        'Heroku, Parse, Firebase, ...'
      ]
    }, {
      'name': 'Back-End Development',
      'highlights': [
        'RESTful APIs',
        'Relational & NoSQL Database',
        'Serverless & Microservice'
      ]
    }]
  }, {
    'name': 'DevOps',
    'keywords': [{
      'name': 'Continuous Integration & Continuous Delivery',
      'highlights': [
        'Jenkins, CircleCI, ...'
      ]
    }, {
      'name': 'Infrastructure as Code',
      'highlights': [
        'Docker, Vagrant, Terraform, ...'
      ]
    }, {
      'name': 'Git & GitHub workflow',
      'highlights': [
        'Git Flow, Pull Requst, Code Review, Issue Tracking, ...'
      ]
    }, {
      'name': 'Code Quality',
      'highlights': [
        'Coding Style, Unit & E2E Testing, Code Coverage, ...',
        'Yeoman, Grunt, Gulp, Webpack, Babel, ...'
      ]
    }]
  }],
  'projects': {
    'opensource': [{
      'name': 'amowu/slack-bot',
      'summary': '使用 AWS Lambda 打造，專屬自己的聊天機器人，支援 Slack、LINE、Facebook Messenger 平台，目前提供求職資訊、地震提醒、知識查詢、電影資訊、閒話聊天等功能。',
      'network': 'GitHub',
      'url': 'https://github.com/amowu/slack-bot'
    }, {
      'name': 'amowu/alfred-chinese-converter',
      'summary': '使用 Python 與 OpenCC（開放中文轉換）開發的 Alfred 工具，支持簡繁體中文的詞彙級別轉換、異體字轉換以及地區習慣用詞轉換（中國大陸、臺灣、香港）。',
      'network': 'GitHub',
      'url': 'https://github.com/amowu/alfred-chinese-converter'
    }, {
      'name': 'amowu/hkt48-taiwantour',
      'summary': '我為日本少女偶像團體 HKT48 的台灣粉絲俱樂部製作的活動網頁，使用 AngularJS 與 Google Spreadsheet Service 以及 Amazon S3 開發，大幅降低主機與資料的維護成本。',
      'network': 'GitHub',
      'url': 'https://github.com/amowu/hkt48-taiwantour'
    }],
    'contribution': [{
      'name': 'wit-ai/node-wit',
      'summary': '被 Facebook 收購的一家 Bot Engine，我貢獻了一個 fetch API 的 <a href="https://github.com/wit-ai/node-wit/pull/16" target="_blank">Pull Request</a> 已被 merge。',
      'network': 'GitHub',
      'url': 'https://github.com/wit-ai/node-wit'
    }, {
      'name': 'apex/apex',
      'summary': '知名大神 <a href="https://github.com/tj" target="_blank">TJ</a> 的作品，一款可以快速開發 AWS Lambda 的工具，我貢獻了一個 AWS API Gateway 的 <a href="https://github.com/apex/apex/pull/347" target="_blank">錯誤修正</a> 已被 merge。',
      'network': 'GitHub',
      'url': 'https://github.com/apex/apex'
    }, {
      'name': 'este/este',
      'summary': '超過 3000 stars 的專案，使用 React & Redux 生態鏈組成的 univeral application 開發方案，我貢獻了 2 個 <a href="https://github.com/este/este/pull/544" target="_black">錯誤修正</a> 已被 merge。',
      'network': 'GitHub',
      'url': 'https://github.com/este/este'
    }]
  },
  'writing': [{
    'name': 'DevOps：持續整合＆持續交付（Docker、CircleCI、AWS）',
    'network': 'RSS',
    'url': 'http://blog.amowu.com/2015/04/devops-continuous-integration-delivery-docker-circleci-aws-beanstalk.html'
  }, {
    'name': 'Serverless! 使用 AWS 開發 Slack Slash Commands',
    'network': 'RSS',
    'url': 'http://blog.amowu.com/2015/12/serverless-aws-slack-slash-commands.html'
  }, {
    'name': '如何優雅地在 Mac 上使用 dotfiles?',
    'network': 'RSS',
    'url': 'http://blog.amowu.com/2015/01/hacker-guide-to-setting-up-your-mac.html'
  }],
  'speaking': [{
    'name': 'Git & Git flow',
    'network': 'SlideShare',
    'url': 'http://www.slideshare.net/AMO26/git-git-flow-38400470'
  }, {
    'name': 'Trello Organize anything, together',
    'network': 'SlideShare',
    'url': 'http://www.slideshare.net/AMO26/trello-38400403'
  }, {
    'name': 'Productivity Tools',
    'network': 'SlideShare',
    'url': 'http://www.slideshare.net/AMO26/productivity-tool'
  }],
  'languages': [{
    'name': 'Chinese'
  }, {
    'name': 'English'
  }, {
    'name': 'Japanese'
  }]
}

const mutations = {}

export default {
  state,
  mutations
}
