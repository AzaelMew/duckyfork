const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
let kickables = []

function toMilli(days){
  return days * 86400000;
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
async function getUsernameFromUUID(uuid) {
    const { data } = await axios.get('https://sessionserver.mojang.com/session/minecraft/profile/' + uuid)
    let username = data.name
    return username
}
async function getGMemberFromUUID(uuid, message) {
  try {
    // Fetch guild data and handle errors
    const { data } = await axios.get(`https://api.hypixel.net/v2/guild?key=${config.minecraft.API.hypixelAPIkey}&player=${uuid}`);

    if (!data.guild) {
      console.log("Guild data not found.");
      return;
    }

    if (data.guild.name_lower !== "tempestsky") {
      console.log("This player is not in our guild.");
      return;
    }

    const members = data.guild.members;

    if (!Array.isArray(members)) {
      console.log("Guild members data is not an array.");
      return;
    }

    console.log("Number of guild members:", members.length);

    kickables = [];

    for (let i = 0; i < members.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      try {
        await getActivity(members[i].uuid, message, members[i].rank);
      } catch (error) {
        console.log("Error in getActivity:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching guild data:", error);
  }
}


async function getActivity(uuid, message, rank) {
  try {
    const { data } = await axios.get(`https://api.hypixel.net/v2/player?uuid=${uuid}&key=${config.minecraft.API.hypixelAPIkey}`);
    let lastLogin = data.player.lastLogin;

    if (data.player.displayname === "Rioiyo" || data.player.displayname === "YesPleases" || data.player.displayname === "zabbir" || data.player.displayname === "Frindlo" || data.player.displayname === "Nico_the_Creator" || data.player.displayname === "WhenCarrot" || data.player.displayname === "Legendaryspirits" || data.player.displayname === "MistyTM" || data.player.displayname === "Meir231" || data.player.displayname === "Azael_Nya" || data.player.displayname === "Vallekoen") {
      console.log(`${data.player.displayname} is excluded from being kicked.`);
      return;
    }

    if (rank === "Elder" || rank === "Guild Master") {
      console.log(`${data.player.displayname} has a privileged rank and will not be kicked.`);
      return;
    }

    if (new Date().getTime() - lastLogin > toMilli(25)) {
      kickables.push(data.player.displayname);
      console.log(`${data.player.displayname} will be kicked due to inactivity.`);
      console.log("Kickables:", kickables);
    } else {
      console.log(`${data.player.displayname} will not be kicked.`);
    }

    return kickables;
  } catch (error) {
    console.error("Error fetching player data:", error);
    return [];
  }
}


async function getGMemberFromUsername(username, message) {
  return await getGMemberFromUUID(await getUUIDFromUsername(username), message)
}
class InactiveCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "commander"

    this.name = 'kickinactive'
    this.description = 'Kicks inactive people.'
  }

  onCommand(message) {
    let args = message.content.trim().split(/\s+/);

    if (args.length < 2 || args[1].toLowerCase() !== 'sky') {
      return;
    }

    kickables = []
    getGMemberFromUsername("xephor_ex", message).then(kickabes => {
      let interval = 750; // how much time should the delay between two iterations be (in milliseconds)?
      for (let index = 0; index < (kickables).length; ++index) {
        let el = kickables[index]
        setTimeout(() => {
          this.sendMinecraftMessage(`/g kick ${el} Kicked due to inactivity, you're free to re apply once you're active.`)
        }, index * interval);
      };
    })
    message.channel.send({
      embeds: [{
        description: `Kicking inactive users...`,
        color: 0x47F049
      }]
    })
  }
}
module.exports = InactiveCommand