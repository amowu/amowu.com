<style lang="stylus" scoped>
  @import '~semantic-ui/dist/semantic.css'

  #resume
    margin 0
    background-color #f3f4f5
  #profile-container
    padding-right 0
  #profile
    margin-left auto

  @media only screen and (max-width: 767px)
    .ui.stackable.grid > .wide.column
      .ui.card
        width 100% !important
        border-radius 0
    #component-container
      padding-top 0 !important
      padding-left 0 !important
      padding-right 0 !important

  @media only screen and (min-width: 1200px)
    #component-container
      & .ui.container
        margin-left 0 !important
</style>

<script>
  import CV from '../../components/resume/CV'
  import ProfileCard from '../../components/resume/ProfileCard'

  export default {
    components: {
      cv: CV,
      ProfileCard
    },
    vuex: {
      getters: {
        resume: state => state.resume
      }
    }
  }
</script>

<template lang="jade">
  #resume.ui.two.column.stackable.grid
    #profile-container.four.wide.column
      profile-card#profile(
        :name='resume.basics.name',
        :label='resume.basics.label',
        :picture='resume.basics.picture',
        :email='resume.basics.email',
        :phone='resume.basics.phone',
        :website='resume.basics.website',
        :blog='resume.basics.blog',
        :brief='resume.basics.brief',
        :location='resume.basics.location',
        :profiles='resume.basics.profiles',
        :languages='resume.languages')
    #component-container.twelve.wide.column
      cv(
        :summary='resume.basics.summary',
        :works='resume.works',
        :projects='resume.projects',
        :writing='resume.writing',
        :speaking='resume.speaking',
        :skills='resume.skills',
        :educations='resume.educations')
</template>
