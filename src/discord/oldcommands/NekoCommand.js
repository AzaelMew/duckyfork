const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");

async function getNeko() {
    const { data } = await axios.get('https://nekos.best/api/v2/neko')
    return data.results[0].url
}

class NekoCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'neko'
    this.description = 'neko'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()

    getNeko().then(neko => {
        message.channel.send({
            embeds: [{
                image: {
                    url: neko,
                  },
                color: 0x2A2A2A,
                timestamp: new Date(),
                footer: {
                    text: "BOT",
                },
            }],
        })
    })
  }
}

module.exports = NekoCommand