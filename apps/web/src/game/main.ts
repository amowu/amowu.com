import * as Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preloader } from './scenes/Preloader'
import { WorldScene } from './scenes/WorldScene'

const TILE_SIZE = 16
const MAP_TILES = 60
const WORLD_SIZE = TILE_SIZE * MAP_TILES // 960

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  pixelArt: true,
  backgroundColor: '#000000',
  scene: [Boot, Preloader, WorldScene],
}

export const WORLD_BOUNDS = { tile: TILE_SIZE, tilesPerSide: MAP_TILES, size: WORLD_SIZE }

const StartGame = (parent: string) => {
  return new Phaser.Game({ ...config, parent })
}

export default StartGame
