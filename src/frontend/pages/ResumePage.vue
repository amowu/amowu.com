<script>
  import { fetchUserResume } from '../actions/resume'
  import Resume from '../components/Resume'
  import resumeZhTw from '../data/resume-zhtw'

  export default {
    methods: {
      close (event) {
        this.$router.go({ path: '/idontwannaseeyourresume' })
      }
    },
    components: {
      Resume
    },
    route: {
      data (transition) {
        return this.fetchUserResume('amowu')
      }
    },
    vuex: {
      actions: {
        fetchUserResume
      },
      getters: {
        resume: state => resumeZhTw
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
    :location='resume.basics.location',
    :languages='resume.languages',
    :profiles='resume.basics.profiles',
    :summary='resume.basics.summary',
    :works='resume.works',
    :projects='resume.projects',
    :writing='resume.writing',
    :speaking='resume.speaking',
    :skills='resume.skills',
    :educations='resume.educations',
    :close='close')
</template>
