const DiscordCommand = require('../../contracts/DiscordCommand')
const { Embed } = require("../../contracts/embedHandler.js");

const fs = require('fs');

let dataFilePath = "/srv/Tempest/bridge/guildData.json"
let predeterminedRanks = ['Guild Master', 'Elder', 'Legend', 'Champion', 'Knight', 'Recruit'];

function writeDataToFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

class GuildList extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'online'
    this.aliases = ['online', 'on']
    this.description = 'Checks G Online'
  }

  async onCommand(cat) {
    const cachedMessages = [];
    const messages = new Promise((resolve, reject) => {
      const listener = (message) => {
        message = message.toString();

        cachedMessages.push(message);
        if (message.startsWith("Offline Members")) {
          bot.removeListener("message", listener);
          resolve(cachedMessages);
        }
      };

      bot.on("message", listener);
      bot.chat("/g online");

      setTimeout(() => {
        bot.removeListener("message", listener);
        reject("Command timed out. Please try again.");
      }, 5000);
    });
    const message = await messages;

    const onlineMembers = message.find((m) => m.startsWith("Online Members: "));
    const totalMembers = message.find((message) => message.startsWith("Total Members: "));

    const onlineMembersList = message;
    const online = onlineMembersList
      .flatMap((item, index) => {
        if (item.includes("-- ") === false) return;

        const nextLine = onlineMembersList[parseInt(index) + 1];
        if (nextLine.includes("●")) {
          const rank = item.replaceAll("--", "").trim();
          const players = nextLine
            .split("●")
            .map((item) => item.trim())
            .filter((item) => item);

          if (rank === undefined || players === undefined) return;
          return `\n**${rank}**\n${players.map((item) => `✦ ${item.replace("_", "\\_")}`).join(" ")}`;
        }
      })
      .filter((item) => item);

    const description = `${totalMembers}\n${onlineMembers}\n${online.join("\n")}`;
    const embed = new Embed("#2ECC71", "Online Members", description);
    cat.channel.send({
      embeds: [embed],
    })
  }
}

module.exports = GuildList