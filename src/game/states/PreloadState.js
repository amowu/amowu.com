import coder from '../../assets/coder.png'
import tilesheet from '../../assets/tilesheet.png'

class PreloadState extends Phaser.State {
  preload () {
    this.load.spritesheet('coder', coder, 24, 24)
    this.load.image('tilesheet', tilesheet)

    this.load.onLoadComplete.addOnce(() => {
      this.game.state.start('GameState')
    })
  }
}

export default PreloadState
