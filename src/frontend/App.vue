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
  import Auth0Lock from 'auth0-lock'

  import store from './core/store'
  // import DialoguePage from './pages/DialoguePage'
  // import GamePage from './pages/GamePage'

  function checkAuth () {
    if (localStorage.getItem('id_token')) {
      return true
    } else {
      return false
    }
  }

  export default {
    data () {
      return {
        authenticated: false
      }
    },
    methods: {
      login () {
        const lock = new Auth0Lock('oEmGgFwDWAwQeu3y1qSWgxqFkrmlNduZ', 'amowu.auth0.com')

        lock.show({
          connections: ['Username-Password-Authentication'],
          dict: 'zh-TW',
          focusInput: true,
          icon: 'https://cdn.amowu.com/auth0icon.0ade39b0-c1fa-4fd5-9c85-2ecdc6a1120b.png',
          rememberLastLogin: false
        }, (err, profile, token) => {
          if (err) {
            // Handle the error
            console.log(err)
          } else {
            // Set the token and user profile in local storage
            localStorage.setItem('profile', JSON.stringify(profile))
            localStorage.setItem('id_token', token)
            this.authenticated = true
          }
        })
      },
      logout () {
        localStorage.removeItem('id_token')
        localStorage.removeItem('profile')
        this.authenticated = false
      }
    },
    // components: {
    //   DialoguePage,
    //   GamePage
    // },
    ready () {
      this.authenticated = checkAuth()
    },
    store
  }
</script>

<template lang="jade">
  div
    //- game-page
    //- dialogue-page
    button(@click='login', v-show='!authenticated') Login
    button(@click='logout', v-show='authenticated') Logout
    button(v-link='"protected"', v-show='authenticated') Protected Demo Page
    router-view
</template>
