<template lang='jade'>
  //- TODO: Resume component
  .ui.container
    .ui.segment
      .ui.massive.red.ribbon.label
        i.user.icon
        | 關於我 ABOUT
      h3.ui.header 簡介
      p 小時候夢想成為一位創作藝術家，因為憧憬製作遊戲而一頭栽進程式設計的世界，一路從高職到大學畢業都是攻讀資訊工程學科系，退伍之後順利進入遊戲公司，累積<mark>三年以上 Web & Game 相關工作經驗</mark>，<mark>熟悉 Flash、HTML5 等 RIA 相關技術</mark>，目前<mark>專注於 Front-End Web Development</mark>，並持續關注 Serverless Cloud Computing 與 DevOps 相關議題。
      //- WORK EXPERIENCE
      .ui.massive.blue.ribbon.label
        i.suitcase.icon
        | 工作經歷 WORK EXPERIENCE
      //- Gamania
      div
      a(href='http://corp.gamania.com/', target='_blank')
        img.ui.right.floated.image(src='https://media.licdn.com/media/p/8/005/0a4/33c/1c35290.png')
      h3.ui.header
        .content
          a(href='http://corp.gamania.com/', target='_blank') 遊戲橘子
          |  資深程式設計師
          .sub.header
            span 2011 年 4 月 - 2014 年 8 月
            span （3 年 4 個月）
      h4.ui.header
        .content 專案
      .ui.divided.items
        .item
          .image
            image(src='https://media.licdn.com/media-proxy/ext?w=480&h=360&f=&hash=brXTjMsBCR7SjzZfikMWc6uluM0%3D&ora=1%2CaFBCTXdkRmpGL2lvQUFBPQ%2CxAVta9Er0Vjkig8Tzxtv46GM4lm5qxRyd5LvMTeiE3nD5Y3BNCK_KIKDPaz75Ao')
          .content
            .header 末日少女
            .meta
              span 2012 年 8 月 – 2013 年 7 月
            .description
              p 《末日少女》是一款大型多人同時連線角色扮演類型的網頁遊戲（Web MMO RPG）。
              p 我主要<mark>負責 Client 端的遊戲邏輯與 UI 的程式設計</mark>，需要與 Server 端程式人員配合 API 的介接，持續地與企劃、美術、音效人員保持溝通，面向 PM 展示開發進度，可以說是站在最前線的角色，雖然是一份挑戰性高的工作但卻充滿成就感。
              p 《末日少女》的開發耗時一年以上，途中遇過遊戲設計全部砍掉重練、組織變動、團隊成員大換血等低潮事件，雖然曾抱遲疑，但我沒放棄並與幾位核心成員持續不斷迭代改善，一起度過這些難關，最終成功上市獲得<mark>最大同時在線人數 8000 人</mark>的好成績，並且<mark>賣給日本知名網站</mark>營運至今。
              p 在這個專案有幸與一群厲害的人工作，技術部份我<mark>學到了如何參與大型多人專案</mark>，例如 data driven MVC 架構與 event driven 單向資料流架構等，對於日後學習 Angular、React & Redux 等 front-end web development 的概念起到很大的幫助，並且也<mark>學習到如何與 Socket 端程式人員合作撰寫即時連線的程式</mark>。
              p 除了日常進行的任務之外，我也<mark>主動協助企劃人員開發可以提升他們效率的工具</mark>（例：NPC 對話輸入、翻譯字數價格計算等）。
            .extra
              a(href='http://xd.age-corp.jp/dmm/', target='_blank')
                i.linkify.icon
              a(href='https://www.youtube.com/watch?v=3URpSS73xlY', target='_blank')
                i.youtube.play.icon
              a(href='https://twitter.com/zombigirl_kari', target='_blank')
                i.twitter.icon
              .ui.right.floated
                .ui.black.mini.label Flex
                .ui.red.mini.label Flash
                .ui.red.mini.label ActionScript 3.0
                .ui.mini.label PureMVC
                .ui.mini.label Amfphp
                .ui.mini.label PHP
                .ui.mini.label MySQL
                .ui.mini.label Node.js
                .ui.mini.label Socket.IO
                .ui.mini.label SVN
        .item
          .image
            image(src='https://media.licdn.com/media-proxy/ext?w=480&h=360&f=&hash=EFSTFWfYlPmWEw5ovcrU3JJ8eM4%3D&ora=1%2CaFBCTXdkRmpGL2lvQUFBPQ%2CxAVta9Er0Vjkig8Tzxtv46GM4lm5q3dvepaFBXP5KlOi5Y3BNCK_KIKDPaz75Ao')
          .content
            .header Gu Morning 早安咕咕
            .meta
              span 2011 年 5 月 – 2012 年 1 月
            .description
              p 《Gu Morning 早安咕咕》是一款結合《俄羅斯方塊》要素的益智類型手機遊戲。
              p 這是我在<mark>新人試用期間負責的專案</mark>，因為主管希望可以降低手機遊戲跨平台的開發成本，所以首次嘗試讓我研究 HTML5 的相關技術。
              p 在 HTML5 還不成熟的初期階段踩了不少坑，也因此讓我在 JavaScript 的技術上獲得很大的成長，並在<mark>三個月的時間內快速交付出原型</mark>，最後經過大家的努力成功讓《Gu Morning 早安咕咕》在 iOS 與 Android 平台上市，並<mark>成為部門第一款擁有收入來源的產品</mark>。
              p 在 HTML5 game engine 資源還很缺乏的時期，花了很多精力在尋找合適的方案與<mark>學習如何參與開源社群</mark>，最後找到了 <a href='https://github.com/aduros/hydra' target='_blank'>Hydra</a> 這款簡單的 HTML5 game engine，並且在使用 <a href='https://github.com/google/closure-compiler' target='_blank'>Google Closure Compiler</a> 當中學習到組織大量 JavaScript 程式碼的技巧。
              p 為了跨平台，我們使用了 PhoneGap 將 HTML5 運行在 iOS 與 Android 的 WebView 元件上，因為 DOM render 的效能不如原生應用，之後的專案《Gu Morning 早安咕咕 2》引以為鑒，改採 Canvas render 的方式開發，<mark>效能獲得大幅提升</mark>。
            .extra
              a(href='https://itunes.apple.com/us/app/gu-morning/id474441856?ls=1&mt=8', target='_blank')
                i.apple.icon
              a(href='https://play.google.com/store/apps/details?id=com.gamania.gumorning', target='_blank')
                i.android.icon
              a(href='http://corp.gamania.com/mobilegame/gumorning/ch/index.html', target='_blank')
                i.linkify.icon
              a(href='https://www.youtube.com/watch?v=RULZzZxLl5U', target='_blank')
                i.youtube.play.icon
              a(href='http://www.slideshare.net/AMO26/javascript-62068889', target='_blank')
                i.slideshare.icon
              a(href='http://www.slideshare.net/AMO26/gumorning', target='_blank')
                i.slideshare.icon
              .ui.right.floated
                .ui.orange.mini.label HTML5
                .ui.blue.mini.label CSS3
                .ui.yellow.mini.label JavaScript
                .ui.mini.label Hydra
                .ui.mini.label Google Closure Compiler
                .ui.mini.label PhoneGap
                .ui.mini.label SVN
      h4.ui.header
        .content 其他專案
      .ui.divided.items
        .item
          .content
            .description
              p 算上其它未上市的產品，我在遊戲橘子一共參與過 7 件專案的開發（Facebook Social Game x 2、Mobile Game x 4、Web Game x 1），大部分都是負責 Client 端的程式設計，擁有豐富的 UI & UX 實作經驗。晉升資深程式設計師之後，獲得一次帶領團隊的機會，並以《末日少女》的經驗，協助新團隊建置適合 Unity 的 Client & Server 架構，並在 DevOps 還未盛行的時期就<mark>引入 Git flow 與 Jenkins 來達成 CI & CD 的自動化環境，提升整體開發效率，獲得主管與成員們的讚賞</mark>。
            .extra
              .ui.right.floated
                .ui.mini.label Unity
                .ui.mini.label C#
                .ui.mini.label SQLite
                .ui.mini.label Git
                .ui.mini.label git-flow
                .ui.mini.label Python
                .ui.mini.label Jenkins
                .ui.mini.label ImpactJS
      h4.ui.header 演講簡報
      .ui.very.relaxed.divided.middle.aligned.list
        .item
          i.large.slideshare.icon
          .content
            a.header(href='http://www.slideshare.net/AMO26/git-git-flow-38400470', target='_blank') Git & Git flow
        .item
          i.large.slideshare.icon
          .content
            a.header(href='http://www.slideshare.net/AMO26/trello-38400403', target='_blank') Trello Organize anything, together
        .item
          i.large.slideshare.icon
          .content
            a.header(href='http://www.slideshare.net/AMO26/productivity-tool', target='_blank') Productivity Tools
      h4.ui.header 開源專案
      .ui.stackable.two.column.grid
        .column
          .ui.very.relaxed.divided.middle.aligned.list
            .item
              i.large.github.middle.aligned.icon
              .content
                a.header(href='https://github.com/amowu/hkt48-taiwantour', target='_black') amowu/hkt48-taiwantour
                .description 我為日本少女偶像團體 HKT48 的台灣粉絲俱樂部製作的活動網頁，使用 AngularJS 與 Google Spreadsheet Service 以及 Amazon S3 開發，大幅降低主機與資料的維護成本。
            .item
              i.large.github.middle.aligned.icon
              .content
                a.header(href='https://github.com/amowu/slack-bot', target='_black') amowu/slack-bot
                .description 使用 AWS Lambda 打造，專屬自己的聊天機器人，支援 Slack、LINE、Facebook Messenger 平台，目前提供求職資訊、地震提醒、知識查詢、電影資訊、閒話聊天等功能。
            .item
              i.large.github.middle.aligned.icon
              .content
                a.header(href='https://github.com/amowu/alfred-chinese-converter', target='_black') amowu/alfred-chinese-converter
                .description 使用 Python 與 OpenCC（開放中文轉換）開發的 Alfred 工具，支持簡繁體中文的詞彙級別轉換、異體字轉換以及地區習慣用詞轉換（中國大陸、臺灣、香港）。
        .column
          .ui.very.relaxed.divided.middle.aligned.list
            .item
              i.large.github.middle.aligned.icon
              .content
                a.header(href='https://github.com/wit-ai/node-wit', target='_blank') wit-ai/node-wit
                .description 被 Facebook 收購的一家 Bot Engine，我貢獻了一個 fetch API 的 <a href='https://github.com/wit-ai/node-wit/pull/16' target='_blank'>Pull Request</a> 已被 merge。
            .item
              i.large.github.middle.aligned.icon
              .content
                a.header(href='https://github.com/apex/apex', target='_blank') apex/apex
                .description 知名大神 <a href='https://github.com/tj' target='_blank'>TJ</a> 的作品，一款可以快速開發 AWS Lambda 的工具，我貢獻了一個 AWS API Gateway 的 <a href='https://github.com/apex/apex/pull/347' target='_blank'>錯誤修正</a> 已被 merge。
            .item
              i.large.github.middle.aligned.icon
              .content
                a.header(href='https://github.com/este/este', target='_black') este/este
                .description 超過 3000 stars 的專案，使用 React & Redux 生態鏈組成的 univeral application 開發方案，我貢獻了 2 個 <a href='https://github.com/este/este/pull/544' target='_black'>錯誤修正</a> 已被 merge。
      h4.ui.header 技術文章
      .ui.very.relaxed.divided.middle.aligned.list
        .item
          i.large.rss.icon
          .content
            a.header(href='http://blog.amowu.com/2015/04/devops-continuous-integration-delivery-docker-circleci-aws-beanstalk.html', target='_blank') DevOps：持續整合＆持續交付（Docker、CircleCI、AWS）
        .item
          i.large.rss.icon
          .content
            a.header(href='http://blog.amowu.com/2015/12/serverless-aws-slack-slash-commands.html', target='_blank') Serverless! 使用 AWS 開發 Slack Slash Commands
        .item
          i.large.rss.icon
          .content
            a.header(href='http://blog.amowu.com/2015/01/hacker-guide-to-setting-up-your-mac.html', target='_blank') 如何優雅地在 Mac 上使用 dotfiles?
      .ui.massive.orange.ribbon.label
        i.keyboard.icon
        | 技能 SKILLS
      .ui.very.relaxed.middle.aligned.list
        .item
          i.folder.icon
          .content
            .header Front-End Web Development
            .list
              .item
                i.file.icon
                .content
                  .header HTML
              .item
                i.file.icon
                .content
                  .header CSS
                  .list
                    .item
                      .content
                        .description Bootstrap, Semantic UI, Material Design UI, ...
              .item
                i.file.icon
                .content
                  .header JavaScript
                  .list
                    .item
                      .content
                        .description Node.js, ECMAScript2015, AngularJS, React & Redux, Vue.js & Vuex, ...
        .item
          i.folder.icon
          .content
            .header Game Development
            .list
              .item
                i.file.icon
                .content
                  .header Flash
                  .list
                    .item
                      .content
                        .description Flex, ActionScript 3.0, ...
              .item
                i.file.icon
                .content
                  .header Unity
              .item
                i.file.icon
                .content
                  .header HTML5
                  .list
                    .item
                      .content
                        .description ImpactJS, Phaser, ...
        .item
          i.folder.icon
          .content
            .header Cloud Computing
            .list
              .item
                i.file.icon
                .content
                  .header XaaS
                  .list
                    .item
                      .content
                        .description Amazon Web Services, Google Cloud Platform‎, ...
                    .item
                      .content
                        .description Heroku, Parse, Firebase, ...
              .item
                i.file.icon
                .content
                  .header Back-End Development
                  .list
                    .item
                      .content
                        .description RESTful APIs
                    .item
                      .content
                        .description Relational & NoSQL Database
                    .item
                      .content
                        .description Serverless Microservice
        .item
          i.folder.icon
          .content
            .header DevOps
            .list
              .item
                i.file.icon
                .content
                  .header Continuous Integration & Continuous Delivery
                  .list
                    .item
                      .content
                        .description Jenkins, CircleCI, ...
              .item
                i.file.icon
                .content
                  .header Infrastructure as Code
                  .list
                    .item
                      .content
                        .description Docker, Vagrant, Terraform, ...
              .item
                i.file.icon
                .content
                  .header Git & GitHub workflow
                  .list
                    .item
                      .content
                        .description Git Flow, Pull Requst, Code Review, Issue Tracking, ...
              .item
                i.file.icon
                .content
                  .header Code Quality
                  .list
                    .item
                      .content
                        .description Coding Style, Unit & E2E Testing, Code Coverage, ...
                    .item
                      .content
                        .description Yeoman, Grunt, Gulp, Webpack, Babel, ...
      .ui.massive.green.ribbon.label
        i.student.icon
        | 學歷 EDUCATION
      div
      a(href='http://www.ntut.edu.tw/', target='_blank')
        img.ui.right.floated.image(src='https://media.licdn.com/mpr/mpr/shrink_100_100/p/6/005/0a5/02d/015e2ec.png')
      h3.ui.header
        .content
          a(href='http://www.ntut.edu.tw/', target='_blank') 國立台北科技大學
          |  資訊工程系 學士
          .sub.header
            span 2005 年 8 月 - 2009 年 6 月
      ul.ui.list
        li 擔任應用英文系工讀生，負責系上網頁架設與維護、英文單字互動遊戲活動的程式設計。
        li 擔任學生輔導中心工讀生，負責活動網頁的設計、動畫製作等工作。
      h4.ui.header
        .content 專案
      .ui.divided.items
        .item
          .image
            image(src='https://media.licdn.com/media-proxy/ext?w=480&h=360&f=&hash=QIPZJIrPMnx6OZcrI7d6g82xZeE%3D&ora=1%2CaFBCTXdkRmpGL2lvQUFBPQ%2CxAVta9Er0Vjkig8Tzxtv46GM4lm5q3RyT4PLJGqmWyfX5Y3BNCK_KIKDPaz75Ao')
          .content
            .header Little March
            .meta
              span August 2012 – July 2013
            .description
              p 這是我的大學畢業專題，一款參考《<a href='http://www.lf2.net/' target='_blank'>小朋友齊打交</a>》設計的作品，與原作不同的地方是，《Little March》將 2D 角色結合了 3D 世界場景，並提供最大 4 人即時網路連線對戰功能的格鬥類型遊戲，榮獲實務專題競賽佳作的成績。
            .extra
              a(href='https://www.youtube.com/watch?v=SUjawFj702M', target='_blank')
                i.youtube.play.icon
              a(href='http://www.slideshare.net/AMO26/ss-62068992', target='_blank')
                i.slideshare.icon
              .ui.right.floated
                .ui.mini.label C#
                .ui.mini.label XNA Game Studio
                .ui.mini.label .Net Framework
                .ui.mini.label SketchUp
        .item
          .image
            image(src='https://media.licdn.com/media-proxy/ext?w=480&h=360&f=&hash=tAjv%2BlYI5reaz4bEP%2FoPKktrfZw%3D&ora=1%2CaFBCTXdkRmpGL2lvQUFBPQ%2CxAVta9Er0Vjkig8Tzxtv46GM4lm5qxBDaqjmA3L2UkHb5Y3BNCK_KIKDPaz75Ao')
          .content
            .header Metal Slug 魂斗羅
            .meta
              span May 2011 – January 2012
            .description
              p 這是我在「物件導向程式設計實習」課負責的期末專題，一款參考《<a href='https://zh.wikipedia.org/wiki/%E5%90%88%E9%87%91%E5%BC%B9%E5%A4%B4%E7%B3%BB%E5%88%97' target='_blank'>越南大作戰</a>》設計的 2D 橫向捲軸射擊遊戲，並加入許多惡搞元素，獲得教授與同學的好評，這也是我人生第一款開發完整的遊戲作品。
            .extra
              a(href='https://www.youtube.com/watch?v=7dOJZarg9TA', target='_blank')
                i.youtube.play.icon
              a(href='http://www.slideshare.net/AMO26/ss-62069037', target='_blank')
                i.slideshare.icon
              .ui.right.floated
                .ui.mini.label C++
        .item
          .content
            .description
              h4.ui.heder 其他專案
              p 更多學生時期的作品請參考這份早期的 <a href='https://drive.google.com/open?id=0BxPhtlCrkuIFN2FlZGVmYzEtZDk5Ni00MmZjLTg1ZWUtOWY0ZWE0M2QxODA1' target='_blank'><i class='file pdf outline icon'></i>Resume.pdf</a>。
            .extra
              .ui.right.floated
                .ui.mini.label C
                .ui.mini.label C++
                .ui.mini.label C#
                .ui.mini.label ASP.NET
                .ui.mini.label Microsoft SQL Server
                .ui.mini.label Java
                .ui.mini.label PHP
                .ui.mini.label MySQL
                .ui.mini.label OpenGL
                .ui.mini.label OpenCV
                .ui.mini.label Prolog
</template>
