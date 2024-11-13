const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastDogCalledTime.txt'
let lastRun
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