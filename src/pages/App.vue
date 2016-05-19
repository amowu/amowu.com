<style lang='scss' scope>
  @import '~semantic-ui/dist/semantic.css';

  #app {
    margin: 0;
    background-color: #f3f4f5;
  }
  #profile-container {
    padding-right: 0;
  }
  @media only screen and (min-width: 1200px) {
    #component-container {
      & .ui.container {
        margin-left: 0 !important;
      }
    }
  }
  #profile {
    margin-left: auto;
  }
</style>

<script>
  import store from '../core/store'

  export default {
    store,
    ready () {
      this.$http({
        url: 'https://raw.githubusercontent.com/amowu/resume/gh-pages/resume.json',
        method: 'GET'
      }).then(response => {
        console.log(response)
      }, response => {
        console.log(response)
      })
    }
  }
</script>

<template lang='jade'>
  #app.ui.two.column.stackable.grid
    #profile-container.four.wide.column
      //- TODO: ProfileCard component
      #profile.ui.card
        //- profile avatar
        .image
          img(src='http://www.gravatar.com/avatar/778858b33950746e7049bfc33e94ac50?s=350')
        //- profile info
        .content
          .header Amo Wu
          .meta Front-End Developer
          .description 台灣原生種程序猿 F2E formosanus。待過 4 年遊戲圈的碼農，曾經參與開發 Web MMO RPG (8000 PCU)。目前為專注網頁技術的前端攻城獅。
          .ui.list
            .item
              i.phone.icon
              .content Phone
            .item
              i.mail.icon
              .content
                a(href='mailto:amo260@gmail.com') amo260@gmail.com
            .item
              i.comment.icon
              .content IM
            .item
              i.linkify.icon
              .content
                a(href='http://amowu.com') amowu.com
            .item
              i.rss.icon
              .content
                a(href='http://blog.amowu.com') blog.amowu.com
            .item
              i.marker.icon
              .content New Taipei City, Taiwan
            .item
              i.world.icon
              .content Chinese, English, Japanese
        //- social media
        .content
          a.ui.circular.basic.icon.button(title='LinkedIn', href='https://www.linkedin.com/in/amowu', target='_black')
            i.linkedin.icon
          a.ui.circular.basic.icon.button(title='GitHub', href='https://github.com/amowu', target='_black')
            i.icon.github
          a.ui.circular.basic.icon.button(title='Twitter', href='https://twitter.com/amo_wu', target='_black')
            i.twitter.icon
          a.ui.circular.basic.icon.button(title='Behance', href='https://www.behance.net/amo_wu', target='_black')
            i.icon.behance
          a.ui.circular.basic.icon.button(title='SlideShare', href='http://www.slideshare.net/AMO26', target='_black')
            i.icon.slideshare
    #component-container.twelve.wide.column
      router-view
    //- TODO: sign footer
</template>
