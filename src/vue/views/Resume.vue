<style lang="less" scoped>
  @import  (reference) "~semantic-ui-less/themes/default/globals/site.variables";

  #resume-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  #resume {
    position: relative;
    margin: 0;
  }
  #profile-container {
    padding-right: 0;
  }
  #profile {
    margin-left: auto;
  }

  @media only screen and (max-width: @largestMobileScreen) {
    #component-container {
      padding-top: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .ui.card {
      width: 100% !important;
      border-radius: 0;
    }
  }

  @media only screen and (min-width: @largestLargeMonitor) {
    #component-container {
      & .ui.container {
        margin-left: 0 !important;
      }
    }
  }
</style>

<script>
  import CV from '../components/resume/CV'
  import ProfileCard from '../components/resume/ProfileCard'

  export default {
    components: {
      cv: CV,
      ProfileCard
    },
    vuex: {
      getters: {
        resume: state => state.resume
      }
    },
    methods: {
      close (event) {
        this.$router.go({ path: '/idontwannaseeyourresume' })
      },
      backdrop (event) {
        const id = event.target.id
        if (id === 'resume' || id === 'profile-container' || id === 'component-container') {
          this.close()
        }
      }
    },
    ready () {
      window.addEventListener('click', this.backdrop, false)
    },
    beforeDestroy () {
      window.removeEventListener('click', this.backdrop, false)
    }
  }
</script>

<template lang="jade">
  #resume-modal
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
          :educations='resume.educations',
          :close='close')
</template>
