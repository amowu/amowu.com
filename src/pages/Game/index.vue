<script>
  import 'pixi'
  import 'p2'
  import 'phaser'

  import Game from '../../game'

  export default {
    ready () {
      const TILE_SIZE = 16
      const SCALE_RATIO = 3
      const width = Math.floor((window.innerWidth / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)
      const height = Math.floor((window.innerHeight / (TILE_SIZE * SCALE_RATIO)) * TILE_SIZE)
      new Game(width, height, document.getElementById('game'))// eslint-disable-line
    }
  }
</script>

<template>
  <div id='game'></div>
</template>
