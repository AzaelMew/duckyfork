const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');
const { env } = require('process');
const { getNetworth } = require('skyhelper-networth');
const Logger = require("../.././Logger.js");


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
function numberWithCommas(number) {
  if (number < 1) {
    return 0
  }
  number = number.toFixed(0);
  decPlaces = 1
  decPlaces = Math.pow(10, decPlaces);
  var abbrev = ["k", "m", "b", "t"];
  for (var i = abbrev.length - 1; i >= 0; i--) {
    var size = Math.pow(10, (i + 1) * 3);
    if (size <= number) {
      number = Math.round(number * decPlaces / size) / decPlaces;
      if ((number == 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }
      number += abbrev[i];
      break;
    }
  }
  return number;
}
function mainNum(x) {
  try {
    if (x > 999815672) {
      x = x.toString().split(".")[0]
      x = x.toString().slice(0, -6) + "815672";
    }
    else {
      x = x.toString().split(".")[0]
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  catch {
    return "API Off"
  }
}
async function getNetworthFromUsername(username) {
  return await getNetworthFromUUID(await getUUIDFromUsername(username))
}
async function getNetworthFromUUID(name) {
  try {
    const profiles = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${config.minecraft.API.hypixelAPIkey}&uuid=${name}`);
    let profile = profiles.data.profiles.find(p => p.selected);
    const museum = await axios.get(`https://api.hypixel.net/v2/skyblock/museum?key=${config.minecraft.API.hypixelAPIkey}&profile=${profile.profile_id}`)
    let museumData = museum.data.members[name]
    const profileData = await profile.members[name];
    const bankBalance = await profile.banking?.balance;

    const networth = await getNetworth(profileData, bankBalance, { v2Endpoint: true, museumData });
    let total = networth.networth ?? 0
    let purse = networth?.purse ?? 0
    let bank = networth?.bank ?? 0
    let bankP = networth?.personalBank ?? 0

    let ret
    let armor = networth?.types?.armor?.total ?? 0
    let wardrobe = networth?.types?.wardrobe?.total ?? 0
    let inventory = networth?.types?.inventory?.total ?? 0
    let ec = networth?.types?.enderchest?.total ?? 0
    let storage = networth?.types?.storage?.total ?? 0
    let pets = networth?.types?.pets?.total ?? 0
    let acc = networth?.types?.accessories?.total ?? 0
    let equ = networth?.types?.equipment?.total ?? 0
    let museuma = networth?.types?.museum?.total ?? 0
    let sacks = networth?.types?.sacks?.total ?? 0

    let storageec

    storageec = ec + storage
    ret = "˚**Total**:\n➣ $" + mainNum(total) + "¨ **Purse:**\n➣ $" + numberWithCommas(purse) + "¨ **Bank:**\n➣ $" + numberWithCommas(bank) + "/" + numberWithCommas(bankP) + "¨ **Armor:**\n➣ $" + numberWithCommas(armor) + "¨ **Equipment:**\n➣ $" + numberWithCommas(equ) + "¨ **Wardrobe:**\n➣ $" + numberWithCommas(wardrobe) + "¨ **Inventory:**\n➣ $" + numberWithCommas(inventory) + "¨ **Storage:**\n➣ $" + numberWithCommas(storageec) + "¨ **Pets:**\n➣ $" + numberWithCommas(pets) + "¨ **Talis:**\n➣ $" + numberWithCommas(acc) + "¨ **Museum:**\n➣ $" + numberWithCommas(museuma) + "¨ **Sacks:**\n➣ $" + numberWithCommas(sacks)
    return ret
  } catch (error) {
    return error
  }
}
class NetworthCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'networth'
    this.aliases = ['nw']
    this.description = "Checks user's networth"
  }

  async onCommand(username, message) {
    
    let args = message.split(" ")
    if (message.toLowerCase().endsWith("!nw")) {
      getNetworthFromUsername(username).then(nw => {
        if (nw.includes("[ERROR]")) {
          this.send(`/gc ${nw}`)
        }
        else {
          this.send(`/gc ${username}'s networth: ${nw.replaceAll("*", "").replaceAll("\n➣", "").replaceAll("\n", "").replaceAll(";", "").replaceAll("¨", "˚")}`)
          this.minecraft.broadcastCommandEmbed({ username: `${username}'s networth`, message: `${nw.replaceAll("¨", "\n").replace("˚", "")}` })
        }
      })
    }
    else if (message.toLowerCase().endsWith("!networth")) {
      getNetworthFromUsername(username).then(nw => {
        if (nw.includes("[ERROR]")) {
          this.send(`/gc ${nw}`)
        }
        else {
          this.send(`/gc ${username}'s networth: ${nw.replaceAll("*", "").replaceAll("\n➣", "").replaceAll("\n", "").replaceAll(";", "").replaceAll("¨", "˚")}`)
          this.minecraft.broadcastCommandEmbed({ username: `${username}'s networth`, message: `${nw.replaceAll("¨", "\n").replace("˚", "")}` })
        }
      })
    }
    else {
      getNetworthFromUsername(args[1]).then(nw => {
        if (nw.includes("[ERROR]")) {
          this.send(`/gc ${nw}`)
        }
        else {
          this.send(`/gc ${args[1]}'s networth: ${nw.replaceAll("*", "").replaceAll("\n➣", "").replaceAll("\n", "").replaceAll(";", "").replaceAll("¨", "˚")}`)
          this.minecraft.broadcastCommandEmbed({ username: `${args[1]}'s networth`, message: `${nw.replaceAll("¨", "\n").replace("˚", "")}` })
        }
      })
    }
  }
}

module.exports = NetworthCommand
