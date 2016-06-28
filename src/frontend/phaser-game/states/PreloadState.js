import map from '../../assets/map.json'
import coder from '../../assets/coder.png'
import desertnpc from '../../assets/desertnpc.png'
import guardcss3npc from '../../assets/guardcss3npc.png'
import guardhtml5npc from '../../assets/guardhtml5npc.png'
import guardjsnpc from '../../assets/guardjsnpc.png'
import villageboy from '../../assets/villageboy.png'
import villagegirl from '../../assets/villagegirl.png'
import octocat from '../../assets/octocat.png'
import player from '../../assets/player.png'
import tilesheet from '../../assets/tilesheet.png'

class PreloadState extends Phaser.State {
  preload () {
    this.load.tilemap('map', map, null, Phaser.Tilemap.TILED_JSON)
    this.load.spritesheet('coder', coder, 24, 24)
    this.load.spritesheet('desertnpc', desertnpc, 24, 24)
    this.load.spritesheet('guardcss3npc', guardcss3npc, 25, 24)
    this.load.spritesheet('guardhtml5npc', guardhtml5npc, 25, 24)
    this.load.spritesheet('guardjsnpc', guardjsnpc, 25, 24)
    this.load.spritesheet('octocat', octocat, 32, 32)
    this.load.spritesheet('player', player, 32, 32)
    this.load.spritesheet('villageboy', villageboy, 24, 24)
    this.load.spritesheet('villagegirl', villagegirl, 24, 24)
    this.load.image('tilesheet', tilesheet)

    this.load.onLoadComplete.addOnce(() => {
      this.game.state.start('GameState')
    })
  }
}

export default PreloadState
