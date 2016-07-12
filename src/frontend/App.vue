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
  import store from './core/store'
  import DialoguePage from './pages/DialoguePage'
  import GamePage from './pages/GamePage'

  import { checkAuth, login, logout } from './actions/auth'

  export default {
    components: {
      DialoguePage,
      GamePage
    },
    ready () {
      this.checkAuth()
    },
    store,
    vuex: {
      actions: {
        checkAuth,
        login,
        logout
      },
      getters: {
        auth: state => state.auth
      }
    }
  }
</script>

<template lang="jade">
  div
    game-page
    dialogue-page
    router-view
    button(@click='login', v-show='!auth.authenticated') Login
    button(@click='logout', v-show='auth.authenticated') Logout
    button(v-link='"protected"', v-show='auth.authenticated') Protected Demo Page
</template>
