const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class NyaCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'nya'
    this.aliases = ["nyah","meow","mew"]
    this.description = `Nya's at you`
  }

  onCommand(username, message) {

    this.send(`/gc ${username} Nyah~`)

  }
}

module.exports = NyaCommand