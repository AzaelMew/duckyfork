const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const fs = require('fs');

class PingCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'help'
    this.aliases = []
    this.description = 'Tells you to run !help in discord'
  }

  onCommand(username, message) {
    

      this.send(`/gc TempestBridge (Bot) has a variety of commands which can be used through the guild chat. To see all the commands, please run !help in the bridge channel in discord.`)
  }
}

module.exports = PingCommand
