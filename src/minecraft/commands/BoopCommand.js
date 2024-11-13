const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class BoopCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'boop'
    this.aliases = []
    this.description = 'Replies with `Boop!` to the user'
  }

  onCommand(username, message) {
    let target = message.split(" ")
    this.send(`/boop ${target[1]}`)
  }
}

module.exports = BoopCommand
