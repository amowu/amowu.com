<script>
  import AboutSection from './AboutSection'
  import WorkExperienceSection from './WorkExperienceSection'
  import SkillsSection from './SkillsSection'
  import EducationSection from './EducationSection'

  export default {
    props: [
      'works',
      'projects',
      'writing',
      'speaking',
      'skills',
      'educations'
    ],
    components: {
      AboutSection,
      WorkExperienceSection,
      SkillsSection,
      EducationSection
    }
  }
</script>

<template lang='jade'>
  .ui.container
    .ui.segment
      about-section
      work-experience-section(
        :works='works',
        :projects='projects',
        :writing='writing',
        :speaking='speaking')
      skills-section(:skills='skills')
      education-section(:educations='educations')
</template>
