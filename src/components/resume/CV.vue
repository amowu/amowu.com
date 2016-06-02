<style lang="stylus" scoped>
  @media only screen and (max-width: 767px)
    .ui.container
      margin-left 0 !important
      margin-right 0 !important

    .ui.segment
      border-radius 0
      border-left 0
      border-right 0
</style>

<script>
  import AboutSection from './AboutSection'
  import WorkExperienceSection from './WorkExperienceSection'
  import SkillsSection from './SkillsSection'
  import EducationSection from './EducationSection'

  export default {
    props: [
      'summary',
      'works',
      'projects',
      'writing',
      'speaking',
      'skills',
      'educations',
      'close'
    ],
    components: {
      AboutSection,
      WorkExperienceSection,
      SkillsSection,
      EducationSection
    }
  }
</script>

<template lang="jade">
  .ui.container
    .ui.segment
      a.ui.right.corner.label(@click='close')
        i.remove.icon
      about-section(
        :summary='summary')
      work-experience-section(
        :works='works',
        :projects='projects',
        :writing='writing',
        :speaking='speaking')
      skills-section(
        :skills='skills')
      education-section(
        :educations='educations')
    img.ui.right.floated.medium.image(src='http://cdn.amowu.com/sign.png')
</template>
