const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
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
class PingCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'help'
    this.aliases = []
    this.description = 'Tells you to run !help in discord'
  }

  onCommand(username, message) {
    incrementNumberInJSON("MCHelpCommandCount")

      this.send(`/gc TempestBridge (Bot) has a variety of commands which can be used through the guild chat. To see all the commands, please run !help in the bridge channel in discord.`)
  }
}

module.exports = PingCommand
