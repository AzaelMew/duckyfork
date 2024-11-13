const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");

class GuildList extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'list'
    this.description = 'Checks G List'
  }

  onCommand() {
    this.sendMinecraftMessage(`/g list`)
  }
}

module.exports = GuildList