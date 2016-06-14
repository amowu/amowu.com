<style lang="less" scoped>
  @import (optional) "./resume.less";
</style>

<script>
  import is from 'is_js'

  export default {
    props: {
      picture: String,
      name: String,
      label: String,
      brief: String,
      phone: String,
      email: String,
      website: String,
      blog: String,
      location: Object,
      languages: Array,
      profiles: Array,
      summary: String,
      works: Array,
      projects: Object,
      writing: Array,
      speaking: Array,
      skills: Array,
      educations: Array,
      close: Function
    },
    computed: {
      composedLanguages () {
        return this.languages.map(language => language.name).join(', ')
      },
      composedLocation () {
        const { city, countryCode } = this.location

        return [city, countryCode].join(', ')
      },
      iteratableLinks () {
        const { phone, email, website, blog } = this
        return { phone, email, website, blog }
      }
    },
    methods: {
      linkify (text) {
        if (is.email(text)) return `<a href="mailto:${text}">${text}</a>`
        if (is.url(text)) return `<a href="${text}" target="_blank">${text}</a>`
        return `<span>${text}</span>`
      }
    }
  }
</script>

<template lang="jade">
  .modal
    .ui.stackable.two.column.grid
      .four.wide.column
        //- Profile Card
        .ui.card
          //- Avatar Picture
          .image(v-if='picture')
            img(:src="picture + '?s=350'")
          .content
            img.ui.right.floated.mini.image(:src="picture + '?s=350'")
            //- Name
            .header(v-if='name' v-text='name')
            //- Headline
            .meta(v-if='label', v-text='label')
            //- Brief
            .description(v-if='brief', v-text='brief')
            .ui.list
              //- Links(Phone, Email, Website, Blog)
              .item(
                v-for='(key, val) in iteratableLinks',
                v-if='val')
                i.icon(:class='key | icon')
                .content
                  | {{{linkify(val)}}}
              //- Location
              .item
                i.marker.icon
                .content(v-text="composedLocation")
              //- Languages
              .item(v-if='languages.length')
                i.world.icon
                .content(v-text='composedLanguages')
          //- Social Media Links
          .content(v-if='profiles.length')
            a.ui.basic.circular.icon.button(
              v-for='profile in profiles',
              :title='profile.network',
              :href='profile.url',
              target='_blank')
              i.icon(:class='profile.network | icon')
      .twelve.wide.column
        .ui.container
          .ui.segment
            //- Close Button
            a.ui.right.corner.label(@click='close')
              i.remove.icon
            //- About Section
            section
              .ui.red.ribbon.massive.label
                i.user.icon
                | 關於我
              h3.ui.header 簡介
              p(v-html='summary')
            //- Works Experience Section
            section
              .ui.blue.ribbon.massive.label
                i.suitcase.icon
                | 工作經歷
              div(v-for='work in works')
                a(:href='work.website', target='_blank')
                  img.ui.right.floated.image(:src='work.picture')
                h3.ui.header
                  .content
                    a(v-text='work.company', :href='work.website', target='_blank')
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
                        a(v-for='media in project.medias',
                          :href='media.url',
                          :title='media.network',
                          target='_blank')
                          i.icon(:class='media.network | icon')
                        .ui.right.floated
                          .ui.mini.label(
                            v-for='skill in project.skills',
                            v-text='skill.name',
                            :class='skill.color')
              h4.ui.header 開源專案
              .ui.stackable.two.column.grid
                .column
                  .ui.very.relaxed.middle.aligned.divided.list
                    .item(v-for='project in projects.opensource')
                      i.middle.aligned.large.icon(:class='project.network | lowercase')
                      .content
                        a.header(
                          v-text='project.name',
                          :href='project.url',
                          target='_black')
                        .description(v-html='project.summary')
                .column
                  .ui.very.relaxed.middle.aligned.divided.list
                    .item(v-for='project in projects.contribution')
                      i.middle.aligned.large.icon(:class='project.network | lowercase')
                      .content
                        a.header(
                          v-text='project.name',
                          :href='project.url',
                          target='_black')
                        .description(v-html='project.summary')
              h4.ui.header 技術文章
              .ui.very.relaxed.middle.aligned.divided.list
                .item(v-for='article in writing')
                  i.large.icon(:class='article.network | lowercase')
                  .content
                    a.header(
                      v-text='article.name',
                      :href='article.url',
                      target='_blank')
              h4.ui.header 演講簡報
              .ui.very.relaxed.middle.aligned.divided.list
                .item(v-for='presentation in speaking')
                  i.large.icon(:class='presentation.network | lowercase')
                  .content
                    a.header(
                      v-text='presentation.name',
                      :href='presentation.url',
                      target='_blank')
            //- Skills Experience Section
            section
              .ui.orange.ribbon.massive.label
                i.keyboard.icon
                | 技能
              h3.ui.header
                .content 技能清單
              .ui.stackable.two.column.grid
                .column(v-for='skill in skills')
                  .ui.very.relaxed.list
                    .item
                      i.folder.icon
                      .content
                        .header(v-text='skill.name')
                        .list(v-if='skill.keywords.length')
                          .item(v-for='keyword in skill.keywords')
                            i.file.icon
                            .content
                              .header(v-text='keyword.name')
                              .list(v-if='keyword.highlights.length')
                                .item(v-for='highlight in keyword.highlights')
                                  .content
                                    .description(v-text='highlight')
            //- Educations Section
            section
              .ui.green.ribbon.massive.label
                i.student.icon
                | 學歷
              div(v-for='education in educations')
                a(:href='education.website', target='_blank')
                  img.ui.right.floated.image(:src='education.picture')
                h3.ui.header
                  .content
                    a(v-text='education.institution',
                      :href='education.website',
                      target='_blank')
                    | &nbsp;
                    span(v-text="[education.area, education.studyType].join(' ')")
                    .sub.header
                      span(v-text='education.startDate | format')
                      span &nbsp;~&nbsp;
                      span(v-text='education.endDate | format')
                ul.ui.list
                div
                  li(v-for='highlight in education.highlights', v-text='highlight')
                  h4.ui.header
                    .content 專案
                  .ui.divided.items
                    .item(v-for='project in education.projects')
                      .image(v-if='project.picture')
                        image(:src='project.picture')
                      .content
                        .header(v-text='project.name')
                        .meta(v-if='project.startDate || project.endDate')
                          span August 2012 – July 2013
                        .description(v-html='project.summary')
                        .extra
                          a(v-for='media in project.medias',
                            :href='media.url',
                            target='_blank')
                            i.icon(:class='media.network | icon')
                          .ui.right.floated
                            .ui.mini.label(
                              v-for='skill in project.skills',
                              v-text='skill.name',
                              :class='skill.color')
          img.ui.right.floated.medium.image(src='http://cdn.amowu.com/sign.png')
</template>
