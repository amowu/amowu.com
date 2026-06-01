import * as Phaser from 'phaser'
import EasyStar from 'easystarjs'
import { EventBus } from '../EventBus'
import { WORLD_BOUNDS } from '../main'

type NpcConfig = {
  key: string
  spritesheet: string
  tileX: number
  tileY: number
  dialogueId: string
  frameRate: number
}

const NPCS: NpcConfig[] = [
  { key: 'coder', spritesheet: 'coder', tileX: 9, tileY: 12, dialogueId: 'n10001', frameRate: 6 },
  { key: 'octocat', spritesheet: 'octocat', tileX: 6, tileY: 12, dialogueId: 'n10004', frameRate: 2 },
  { key: 'guardcss3npc', spritesheet: 'guardcss3npc', tileX: 10, tileY: 3, dialogueId: 'n10015', frameRate: 2 },
  { key: 'guardjsnpc', spritesheet: 'guardjsnpc', tileX: 12, tileY: 5, dialogueId: 'n10012', frameRate: 2 },
  { key: 'guardhtml5npc', spritesheet: 'guardhtml5npc', tileX: 14, tileY: 3, dialogueId: 'n10016', frameRate: 2 },
  { key: 'villageboy', spritesheet: 'villageboy', tileX: 44, tileY: 25, dialogueId: 'n10021', frameRate: 2 },
  { key: 'villagegirl', spritesheet: 'villagegirl', tileX: 16, tileY: 22, dialogueId: 'n10017', frameRate: 2 },
  { key: 'desertnpc', spritesheet: 'desertnpc', tileX: 30, tileY: 46, dialogueId: 'n10024', frameRate: 2 },
]

