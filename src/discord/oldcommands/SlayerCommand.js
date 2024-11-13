const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const fs = require('fs');
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
function numberWithCommas(x) {
  if(x>999815672){
    x = x.toString().split(".")[0]
    x = x.toString().slice(0, -6) + "815672";
  }
  else{
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
async function getSlayerFromUser(username) {
  return await getSlayerFromUUID(await getUUIDFromUsername(username))
}
async function getSlayerFromUUID(name){
    try{
      if (name == undefined){
        name = "a"
      }
	if (name == "f03695547707486ab2308518f04102f7") return
      const { data } = await axios.get('http://localhost:3000/v1/profiles/'+name+'?key=77ac89bad625453facaa36457eb3cf5c')
    let wslayerEXP = data.data[0]?.slayer?.wolf.xp
    let zslayerEXP = data.data[0]?.slayer?.zombie.xp
    let sslayerEXP = data.data[0]?.slayer?.spider.xp
    let eslayerEXP = data.data[0]?.slayer?.enderman.xp
    let bslayerEXP = data.data[0]?.slayer?.blaze.xp
    let vslayerEXP = data.data[0]?.slayer?.vampire.xp
    let slayerEXP = numberWithCommas(wslayerEXP+zslayerEXP+sslayerEXP+eslayerEXP+bslayerEXP+vslayerEXP)
    let wslayerLVL = data.data[0]?.slayer?.wolf.level
    let zslayerLVL = data.data[0]?.slayer?.zombie.level
    let sslayerLVL = data.data[0]?.slayer?.spider.level
    let eslayerLVL = data.data[0]?.slayer?.enderman.level
    let bslayerLVL = data.data[0]?.slayer?.blaze.level
    let vslayerLVL = data.data[0]?.slayer?.vampire.level
    let stats = `˚**Total Slayer EXP**:\n➣  ${slayerEXP}; **Zombie level**:\n➣  ${zslayerLVL} - ${numberWithCommas(zslayerEXP)}xp; **Spider level**:\n➣  ${sslayerLVL} - ${numberWithCommas(sslayerEXP)}xp; **Wolf level**:\n➣  ${wslayerLVL} - ${numberWithCommas(wslayerEXP)}xp; **Enderman level**:\n➣  ${eslayerLVL} - ${numberWithCommas(eslayerEXP)}xp; **Blaze level**:\n➣  ${bslayerLVL} - ${numberWithCommas(bslayerEXP)}xp; **Vampire level**:\n➣  ${vslayerLVL} - ${numberWithCommas(vslayerEXP)}xp`
    return stats
}
catch (error) {
  return `[ERROR] ${error.response.data.reason}`
}
}

class SlayerCommand extends DiscordCommand {
    constructor(discord) {
      super(discord)
      this.permission = "all"
      this.name = 'slayer'
      this.aliases = ["slayers"]
      this.description = "Says users slayers"
    }
  
  onCommand(message) {
    incrementNumberInJSON("DCSlayerCommandCount")
    let args = this.getArgs(message)
    let user = args.shift()
    getSlayerFromUser(user).then(stats => {
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
      else{
        this.sendMinecraftMessage(`/gc ${user}'s slayers: ${stats.replaceAll("*", "").replaceAll("\n➣", "").replaceAll("\n", "").replaceAll(";", "˚").replaceAll("¨", "˚")}`)
        message.channel.send({
          embeds: [{
            description: stats.replaceAll(";", "\n").replaceAll(":","").replaceAll("˚",""),
            color: 0x2A2A2A,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
            author: {
              name: `${user}'s slayers`,
              icon_url: 'https://www.mc-heads.net/avatar/' + user,
            },
          }],
        })
      }
    })
  }
  }
  
  module.exports = SlayerCommand
