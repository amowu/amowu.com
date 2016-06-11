import { get, pick } from 'lodash'

class Player extends Phaser.Sprite {
  constructor (...args) {
    super(...args)

    this.anchor.setTo(0.25, 0.375)
    this.animations.add('walk_right', [5, 6, 7, 8], 8, true)
    this.animations.add('idle_right', [10, 11], 2, true)
    this.animations.add('walk_up', [20, 21, 22, 23], 8, true)
    this.animations.add('idle_up', [25, 26], 2, true)
    this.animations.add('walk_down', [35, 36, 37, 38], 8, true)
    this.animations.add('idle_down', [40, 41], 2, true)

    this._currentTweens = []
    this._isMoving = false
    this._currentTweensIndex = 0
    this._tweenInProgress = false
    this._onFollowComplete = null

    this.animations.play('idle_down')
  }

  followPath (path, onFollowComplete) {
    this._onFollowComplete = onFollowComplete
    this._resetCurrentTweens()
    this._prepareMovement(path)
    this._moveInPath()
  }

  _resetCurrentTweens () {
    this._currentTweens.map(tween => this.game.tweens.remove(tween))
    this._currentTweens = []
    this._isMoving = false
  }

  _prepareMovement (path = []) {
    this._currentTweens = []
    path.map(point => {
      this._currentTweens.push(
        this._getTweenToCoordinate(point.x, point.y)
      )
    })
  }

  _getTweenToCoordinate (x, y) {
    const tween = this.game.add.tween(this.position)
    // TODO: 16 -> TILE_SIZE
    tween.to({
      x: x * 16,
      y: y * 16
    }, 100)// TODO: 100 -> speed
    return tween
  }

  _moveInPath () {
    if (this._currentTweens.length === 0) return
    // why index is start with 1?
    // because need to exclude self position in this path
    this._currentTweensIndex = 1
    this._isMoving = true
    this._moveToNext(this._currentTweens[this._currentTweensIndex])
  }

  _moveToNext (tween) {
    const onComplete = () => {
      this._onStopMovement()
      // trigger onComplete callback, ex: NPC dialogue
      if (typeof this._onFollowComplete === 'function') {
        this._onFollowComplete()
      }
      if (tween && tween.onComplete.has(onComplete)) {
        tween.onComplete.remove(onComplete)
      }
    }

    if (!tween) return onComplete()

    const nextPosition = pick(get(tween, ['timeline', 0, 'vEnd']), ['x', 'y'])
    this._updateNextAnimation(nextPosition)

    this._currentTweensIndex++
    const nextTween = this._currentTweens[this._currentTweensIndex]
    if (nextTween) {
      const onNextTweenComplete = () => {
        this._tweenInProgress = false
        this._moveToNext(nextTween)
        if (tween.onComplete.has(onComplete)) {
          tween.onComplete.remove(onNextTweenComplete)
        }
      }
      tween.onComplete.add(onNextTweenComplete)
    } else {
      tween.onComplete.add(onComplete)
    }
    tween.start()
    this._tweenInProgress = true
  }

  _onStopMovement () {
    this._updateStopAnimation()
    this._resetCurrentTweens()
  }

  _updateNextAnimation (next) {
    this.anchor.setTo(0.25, 0.375)// TODO: configuration magic number
    this.scale.x = 1// TODO: 1 -> Direction.RIGHT
    if (next.x > this.x) {
      return this._playAnimation('walk_right')
    }
    if (next.x < this.x) {
      this.anchor.setTo(0.75, 0.375)
      this.scale.x = -1
      return this._playAnimation('walk_right')
    }
    if (next.y > this.y) {
      return this._playAnimation('walk_down')
    }
    if (next.y < this.y) {
      return this._playAnimation('walk_up')
    }
  }

  _updateStopAnimation () {
    const walkKey = this.animations.currentAnim.name
    const idleKey = walkKey.replace('walk', 'idle')
    this._playAnimation(idleKey)
  }

  _playAnimation (key) {
    // prevent duplicate current animation
    if (this.animations.currentAnim.name !== key) {
      this.animations.play(key)
    }
  }
}

export default Player
