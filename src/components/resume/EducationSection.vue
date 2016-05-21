<style scoped>
  @media only screen and (max-width: 767px) {
    .logo {
      display: none;
    }
  }
</style>

<script>
  export default {
    props: [
      'educations'
    ]
  }
</script>

<template lang='jade'>
  div
    .ui.massive.green.ribbon.label
      i.student.icon
      | 學歷
    div(v-for='education in educations')
      a.logo(:href='education.website', target='_blank')
        img.ui.right.floated.image(:src='education.picture')
      h3.ui.header
        .content
          a(:href='education.website', v-text='education.institution', target='_blank')
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
                a(v-for='media in project.medias', :href='media.url', target='_blank')
                  i.icon(:class='media.network | icon')
                .ui.right.floated
                  .ui.mini.label(v-for='skill in project.skills', v-text='skill.name', :class='skill.color')
</template>