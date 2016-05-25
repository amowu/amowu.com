<script>
  import 'pixi'
  import 'p2'
  import 'phaser'

  import Game from '../../game'

  export default {
    ready () {
      new Game(480, 240, document.getElementById('game'))// eslint-disable-line
    }
  }
</script>

<template>
  <div id='game'></div>
</template>
