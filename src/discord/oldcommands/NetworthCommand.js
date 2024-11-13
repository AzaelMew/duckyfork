const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');
const { env } = require('process');
const { getNetworth } = require('skyhelper-networth');
function incrementNumberInJSON(itemName) {
  // Set the file path for the JSON file
  const jsonFilePath = '/srv/Tempest/bridge/data.json';

  // Read the existing JSON file or create an empty object
  let jsonData = {};
  try {
    const jsonString = fs.readFileSync(jsonFilePath, 'utf8');
    jsonData = JSON.parse(jsonString);
  } catch (error) {
    // File does not exist or is not valid JSON, create an empty object
    console.error('Error reading JSON file:', error.message);
  }

  // Get the current number for the specified item or default to 0
  const currentNumber = jsonData[itemName] || 0;

  // Increment the number by 1
  const newNumber = currentNumber + 1;

  // Update the JSON with the new number
  jsonData[itemName] = newNumber;

  // Write the updated JSON back to the file
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');


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
  console.log("a")
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
  ret = "˚**Total**:\n➣ $" + mainNum(total) + "¨ **Purse:**\n➣ $" + numberWithCommas(purse) + "¨ **Bank:**\n➣ $" + numberWithCommas(bank)+"/"+numberWithCommas(bankP) + "¨ **Armor:**\n➣ $" + numberWithCommas(armor) + "¨ **Equipment:**\n➣ $" + numberWithCommas(equ) + "¨ **Wardrobe:**\n➣ $" + numberWithCommas(wardrobe) + "¨ **Inventory:**\n➣ $" + numberWithCommas(inventory) + "¨ **Storage:**\n➣ $" + numberWithCommas(storageec) + "¨ **Pets:**\n➣ $" + numberWithCommas(pets) + "¨ **Talis:**\n➣ $" + numberWithCommas(acc) + "¨ **Museum:**\n➣ $" + numberWithCommas(museuma) + "¨ **Sacks:**\n➣ $" + numberWithCommas(sacks)
  return ret
  }catch{
    console.log("error or smth")
  }
}

/*
async function getNetworthFromUUID(name) {
  try {
    if (name == undefined) {
      name = "a"
    }
    if (name == "f03695547707486ab2308518f04102f7") return

    const { data } = await axios.get("http://localhost:3000/v2/profiles/" + name + "?key=77ac89bad625453facaa36457eb3cf5c")
    let total = data.data[0]?.networth?.networth ?? 0
    let purse = data.data[0]?.purse ?? 0
    let bank = data.data[0]?.bank ?? 0
    let ret
    let armor = data.data[0]?.networth?.types?.armor?.total ?? 0
    let wardrobe = data.data[0]?.networth?.types?.wardrobe?.total ?? 0
    let inventory = data.data[0]?.networth?.types?.inventory?.total ?? 0
    let ec = data.data[0]?.networth?.types?.enderchest?.total ?? 0
    let storage = data.data[0]?.networth?.types?.storage?.total ?? 0
    let pets = data.data[0]?.networth?.types?.pets?.total ?? 0
    let acc = data.data[0]?.networth?.types?.accessories?.total ?? 0
    let equ = data.data[0]?.networth?.types?.equipment?.total ?? 0
    let museum = data.data[0]?.networth?.types?.museum?.total ?? 0
    let sacks = data.data[0]?.networth?.types?.sacks?.total ?? 0

    let storageec

    storageec = ec + storage
    ret = "˚**Total**:\n➣ $" + mainNum(total) + "¨ **Purse:**\n➣ $" + numberWithCommas(purse) + "¨ **Bank:**\n➣ $" + numberWithCommas(bank) + "¨ **Armor:**\n➣ $" + numberWithCommas(armor) + "¨ **Equipment:**\n➣ $" + numberWithCommas(equ) + "¨ **Wardrobe:**\n➣ $" + numberWithCommas(wardrobe) + "¨ **Inventory:**\n➣ $" + numberWithCommas(inventory) + "¨ **Storage:**\n➣ $" + numberWithCommas(storageec) + "¨ **Pets:**\n➣ $" + numberWithCommas(pets) + "¨ **Talis:**\n➣ $" + numberWithCommas(acc) + "¨ **Museum:**\n➣ $" + numberWithCommas(museum) + "¨ **Sacks:**\n➣ $" + numberWithCommas(sacks)
    return ret

  }
  catch (error) {
    return `[ERROR] ${error.response.data.reason}`
  }
}
*/
class NetworthCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'networth'
    this.aliases = ["nw"]
    this.description = `Checks user's networth`
  }

  onCommand(message) {
    incrementNumberInJSON("DCNWCommandCount")
    let args = this.getArgs(message)
    let user = args.shift()

    getNetworthFromUsername(user).then(ret => {
      if (ret.includes("[ERROR]")) {
        this.sendMinecraftMessage(`/gc ${ret}`)
        message.channel.send({
          embeds: [{
            description: ret,
            color: 0x2A2A2A,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
            author: {
              name: `${user}'s networth`,
              icon_url: 'https://www.mc-heads.net/avatar/' + user,
            },
          }],
        })
      }
      else {
        this.sendMinecraftMessage(`/gc ${user}'s networth: ${ret.replaceAll("*", "").replaceAll("\n➣", "").replaceAll("\n", "").replaceAll(";", "").replaceAll("¨", "˚")}`)
        message.channel.send({
          embeds: [{
            description: ret.replaceAll("¨", "\n").replace("˚", ""),
            color: 0x2A2A2A,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
            author: {
              name: `${user}'s networth`,
              icon_url: 'https://www.mc-heads.net/avatar/' + user,
            },
          }],
        })
      }
    })
  }
}

module.exports = NetworthCommand
