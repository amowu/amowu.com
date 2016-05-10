<script>
  export default {
    ready () {
      this.$http({
        url: 'https://raw.githubusercontent.com/amowu/resume/gh-pages/resume.json',
        method: 'GET'
      }).then(response => {
        console.log(response)
      }, response => {
        console.log(response)
      })
    }
  }
</script>

<template>
  <div>
    Resume
  </div>
</template>
