const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const fs = require('fs');
const axios = require("axios");
let user = null


async function compareGuilds(){
  try {
    const sky = await axios.get(`https://api.hypixel.net/v2/guild?key=${config.minecraft.API.hypixelAPIkey}&id=5efdacc58ea8c97b066144a7`);
    const aria = await axios.get(`https://api.hypixel.net/v2/guild?key=${config.minecraft.API.hypixelAPIkey}&id=6627e4128ea8c9d0525e27fa`);
    let skyMembers = sky.data.guild.members.length;
    let ariaMembers = aria.data.guild.members.length;
    skyMembers <= ariaMembers
    if (skyMembers <= ariaMembers){
      return "Tsky"
    } else {
      return "Taria"
    }
  } catch (error) {
    console.error('Error fetching guild data:', error.message);
    return 0;
  }
}
class InviteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "commander"

    this.name = 'invite'
    this.aliases = ['i', 'inv']
    this.description = 'Invites the given user to the guild'
  }

  onCommand(message) {
    let args = message.content.trim().split(/\s+/);

    if (args.length < 2 || args[1].toLowerCase() == 'aria') {
      return;
    }
    if (args[1].toLowerCase() == 'sky'){
      user = args[2]
      this.sendMinecraftMessage(`/g invite ${user ? user : ''}`)
    } else {
      user = args[1]
      compareGuilds().then((members) => {
        if (members == "Tsky"){
          this.sendMinecraftMessage(`/g invite ${user ? user : ''}`)
        } else if (members == "Taria"){
          return
        } else {
          console.log("something broke")
        }
      });
    }
    
  

    
    
  }
}

module.exports = InviteCommand
