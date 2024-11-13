const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const fs = require('fs');

class ReqsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'reqs'
    this.aliases = []
    this.description = 'Reqs'
  }

  onCommand(username, message) {
    function readOrUpdateNumber(jsonFilePath, role) {
      // Read the JSON file
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

      role = role.toLowerCase()
      // Return the number from the JSON data based on the role
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
    const recruit = readOrUpdateNumber('/srv/Tempest/bridge/level.json', "recruit");
    const knight = readOrUpdateNumber('/srv/Tempest/bridge/level.json', "knight");
    const champion = readOrUpdateNumber('/srv/Tempest/bridge/level.json', "champion");
    const legend = readOrUpdateNumber('/srv/Tempest/bridge/level.json', "legend");


    this.send(`/gc Rank Requirements; Recruit - Skyblock Level ${recruit} | Knight - Skyblock Level ${knight} | Champion - Skyblock Level ${champion} | Legend - Skyblock Level ${legend}`)
  }
}

module.exports = ReqsCommand
