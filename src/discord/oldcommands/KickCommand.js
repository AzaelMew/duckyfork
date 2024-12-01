const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');
async function getUUIDFromUsername(username) {
  if (!(/^[a-zA-Z0-9_]{2,16}$/mg.test(username))) {
      return "Error"
  }
  else {
      const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username)
      let uuid = data.id
      let user = username
      return data.id
  }
}
class KickCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "commander"

    this.name = 'kick'
    this.aliases = ['k']
    this.description = 'Kicks the given user from the guild'
  }

  async onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    let reason = args.join(' ')
    if(user.toLowerCase()=="azael_nya") return
    else{
      
      try {
        const guildInfo = await this.getGuildInfo(user);
        if (guildInfo && guildInfo.name !== 'TempestSky') {
          return;
        }
      } catch (error) {
        console.error('Error fetching guild information:', error);
        return;
      }

      getUUIDFromUsername(user).then(uuid => {
        let blacklist = fs.readFileSync('/tempest/blacklist.txt', 'utf-8');
        let blacklistedIDs = blacklist.trim().split('\n');
            if (!blacklist.includes(uuid)) {
              this.sendMinecraftMessage(`/oc ${user} ${uuid} kicked, and added to blacklist.`)
                blacklist += uuid + "\n";
  
                fs.writeFileSync('/tempest/blacklist.txt', blacklist, 'utf-8');
            }
            message.channel.send({
              embeds: [{
                  description: `${user} has been kicked and blacklisted from joining.`,
                  color: 0xcbbeb5,
                  timestamp: new Date(),
                  footer: {
                      text: "BOT",
                  },
              }],
          })
          setTimeout(() => {
            this.sendMinecraftMessage(`/g kick ${user ? user : ''} ${reason ? reason : ''}`)
          }, 500);
        })
    }
  }
  async getGuildInfo(username) {
    const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    const uuid = uuidResponse.data.id;

    const guildResponse = await axios.get(`https://api.hypixel.net/v2/guild?key=${config.minecraft.API.hypixelAPIkey}&player=${uuid}`);
    return guildResponse.data.guild;
  }
}

module.exports = KickCommand
