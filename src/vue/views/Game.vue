<style lang="stylus">
  #game-layer
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    overflow hidden
</style>

<script>
  import Game from '../../phaser-game'
  import { setActivedDialogue } from '../../vuex/actions/dialogues'

  export default {
    vuex: {
      actions: {
        setActivedDialogue
      }
    },
    ready () {
      const element = document.getElementById('game')

      const TILE_SIZE = 16
      const SCALE_RATIO = 3
      const width = Math.floor((window.innerWidth / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)
      const height = Math.floor((window.innerHeight / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)

      const game = new Game(width, height, element)// eslint-disable-line

      game.actions = new Phaser.Signal()
      game.actions.add(action => {
        if (action.hasOwnProperty('dialogue')) {
          this.setActivedDialogue(action.dialogue)
        }
      })
    }
  }
</script>

<template lang="jade">
  #game-layer
    #game
</template>
