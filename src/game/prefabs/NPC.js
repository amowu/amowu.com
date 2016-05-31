class NPC extends Phaser.Sprite {
  constructor (...args) {
    super(...args)

    this.inputEnabled = true
    this.input.priorityID = 2

    this.action = new Phaser.Signal()
  }

  triggerAction (onTriggerAction) {
    this.action.dispatch(onTriggerAction)
  }
}

export default NPC
