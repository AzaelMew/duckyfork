class CommunicationBridge {
  constructor() {
    this.bridge = null
  }

  getBridge() {
    return this.bridge
  }

  setBridge(bridge) {
    this.bridge = bridge
  }

  broadcastMessage(event) {
    return this.bridge.onBroadcast(event)
  }

  broadcastImage(event) {
    return this.bridge.onImageBroadcast(event)
  }

  broadcastTextEmbed(event) {
    return this.bridge.onTextEmbedBroadcast(event)
  }
  broadcastFuckEmbed(event) {
    return this.bridge.onFuckEmbedBroadcast(event)
  }
  broadcastOfficerCommand(event) {
    return this.bridge.onOfficerCommand(event)
  }
  broadcastOfficerMessage(event) {
    return this.bridge.onOfficerBroadcast(event)
  }

  broadcastNewImage(event) {
    return this.bridge.onBroadcastNewImage(event)
  }

  broadcastPlayerToggle(event) {
    return this.bridge.onPlayerToggle(event)
  }
  broadcastPlayerToggle2(event) {
    return this.bridge.onPlayerToggle2(event)
  }

  broadcastCleanEmbed(event) {
    return this.bridge.onBroadcastCleanEmbed(event)
  }

  broadcastCommandEmbed(event) {
    return this.bridge.onBroadcastCommandEmbed(event)
  }
  broadcastCommandEmbed2(event) {
    return this.bridge.onBroadcastCommandEmbed2(event)
  }
  broadcastCommandEmbed3(event) {
    return this.bridge.onBroadcastCommandEmbed3(event)
  }
broadcastOnEmbed(event) {
  return this.bridge.onBroadcastOnEmbed(event)
}

  broadcastLogEmbed(event) {
    return this.bridge.onBroadcastLog(event)
  }

  broadcastHeadedEmbed(event) {
    return this.bridge.onBroadcastHeadedEmbed(event)
  }

  connect() {
    throw new Error('Communication bridge connection is not implemented yet!')
  }

  onBroadcast(event) {
    throw new Error('Communication bridge broadcast handling is not implemented yet!')
  }
}

module.exports = CommunicationBridge
