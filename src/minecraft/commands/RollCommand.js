const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
let rolls
async function roll(username,sides) {

  sides = sides.replace(/[^\d.]/g,'');

  let num = 1 + Math.floor(Math.random() * sides)
  num = num.toString()
  if(num == "20" && sides == "20"){
  rolls = `${username} rolled a natural 20`
  }
  else if(num == "1"){
    rolls = `Oooh.. Bad luck ${username}, it's a nat 1`
  }
  else{
    rolls = `${username} rolled a D${sides}, their D${sides} rolled a ${num}`
  } 
  return rolls;
}

class PingCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'roll'
    this.aliases = []
    this.description = 'Replies with a DND roll to the user'
  }

  onCommand(username, message) {
    let args = message.split(" ")

    if (args[1] != undefined){
      roll(username, args[1]).then(rolls => {
        this.send(`/gc ${rolls}`)
        this.minecraft.broadcastCleanEmbed({ message: `${rolls}`, color: "47F049" })
      })
    }
    else {
      roll(username, "6").then(rolls => {
        this.send(`/gc ${rolls}`)
        this.minecraft.broadcastCleanEmbed({ message: `${rolls}`, color: "47F049" })
      })
    }
  }
}

module.exports = PingCommand
