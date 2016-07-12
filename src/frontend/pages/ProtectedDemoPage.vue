<script>
  function checkAuth () {
    if (localStorage.getItem('id_token')) {
      return true
    } else {
      return false
    }
  }
  export default {
    route: {
      canActivate () {
        return checkAuth()
      }
    }
  }
</script>

<template>
  <div>
    <h1>Protected Demo Page</h1>
  </div>
</template>
