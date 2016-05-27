import { forEach, get } from 'lodash'

import Tilemap from '../Tilemap'
import NPC from '../prefabs/NPC'
import Player from '../prefabs/Player'

class GameState extends Phaser.State {
  init () {
    this._map = null
    this._player = null

    this._marker = null
  }
  create () {
    this.world.setBounds(0, 0, 60 * 16, 60 * 16)

    this._map = new Tilemap(this.game, 'map')
    this._player = new Player(this.game, 12 * 16, 16 * 16, 'player')
    this._createNPC([
      { 'key': 'coder', 'position': {'x': 9, 'y': 12}, 'frameRate': 6 }
    ])

    this._marker = this.add.graphics()
    this._marker.lineStyle(2, 0xff0000, 1)
    this._marker.drawRect(0, 0, 16, 16)

    this._map.addOnInputDown((layer, input) => {
      this._map.findPath(this._player, {
        x: get(input, 'worldX'),
        y: get(input, 'worldY')
      }).then(path => {
        if (path) {
          this._player.followPath(path)
        }
      })
    })

    this.game.add.existing(this._player)

    this.camera.follow(this._player)
  }
  update () {
    this._marker.x = this._map.getTileX(this.input.activePointer.worldX) * 16
    this._marker.y = this._map.getTileY(this.input.activePointer.worldY) * 16
  }
  _createNPC (npcs) {
    forEach(npcs, npc => {
      const instance = new NPC(this.game, npc.position.x * 16, npc.position.y * 16, npc.key)

      instance.addOnInputDown(this._onNPCInputDown.bind(this))

      instance.animations.add('idle_down', [0, 1], npc.frameRate, true)
      instance.animations.play('idle_down')

      this.game.add.existing(instance)
    })
  }
  _onNPCInputDown (npc) {
    this._map.findPath(this._player, npc).then(path => {
      if (path) {
        path.pop()// remove NPC self position
        this._player.followPath(path, () => {
          // npc.triggerAction()
        })
      }
    })
  }
}

export default GameState
