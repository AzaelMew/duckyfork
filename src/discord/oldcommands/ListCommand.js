const { ApplicationFlagsBitField } = require('discord.js');
const DiscordCommand = require('../../contracts/DiscordCommand')
const { Embed } = require("../../contracts/embedHandler.js");
const axios = require("axios")
const fs = require('fs');

let dataFilePath = "/srv/Tempest/bridge/guildData.json"
let predeterminedRanks = ['Guild Master', 'Elder', 'Legend', 'Champion', 'Knight', 'Recruit'];

function writeDataToFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
const executeCommand = async (bot) => {
  if (!bot || !bot._client.chat) {
    throw new HypixelDiscordChatBridgeError(
      "Bot doesn't seem to be connected to Hypixel. Please try again."
    );
  }

  const cachedMessages = [];
  const messages = new Promise((resolve, reject) => {
    const listener = (message) => {
      message = message.toString();
      cachedMessages.push(message);

      if (message.startsWith("Online Members")) {
        bot.removeListener("message", listener);
        resolve(cachedMessages);
      }
    };

    bot.on("message", listener);
    bot.chat("/g list");

    setTimeout(() => {
      bot.removeListener("message", listener);
      reject("Command timed out. Please try again.");
    }, 5000);
  });

  try {
    const message = await messages;
    const onlineMembers = message.find((m) => m.startsWith("Online Members: ")).replace("Online Members: ", "");
    const totalMembers = message.find((m) => m.startsWith("Total Members: ")).replace("Total Members: ", "");

    const onlineMembersList = message;
    const online = onlineMembersList
      .flatMap((item, index) => {
        if (!item.includes("-- ")) return;

        const nextLine = onlineMembersList[parseInt(index) + 1];
        if (nextLine.includes("●")) {
          const rank = item.replaceAll("--", "").trim();
          const players = nextLine
            .split("●")
            .map((item) => item.trim())
            .filter((item) => item);

          if (!rank || !players) return;

          return { rank, players };
        }
      })
      .filter((item) => item);

    // Return mapped data instead of sending it as a follow-up.
    return {
      totalMembers,
      onlineMembers,
      online,
    };
  } catch (error) {
    console.error("Error processing the command:", error);
    throw new Error(error);
  }
};
const sortOnline = (online) => {
  // Define the rank order for sorting
  const rankOrder = ["Guild Master", "Elder", "Legend", "Champion", "Knight", "Recruit"];

  // Sort the `online` array based on the rank order
  const sortedOnline = online
    .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)) // Sort by rank order
    .flatMap(({ rank, players }) => {
      if (!rank || !players || players.length === 0) return; // Skip invalid or empty entries

      // Format the rank and player list
      const formattedRank = `\n**${rank}**`;

      const formattedPlayers = players.map((player) => `✦ ${player.replace("_", "\\_").replace("[VIP]", "").replace("[VIP+]", "").replace("[MVP]", "").replace("[MVP+]", "").replace("[MVP++]", "").replace("[YOUTUBE]", "")}`).join(" ");

      return `${formattedRank}\n${formattedPlayers}`;
    })
    .filter(Boolean); // Remove undefined entries

  return sortedOnline;
};
const deepMergeGuildData = (data1, data2) => {
  // Define the rank hierarchy
  const rankOrder = ["Guild Master", "Elder", "Legend", "Champion", "Knight", "Recruit"];

  // Combine totalMembers and onlineMembers as numbers
  const totalMembers = (parseInt(data1.totalMembers, 10) || 0) + (parseInt(data2.totalMembers, 10) || 0);
  const onlineMembers = (parseInt(data1.onlineMembers, 10) || 0) + (parseInt(data2.onlineMembers, 10) || 0);

  // Merge online array based on rank
  const onlineMap = new Map();

  [...data1.online, ...data2.online].forEach(({ rank, players }) => {
    if (!onlineMap.has(rank)) {
      onlineMap.set(rank, new Set(players)); // Use Set to avoid duplicate players
    } else {
      players.forEach((player) => onlineMap.get(rank).add(player)); // Add players to the existing rank
    }
  });

  // Convert Map back to array
  let online = Array.from(onlineMap, ([rank, playersSet]) => ({
    rank,
    players: Array.from(playersSet),
  }));

  // Sort the online array by the predefined rank order
  online = online.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

  return {
    totalMembers: totalMembers.toString(),
    onlineMembers: onlineMembers.toString(),
    online,
  };
};

class GuildList extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'list'
    this.description = 'Checks G list'
  }

  async onCommand(cat) {
    let skyData = await executeCommand(bot)
    const { data } = await axios.post('http://192.168.0.6:3001/api/list', { message: "a" }, { headers: { Authorization: "yonkowashere" } })
    const combinedData = deepMergeGuildData(skyData, data.data)
    const description = `**Total Members** ${combinedData.totalMembers}\n**Online Members:** ${combinedData.onlineMembers}\n${sortOnline(combinedData.online).join("\n")}`;
    const embed = new Embed("#2ECC71", "Guild List", description);

    cat.channel.send({
      embeds: [embed],
    })
  }
}

module.exports = GuildList