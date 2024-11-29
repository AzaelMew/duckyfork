//Yonko yonked this
const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');

function numberWithCommas(x) {
  if (x > 999815672) {
    x = x.toString().split(".")[0]
    x = x.toString().slice(0, -6) + "815672";
  }
  else {
    x = x.toString().split(".")[0]
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
async function getKuudraFromUsername(username) {
  return await getKuudraFromUUID(await getUUIDFromUsername(username))
}
async function getKuudraFromUUID(name) {

  try {
    if (name == undefined) {
      name = "a"
    }
    if (name == "f03695547707486ab2308518f04102f7") return
    const { data } = await axios.get('http://192.168.0.7:3000/v1/profiles/' + name + '?key=77ac89bad625453facaa36457eb3cf5c')
    let faction = data.data[0]?.crimson.factions.selected_faction
    let mage = data.data[0]?.crimson.factions.mages_reputation
    let barbarian = data.data[0]?.crimson.factions.barbarians_reputation
    let basic = data.data[0]?.crimson.kuudra_completed_tiers.none
    let hot = data.data[0]?.crimson.kuudra_completed_tiers.hot
    let burning = data.data[0]?.crimson.kuudra_completed_tiers.burning
    let fiery = data.data[0]?.crimson.kuudra_completed_tiers.fiery
    let infernal = data.data[0]?.crimson.kuudra_completed_tiers.infernal

    if (faction == "mages"){
      faction = "Mage"
    } else if (faction == "barbarians"){
      faction = "Barbarian"
    } else {
      faction = "None"
    }

    let stats = "**Current Faction**:\n➣ " + faction + "¨ **;Mage Reputation**:\n➣ " + mage.toFixed(0) + "¨ **;Barbarian Reputation**:\n➣ " + barbarian.toFixed(0) + "¨ **;Basic**:\n➣ " + basic.toFixed(0) + "¨ **;Hot**:\n➣ " + hot.toFixed(0) + "¨ **;Burning**:\n➣ " + burning.toFixed(0) + "¨ **;Fiery**:\n➣ " + fiery.toFixed(0) + "¨ **;Infernal**:\n➣ " + infernal.toFixed(0)
    return stats

  }
  catch (error) {
    return `[ERROR] ${error.response.data.reason}`
  }
}
class KuudraCommand extends DiscordCommand {
  constructor(discord) {
      super(discord)
    this.permission = "all"

      this.name = 'kuudra'
      this.description = "Says users kuudra stats"
    }

  onCommand(message) {
  
    let args = this.getArgs(message)
    let user = args.shift()
    getKuudraFromUsername(user).then(stats => {
      if(stats.includes("[ERROR]")){
        this.sendMinecraftMessage(`/gc ${stats}`)
        message.channel.send({
          embeds: [{
            description: stats,
            color: 0x2A2A2A,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
            author: {
              name: `${user}'s kuudra`,
              icon_url: 'https://www.mc-heads.net/avatar/' + user,
            },
          }],
        })
      }
      else{
      this.sendMinecraftMessage(`/gc ${user}'s kuudra: ${stats.replaceAll("*", "").replaceAll("\n➣", "").replaceAll("\n", "").replaceAll(";", "").replaceAll("¨", "˚")}`)
      message.channel.send({
        embeds: [{
          description: stats.replaceAll(";", "\n").replaceAll(":","").replaceAll("˚",""),
          color: 0x2A2A2A,
          timestamp: new Date(),
          footer: {
            text: "BOT",
          },
          author: {
            name: `${user}'s kuudra`,
            icon_url: 'https://www.mc-heads.net/avatar/' + user,
          },
        }],
      })
    }
    })
  }
}

module.exports = KuudraCommand
