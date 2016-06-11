import EasyStar from 'easystarjs'
import { get, map, reduce } from 'lodash'

class Tilemap extends Phaser.Tilemap {
  constructor (...args) {
    super(...args)

    this.addTilesetImage('tilesheet')

    this._mainLayer = this.createLayer('layer0')
    this.createLayer('layer1')
    this.createLayer('layer2')
    this.createLayer('layer3')
    this.createLayer('layer4')

    this._mainLayer.inputEnabled = true
    this._mainLayer.input.priorityID = 1

    this._setupEasyStar()
  }

  _setupEasyStar () {
    // generate A* grid
    const collisionLayer = get(this.layers, this.getLayerIndex('c'))
    const grid = reduce(get(collisionLayer, 'data'), (prev, curr) => {
      prev.push(map(curr, 'index'))
      return prev
    }, [])
    // setup
    this._easystar = new EasyStar.js()// eslint-disable-line
    this._easystar.setGrid(grid)
    this._easystar.setAcceptableTiles([27])// TODO: 27 is magic number
  }

  async findPath (target, destination) {
    const path = await this._calculatePath({
      x: this.getTileX(target.x),
      y: this.getTileY(target.y)
    }, {
      x: this.getTileX(destination.x),
      y: this.getTileY(destination.y)
    })

    return path
  }

  _calculatePath (start, end) {
    return new Promise((resolve, reject) => {
      this._easystar.findPath(start.x, start.y, end.x, end.y, path => {
        resolve(path)
      })
      this._easystar.calculate()
    })
  }

  getTileX (x) {
    return this._mainLayer.getTileX(x)
  }

  getTileY (y) {
    return this._mainLayer.getTileY(y)
  }

  addOnInputDown (onInputDown) {
    if (typeof onInputDown === 'function') {
      // TODO: how to remove listener?
      this._mainLayer.events.onInputDown.add(onInputDown)
    }
  }
}

export default Tilemap
