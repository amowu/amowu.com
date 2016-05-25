class BootState extends Phaser.State {
  create () {
    this.game.state.start('PreloadState')
  }
}

export default BootState
