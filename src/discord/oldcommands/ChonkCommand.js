const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastDogCalledTime.txt'
let lastRun


class ChonkCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = 'chonk'
    this.description = 'bigrat'
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()

        message.channel.send({
          embeds: [{
            image: {
              url: "https://bigrat.monster/media/bigrat.jpg",
            },
            color: 0x2A2A2A,
            timestamp: new Date(),
            footer: {
              text: "BOT",
            },
          }],
        })
      }
    }
  


module.exports = ChonkCommand