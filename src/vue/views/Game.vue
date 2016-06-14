<style lang="stylus">
  #game-container
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    overflow hidden
</style>

<script>
  import Game from '../../phaser-game'
  import { setActivedDialogue } from '../../vuex/actions/dialogues'

  export default {
    ready () {
      const TILE_SIZE = 16
      const SCALE_RATIO = 3
      const width = Math.floor((window.innerWidth / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)
      const height = Math.floor((window.innerHeight / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)

      const element = document.getElementById('game')
      const game = new Game(width, height, element)// eslint-disable-line

      game.actions = new Phaser.Signal()
      game.actions.add(action => {
        if (action.hasOwnProperty('dialogue')) {
          this.setActivedDialogue(action.dialogue)
        }
      })
    },
    vuex: {
      actions: {
        setActivedDialogue
      }
    }
  }
</script>

<template lang="jade">
  #game-container
    #game
</template>
