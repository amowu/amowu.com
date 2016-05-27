<script>
  import 'pixi'
  import 'p2'
  import 'phaser'

  import { setActivedDialogue } from '../../actions/dialogues'
  import Game from '../../game'

  export default {
    vuex: {
      actions: {
        setActivedDialogue
      }
    },
    ready () {
      const TILE_SIZE = 16
      const SCALE_RATIO = 3
      const width = Math.floor((window.innerWidth / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)
      const height = Math.floor((window.innerHeight / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)

      const game = new Game(width, height, document.getElementById('game'))// eslint-disable-line

      game.actions = new Phaser.Signal()
      game.actions.add(action => {
        if (action.hasOwnProperty('dialogue')) {
          this.setActivedDialogue(action.dialogue)
        }
      })
    }
  }
</script>

<template>
  <div id='game'></div>
</template>
