const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class PingCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'ping'
    this.aliases = []
    this.description = 'Replies with `Pong!` to the user'
  }

  onCommand(username, message) {
    this.send(`/w ${username} Pong!`)
  }
}

module.exports = PingCommand
