const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");

class MuteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "commander"

    this.name = 'mute'
    this.aliases = ['m']
    this.description = 'Mutes the given user for a given amount of time'
  }

  async onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let time = args.shift()

    this.sendMinecraftMessage(`/g mute ${user ? user : ''} ${time ? time : ''}`)


  }

}


module.exports = MuteCommand
