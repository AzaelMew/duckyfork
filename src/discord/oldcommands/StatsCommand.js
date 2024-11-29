const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');

function numberWithCommas(x) {
  x = x.toString().split(".")[0]
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
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
async function getStatsFromUsername(username, profile) {
  return await getStatsFromUUID(await getUUIDFromUsername(username), profile)
}
async function getStatsFromUUID(name, profile) {
    if (name == undefined) {
      name = "a"
    }
    if (name == "f03695547707486ab2308518f04102f7") return
    if (profile == undefined) {
      profile = "a"
    }
    const { data } = await axios.get('http://192.168.0.7:3000/v1/profiles/' + name + '?key=77ac89bad625453facaa36457eb3cf5c')
    console.log(data.data)
    for (i = 0; i < Object.keys(data.data).length; i++) {
      if (data.data[i].name.toLowerCase() == profile.toLowerCase()) {
        let nw = numberWithCommas(data.data[i].networth.networth)
        let farming = data.data[i]?.skills?.farming.level
        let mining = data.data[i]?.skills?.mining.level
        let combat = data.data[i]?.skills?.combat.level
        let foraging = data.data[i]?.skills?.foraging.level
        let fishing = data.data[i]?.skills?.fishing.level
        let enchant = data.data[i]?.skills?.enchanting.level
        let alch = data.data[i]?.skills?.alchemy.level
        let taming = data.data[i]?.skills?.taming.level
        let carp = data.data[i]?.skills?.carpentry.level
        let sa = round((farming + mining + combat + foraging + fishing + enchant + alch + taming + carp) / 9, 1)
        let cata = data.data[i].dungeons?.catacombs?.skill?.levelWithProgress || 0
        if (cata == 50) {
          let total = data.data[0].dungeons?.catacombs?.skill?.totalXp;
          let newNum = total - 569809640
          let overflow = newNum / 200000000
          cata = cata + overflow
        }
        let wslayer = data.data[i]?.slayer?.wolf.xp
        let zslayer = data.data[i]?.slayer?.zombie.xp
        let sslayer = data.data[i]?.slayer?.spider.xp
        let eslayer = data.data[i]?.slayer?.enderman.xp
        let bslayer = data.data[i]?.slayer?.blaze.xp
        let vslayer = data.data[i]?.slayer?.vampire.xp
        let sblvl = data.data[i]?.sblevel
        sblvl = sblvl.toString().split(".")

        let slayer = numberWithCommas(wslayer + zslayer + sslayer + eslayer + bslayer + vslayer)
        let stats = `**On ${profile}:** \n**Skyblock Level:** \n➣ ${sblvl[0]}; **Skill Avg:** \n➣ ${sa}; **Slayer:** \n➣ ${slayer}; **Cata:** \n➣ ${cata.toFixed(2)}; **Networth:** \n➣ $${nw};`
        return stats
      }
      else if (i == Object.keys(data.data).length - 1) {
        let nw = numberWithCommas(data.data[0].networth.networth)
        let farming = data.data[0]?.skills?.farming.level
        let mining = data.data[0]?.skills?.mining.level
        let combat = data.data[0]?.skills?.combat.level
        let foraging = data.data[0]?.skills?.foraging.level
        let fishing = data.data[0]?.skills?.fishing.level
        let enchant = data.data[0]?.skills?.enchanting.level
        let alch = data.data[0]?.skills?.alchemy.level
        let taming = data.data[0]?.skills?.taming.level
        let carp = data.data[0]?.skills?.carpentry.level
        let sa = round((farming + mining + combat + foraging + fishing + enchant + alch + taming + carp) / 9, 1)
        let cata = data.data[0].dungeons?.catacombs?.skill?.levelWithProgress || 0
        if (cata == 50) {
          let total = data.data[0].dungeons?.catacombs?.skill?.totalXp;
          let newNum = total - 569809640
          let overflow = newNum / 200000000
          cata = cata + overflow
        }
        let wslayer = data.data[0]?.slayer?.wolf.xp
        let zslayer = data.data[0]?.slayer?.zombie.xp
        let sslayer = data.data[0]?.slayer?.spider.xp
        let eslayer = data.data[0]?.slayer?.enderman.xp
        let bslayer = data.data[0]?.slayer?.blaze.xp
        let vslayer = data.data[0]?.slayer?.vampire.xp
        let sblvl = data.data[0]?.sblevel
        sblvl = sblvl.toString().split(".")
        let mp = data.data[0]?.talismans?.mp

        let slayer = numberWithCommas(wslayer + zslayer + sslayer + eslayer + bslayer + vslayer)
        let stats = `˚**Skyblock Level:** \n➣ ${sblvl[0]}; **Skill Avg:** \n➣ ${sa}; **Slayer:** \n➣ ${slayer}; **Cata:** \n➣ ${cata.toFixed(2)}; **Networth:** \n➣ $${nw}; **Magical Power:** \n➣ ${mp}`
        return stats
      }
    }
}

class StatsCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'stats'
    this.description = `Checks user's stats`
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()
    
    getStatsFromUsername(user).then(stats => {
      if (stats.includes("[ERROR]")) {
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
              name: `${user}'s stats`,
              icon_url: 'https://www.mc-heads.net/avatar/' + user,
            },
          }],
        })
      }
      else {
        this.sendMinecraftMessage(`/gc ${user}'s stats: ${stats.replaceAll("*", "").replaceAll("\n➣ ", "").replaceAll("\n", "").replaceAll(";", "˚").replaceAll("¨", "˚")}`)
        message.channel.send({
          embeds: [{
            description: stats.replaceAll("; ", "\n").replaceAll(":", "").replaceAll("˚",""),
            color: 0x2A2A2A,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
            author: {
              name: `${user}'s stats`,
              icon_url: 'https://www.mc-heads.net/avatar/' + user,
            },
          }],
        })
      }
    })
  }
}
module.exports = StatsCommand
