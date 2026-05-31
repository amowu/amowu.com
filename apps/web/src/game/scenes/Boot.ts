import { Scene } from 'phaser'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  create() {
    // Boot is minimal — transition to Preloader to load assets
    this.scene.start('Preloader')
  }
}
