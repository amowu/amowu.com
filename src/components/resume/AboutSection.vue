<style scoped>
  #about > p {
    margin-bottom: 1em;
  }
</style>

<script>
  export default {
    props: [
      'summary'
    ]
  }
</script>

<template lang="jade">
  #about
    .ui.massive.red.ribbon.label
      i.user.icon
      | 關於我
    h3.ui.header 簡介
    p(v-html='summary')
</template>
