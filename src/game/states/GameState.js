class GameState extends Phaser.State {
  init () {
    this.coder = null
  }
  create () {
    this.coder = new Phaser.Sprite(this.game, 0 * 16, 0 * 16, 'coder')
    this.coder.animations.add('idle', [0, 1], 6, true)
    this.coder.animations.play('idle')
    this.game.add.existing(this.coder)
  }
  update () {
  }
}

export default GameState
