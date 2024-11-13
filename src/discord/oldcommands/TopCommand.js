const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");

class GTopCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'top'
    this.aliases = ['g top', 'gtop']
    this.description = 'Returns Guild Top EXP from specified day'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    args = args.shift()
    message = message.toString()
    if(message.endsWith("top")){
        this.sendMinecraftMessage(`/g top`)
    }
    else{
        this.sendMinecraftMessage(`/g top ${args}`)
    }
  }
}

module.exports = GTopCommand