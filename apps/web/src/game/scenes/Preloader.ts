import { Scene } from 'phaser'

export class Preloader extends Scene {
  constructor() {
    super('Preloader')
  }

  init() {
    // Simple progress bar
    const { width, height } = this.scale
    this.add.rectangle(width / 2, height / 2, 468, 32).setStrokeStyle(1, 0xffffff)
    const bar = this.add.rectangle(width / 2 - 230, height / 2, 4, 28, 0xffffff)

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets/phaser-game/')

    // Tilemap
    this.load.tilemapTiledJSON('map', 'map.json')
    this.load.image('tilesheet', 'tilesheet.png')

    // Sprites — frame sizes from old PreloadState
    this.load.spritesheet('player', 'player.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('coder', 'coder.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet('octocat', 'octocat.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('guardcss3npc', 'guardcss3npc.png', { frameWidth: 25, frameHeight: 24 })
    this.load.spritesheet('guardjsnpc', 'guardjsnpc.png', { frameWidth: 25, frameHeight: 24 })
    this.load.spritesheet('guardhtml5npc', 'guardhtml5npc.png', { frameWidth: 25, frameHeight: 24 })
    this.load.spritesheet('villageboy', 'villageboy.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet('villagegirl', 'villagegirl.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet('desertnpc', 'desertnpc.png', { frameWidth: 24, frameHeight: 24 })
  }

  create() {
    this.scene.start('WorldScene')
  }
}
