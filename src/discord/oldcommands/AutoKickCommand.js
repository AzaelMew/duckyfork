const DiscordCommand = require('../../contracts/DiscordCommand');
const axios = require('axios');
const fs = require('fs');

let ini = [];
let adv = [];
let vet = [];
let champ = [];

async function getUUIDFromUsername(username) {
  if (!(/^[a-zA-Z0-9_]{2,16}$/mg.test(username))) {
    return "Error";
  } else {
    const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + username);
    return data.id;
  }
}

async function getUsernameFromUUID(uuid) {
  const { data } = await axios.get('https://sessionserver.mojang.com/session/minecraft/profile/' + uuid);
  return data.name;
}

function readOrUpdateNumber(jsonFilePath, role) {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  role = role.toLowerCase();
  if (role === 'legend') {
    return jsonData.legend;
  } else if (role === 'champion') {
    return jsonData.champion;
  } else if (role === 'knight') {
    return jsonData.knight;
  } else if (role === 'recruit') {
    return jsonData.recruit;
  } else {
    throw new Error('Invalid role. Use "Legend", "Champion", "Knight", or "Recruit".');
  }
}

async function getGMemberFromUUID(uuid, message) {
  try {
    if (!uuid) {
      uuid = "a"; // Assign a dummy value if UUID is undefined
    }

    const { data } = await axios.get(`https://api.hypixel.net/v2/guild?key=${config.minecraft.API.hypixelAPIkey}&player=${uuid}`);

    if (!data.guild || data.guild.name_lower !== "tempestsky") {
      return "This player is not in our guild.";
    }

    let currentNumber = readOrUpdateNumber('/srv/Tempest/bridge/level.json', "recruit") * 100;

    for (let i = 0; i < data.guild.members.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      try {
        await getActivity(data.guild.members[i].uuid, data.guild.members[i].rank, currentNumber);
      } catch (error) {
        console.log("Error fetching activity for member:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching guild data:", error.message);
    return "An error has occurred.";
  }
}

async function getActivity(uuid, rank, min) {
  try {
    const { data } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${config.minecraft.API.hypixelAPIkey}&uuid=${uuid}`);
    let name = await getUsernameFromUUID(uuid);

    const exemptPlayers = ["Rioiyo", "YesPleases", "zabbir", "Frindlo", "Nico_the_Creator", "WhenCarrot", "Legendaryspirits", "MistyTM", "Meir231", "Azael_Nya", "Vallekoen"];
    if (exemptPlayers.includes(name)) {
      console.log(`${name} is excluded from being kicked.`);
      return;
    }

    if (rank === "Elder" || rank === "Guild Master") {
      console.log(`${name} has a privileged rank and will not be kicked.`);
      return;
    }

    let highestLevel = 0;
    for (let profile of Object.values(data.profiles || {})) {
      let level = profile?.members[uuid]?.leveling?.experience || 0;
      if (level > highestLevel) {
        highestLevel = level;
      }
    }

    console.log(`${name}'s highest level: ${highestLevel}, minimum required: ${min}`);

    if (highestLevel < min) {
      ini.push(name);
      console.log(`${name} will be kicked for not meeting the requirements.`);
    } else {
      console.log(`${name} meets the requirements and will not be kicked.`);
    }
  } catch (error) {
    console.error("Error fetching player activity data:", error);
  }
}

async function getGMemberFromUsername(username, message) {
  const uuid = await getUUIDFromUsername(username);
  return await getGMemberFromUUID(uuid, message);
}

class AutoKickCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "mod";
    this.name = 'autokick';
    this.description = 'Kicks people who do not meet the requirements.';
  }

  async onCommand(message) {
    let args = message.content.trim().split(/\s+/);

    if (args.length < 2 || args[1].toLowerCase() !== 'sky') {
      return;
    }

    message.channel.send({
      embeds: [{
        description: `Getting player data`,
        color: 0x47F049
      }]
    });

    console.log("Fetching guild members...");
    await getGMemberFromUsername("xephor_ex", message);
    console.log("Members to be kicked:", ini);

    let interval = 750; // Delay between each kick in milliseconds
    for (let index = 0; index < ini.length; index++) {
      let el = ini[index];
      setTimeout(() => {
        console.log(`Kicking member: ${el}`);
        this.sendMinecraftMessage(`/g kick ${el} You do not meet the reqs for the guild.`);
      }, index * interval);
    }

    message.channel.send({
      embeds: [{
        description: `Let the purge... **BEGIN!**`,
        color: 0x47F049
      }]
    });
  }
}

module.exports = AutoKickCommand;
