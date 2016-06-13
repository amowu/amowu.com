<script>
  import Resume from '../components/Resume'

  export default {
    methods: {
      close (event) {
        this.$router.go({ path: '/idontwannaseeyourresume' })
      }
    },
    components: {
      Resume
    },
    vuex: {
      getters: {
        resume: state => state.resume
      }
    }
  }
</script>

<template lang="jade">
  resume(
    :picture='resume.basics.picture',
    :name='resume.basics.name',
    :label='resume.basics.label',
    :brief='resume.basics.brief',
    :phone='resume.basics.phone',
    :email='resume.basics.email',
    :website='resume.basics.website',
    :blog='resume.basics.blog',
    :summary='resume.basics.summary',
    :location='resume.basics.location',
    :projects='resume.projects',
    :languages='resume.languages',
    :profiles='resume.basics.profiles',
    :works='resume.works',
    :writing='resume.writing',
    :speaking='resume.speaking',
    :skills='resume.skills',
    :educations='resume.educations',
    :close='close')
</template>