// Walkable tile indices from old game (collision layer 'c' uses 27 for walkable, 0 for blocked)
const WALKABLE_TILE_INDICES = [27]

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite
  private easystar!: EasyStar.js
  private map!: Phaser.Tilemaps.Tilemap
  private currentAnim: string = 'idle_down'
  private walkChain: Phaser.Tweens.Tween[] = []
  private paused = false

  constructor() {
    super('WorldScene')
  }

  create() {
    const { tile: T, size } = WORLD_BOUNDS
    this.cameras.main.setBounds(0, 0, size, size)
    this.physics.world.setBounds(0, 0, size, size)

    // Build tilemap — old map has layers: layer0..layer4 (visual), 'c' (collision), 'entities'
    this.map = this.make.tilemap({ key: 'map' })
    const tileset = this.map.addTilesetImage('tilesheet', 'tilesheet')
    if (!tileset) throw new Error('tileset not found in map.json')

    // Render visual layers 0..4
    for (const layerName of ['layer0', 'layer1', 'layer2', 'layer3', 'layer4']) {
      const layer = this.map.createLayer(layerName, tileset, 0, 0)
      if (layer) layer.setDepth(0)
    }

    // Pathfinding — build grid from collision layer 'c'
    // Read layer data directly (the 'c' layer isn't rendered via createLayer)
    const collisionLayerData = this.map.getLayer('c')
    const grid: number[][] = []
    if (collisionLayerData) {
      for (let y = 0; y < this.map.height; y++) {
        const row: number[] = []
        for (let x = 0; x < this.map.width; x++) {
          const tile = collisionLayerData.data[y]?.[x]
          row.push(tile && tile.index >= 0 ? tile.index : 0)
        }
        grid.push(row)
      }
    } else {
      // Fallback: empty grid all walkable
      for (let y = 0; y < this.map.height; y++) {
        grid.push(new Array(this.map.width).fill(27))
      }
    }

    this.easystar = new EasyStar.js()
    this.easystar.setGrid(grid)
    this.easystar.setAcceptableTiles(WALKABLE_TILE_INDICES)

    // Player animations (frame indices from old Player.js)
    this.createPlayerAnim('walk_right', [5, 6, 7, 8], 8, true)
    this.createPlayerAnim('idle_right', [10, 11], 2, true)
    this.createPlayerAnim('walk_up', [20, 21, 22, 23], 8, true)
    this.createPlayerAnim('idle_up', [25, 26], 2, true)
    this.createPlayerAnim('walk_down', [35, 36, 37, 38], 8, true)
    this.createPlayerAnim('idle_down', [40, 41], 2, true)

    // Player spawn at tile (12, 16)
    const spawnX = 12 * T + T / 2
    const spawnY = 16 * T + T / 2
    this.player = this.add.sprite(spawnX, spawnY, 'player')
    this.player.setDepth(10)
    this.player.play('idle_down')
    this.cameras.main.startFollow(this.player, true)

    // NPCs
    for (const npc of NPCS) {
      const sx = npc.tileX * T + T / 2
      const sy = npc.tileY * T + T / 2
      const sprite = this.add.sprite(sx, sy, npc.spritesheet)
      sprite.setDepth(5)
      sprite.setInteractive({ useHandCursor: true })

      const animKey = `${npc.key}-idle`
      if (!this.anims.exists(animKey)) {
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(npc.spritesheet, { frames: [0, 1] }),
          frameRate: npc.frameRate,
          repeat: -1,
        })
      }
      sprite.play(animKey)

      sprite.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
        event.stopPropagation()
        this.movePlayerToTile(npc.tileX, npc.tileY, () => {
          EventBus.emit('dialogue:open', npc.dialogueId)
        })
      })
    }

    // Click anywhere on the map → pathfind there
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
      if (currentlyOver && currentlyOver.length > 0) return
      const tileX = Math.floor(pointer.worldX / T)
      const tileY = Math.floor(pointer.worldY / T)
      if (tileX < 0 || tileY < 0 || tileX >= this.map.width || tileY >= this.map.height) return
      this.movePlayerToTile(tileX, tileY)
    })

    // EventBus listeners
    EventBus.on('game:pause', this.handlePause, this)
    EventBus.on('game:resume', this.handleResume, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off('game:pause', this.handlePause, this)
      EventBus.off('game:resume', this.handleResume, this)
    })

    // Signal scene ready for React side
    EventBus.emit('current-scene-ready', this)
    EventBus.emit('scene:ready', this)
  }

  private createPlayerAnim(key: string, frames: number[], frameRate: number, repeat: boolean) {
    if (this.anims.exists(key)) return
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers('player', { frames }),
      frameRate,
      repeat: repeat ? -1 : 0,
    })
  }

  private handlePause = () => {
    this.paused = true
    this.scene.pause()
  }

  private handleResume = () => {
    this.paused = false
    this.scene.resume()
  }

  private stopWalk() {
    for (const tween of this.walkChain) {
      if (tween && tween.isPlaying()) tween.stop()
    }
    this.walkChain = []
  }

  private movePlayerToTile(tileX: number, tileY: number, onArrive?: () => void) {
    const T = WORLD_BOUNDS.tile
    const playerTileX = Math.floor(this.player.x / T)
    const playerTileY = Math.floor(this.player.y / T)

    this.stopWalk()

    this.easystar.findPath(playerTileX, playerTileY, tileX, tileY, (path) => {
      if (!path || path.length === 0) {
        this.playIdleFromCurrent()
        return
      }
      const targets = path.slice(1).map((p) => ({
        x: p.x * T + T / 2,
        y: p.y * T + T / 2,
      }))
      if (targets.length === 0) {
        this.playIdleFromCurrent()
        onArrive?.()
        return
      }
      this.walkPath(targets, onArrive)
    })
    this.easystar.calculate()
  }

  private walkPath(targets: { x: number; y: number }[], onArrive?: () => void) {
    let i = 0
    const stepDuration = 200
    const next = () => {
      if (i >= targets.length) {
        this.playIdleFromCurrent()
        onArrive?.()
        return
      }
      const target = targets[i++]!
      this.updateWalkAnim(target)
      const tween = this.tweens.add({
        targets: this.player,
        x: target.x,
        y: target.y,
        duration: stepDuration,
        ease: 'Linear',
        onComplete: next,
      })
      this.walkChain.push(tween)
    }
    next()
  }

  private updateWalkAnim(next: { x: number; y: number }) {
    // Reset flip
    this.player.setFlipX(false)
    let key = this.currentAnim
    if (next.x > this.player.x) {
      key = 'walk_right'
    } else if (next.x < this.player.x) {
      key = 'walk_right'
      this.player.setFlipX(true)
    } else if (next.y > this.player.y) {
      key = 'walk_down'
    } else if (next.y < this.player.y) {
      key = 'walk_up'
    }
    if (this.currentAnim !== key) {
      this.currentAnim = key
      this.player.play(key)
    }
  }

  private playIdleFromCurrent() {
    const idleKey = this.currentAnim.replace('walk', 'idle')
    if (this.currentAnim !== idleKey) {
      this.currentAnim = idleKey
      this.player.play(idleKey)
    }
  }
}
