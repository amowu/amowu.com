<style lang="stylus" scoped>
  #work
    padding-bottom 1em

  @media only screen and (max-width: 767px)
    .logo
      display none
</style>

<script>
  export default {
    props: [
      'works',
      'projects',
      'writing',
      'speaking'
    ]
  }
</script>

<template lang="jade">
  #work
    .ui.massive.blue.ribbon.label
      i.suitcase.icon
      | 工作經歷
    div(v-for='work in works')
      a.logo(:href='work.website', target='_blank')
        img.ui.right.floated.image(:src='work.picture')
      h3.ui.header
        .content
          a(:href='work.website', v-text='work.company', target='_blank')
          //- TODO: company 與 position 之間的空格，不知道有沒有更好的寫法？
          | &nbsp;
          span(v-text='work.position')
          .sub.header
            span(v-text='work.startDate | format')
            span &nbsp;~&nbsp;
            span(v-text='work.endDate | format')
            span （
            span(v-text='work.startDate | to work.endDate')
            span ）
      h4.ui.header
        .content 專案
      .ui.divided.items
        .item(v-for='project in work.projects')
          .image(v-if='project.picture')
            image(:src='project.picture')
          .content
            .header(v-text='project.name')
            .meta(v-if='project.startDate || project.endDate')
              span(v-text='project.startDate | format')
              span &nbsp;~&nbsp;
              span(v-text='project.endDate | format')
            .description(v-html='project.summary')
            .extra
              a(v-for='media in project.medias', :href='media.url', :title='media.network', target='_blank')
                i.icon(:class='media.network | icon')
              .ui.right.floated
                .ui.mini.label(v-for='skill in project.skills', v-text='skill.name', :class='skill.color')
    h4.ui.header 開源專案
    .ui.stackable.two.column.grid
      .column
        .ui.very.relaxed.divided.middle.aligned.list
          .item(v-for='project in projects.opensource')
            i.large.middle.aligned.icon(:class='project.network | lowercase')
            .content
              a.header(:href='project.url', v-text='project.name', target='_black')
              .description(v-html='project.summary')
      .column
        .ui.very.relaxed.divided.middle.aligned.list
          .item(v-for='project in projects.contribution')
            i.large.middle.aligned.icon(:class='project.network | lowercase')
            .content
              a.header(:href='project.url', v-text='project.name', target='_black')
              .description(v-html='project.summary')
    h4.ui.header 技術文章
    .ui.very.relaxed.divided.middle.aligned.list
      .item(v-for='article in writing')
        i.large.icon(:class='article.network | lowercase')
        .content
          a.header(:href='article.url', v-text='article.name', target='_blank')
    h4.ui.header 演講簡報
    .ui.very.relaxed.divided.middle.aligned.list
      .item(v-for='presentation in speaking')
        i.large.icon(:class='presentation.network | lowercase')
        .content
          a.header(:href='presentation.url', v-text='presentation.name', target='_blank')
</template>
