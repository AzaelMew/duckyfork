const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class OverrideCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'override'
    this.aliases = ['o']
    this.description = 'Executes commands as the minecraft bot'
  }

  onCommand(username, message) { 
      if (username.includes("Azael_Nyaa")||username.includes("Azael_Nya")){
            message = message.split(" ")
            message.shift()
            message = message.join(" ")
    
        this.send(`/${message}`)
      }
  }
}

module.exports = OverrideCommand
