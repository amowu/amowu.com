<style lang="less">
  /* Semantic UI Global */
  & { @import "~semantic-ui-less/definitions/globals/reset"; }
  & { @import "~semantic-ui-less/definitions/globals/site"; }
  /* Semantic UI Elements */
  & { @import "~semantic-ui-less/definitions/elements/button"; }
  & { @import "~semantic-ui-less/definitions/elements/container"; }
  & { @import "~semantic-ui-less/definitions/elements/divider"; }
  & { @import "~semantic-ui-less/definitions/elements/header"; }
  & { @import "~semantic-ui-less/definitions/elements/icon"; }
  & { @import "~semantic-ui-less/definitions/elements/image"; }
  & { @import "~semantic-ui-less/definitions/elements/label"; }
  & { @import "~semantic-ui-less/definitions/elements/list"; }
  & { @import "~semantic-ui-less/definitions/elements/segment"; }
  /* Semantic UI Collections */
  & { @import "~semantic-ui-less/definitions/collections/grid"; }
  & { @import "~semantic-ui-less/definitions/collections/menu"; }
  /* Semantic UI Views */
  & { @import "~semantic-ui-less/definitions/views/card"; }
  & { @import "~semantic-ui-less/definitions/views/comment"; }
  & { @import "~semantic-ui-less/definitions/views/item"; }
  & { @import "~semantic-ui-less/definitions/views/statistic"; }
</style>

<script>
  import store from '../../vuex/store'
  import Dialogue from './Dialogue'
  import Game from './Game'

  export default {
    components: {
      Dialogue,
      Game
    },
    store
  }
</script>

<template lang="jade">
  div
    game
    dialogue
    router-view
</template>
