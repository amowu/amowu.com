<script>
  import store from '../core/store'
  import Game from './Game'

  export default {
    components: {
      Game
    },
    store
  }
</script>

<template lang="jade">
  div
    game
    router-view
</template>
