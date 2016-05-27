class NPC extends Phaser.Sprite {
  constructor (...args) {
    super(...args)

    this.anchor.setTo(0.25)
    this.inputEnabled = true
    this.input.priorityID = 2

    this.action = new Phaser.Signal()
  }

  triggerAction (onTriggerAction) {
    this.action.dispatch(onTriggerAction)
  }
}

export default NPC
