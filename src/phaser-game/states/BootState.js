class BootState extends Phaser.State {
  create () {
    // max number of fingers to detect.
    this.input.maxPointers = 1
    // Show the entire game display area while maintaining the original aspect ratio.
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

    this.game.state.start('PreloadState')
  }
}

export default BootState
