<script>
  export default {
    route: {
      canActivate () {
        // TODO: waiting for Vuex v2.0.0 release
        return this.auth.authenticated
      }
    },
    vuex: {
      getters: {
        auth: state => state.auth
      }
    }
  }
</script>

<template>
  <div>
    <h1>Protected Demo Page</h1>
  </div>
</template>
