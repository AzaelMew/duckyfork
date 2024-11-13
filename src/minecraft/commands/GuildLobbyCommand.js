const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class GuildLobbyCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'guildlobby'
    this.aliases = ['globby']
    this.description = "Whispers user's username to a guild lobby account"
  }

  onCommand(username, message) {
    this.send(`/w ${this.minecraft.app.config.minecraft.lobbyHolder} ?tw ${username}`)
  }
}

module.exports = GuildLobbyCommand
