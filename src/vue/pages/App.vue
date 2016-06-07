<script>
  import store from '../../core/store'
  import DialogueLayer from './DialogueLayer'
  import Game from './Game'

  export default {
    components: {
      DialogueLayer,
      Game
    },
    store
  }
</script>

<template lang="jade">
  div
    game
    dialogue-layer
    router-view
</template>
