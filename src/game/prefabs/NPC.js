class NPC extends Phaser.Sprite {
  constructor (...args) {
    super(...args)

    this.anchor.setTo(0.25)
    this.inputEnabled = true
    this.input.priorityID = 2
  }

  addOnInputDown (onInputDown) {
    if (typeof onInputDown === 'function') {
      this.events.onInputDown.add(onInputDown)
      // TODO: how to remove this listener?
    }
  }
}

export default NPC
