const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastCalledTime.txt'
let lastRun
async function getPoke() {
    return new Promise((resolve, reject) => {
        try {
            axios.get('https://api.otakugifs.xyz/gif?reaction=poke')
                .then(response => {
                    const data = response.data;
                    fs.readFile(filename, 'utf8', (err, fileData) => {
                        if (err) reject(err);
                        const lastRunTime = parseInt(fileData) || 0;
                        const currentTime = new Date().getTime();
                        const fiveSecondsPassed = currentTime - lastRunTime >= 5000;

                        if (fiveSecondsPassed) {
                            fs.writeFile(filename, currentTime.toString(), () => {
                                // Resolve with the first image URL
                                if (data.url) {
                                    resolve(data.url);
                                } else {
                                    reject("Invalid data format or no image URL found");
                                }
                            });
                        } else {
                            resolve("Please wait 5 seconds before running this command again");
                        }
                    });
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

class PokeCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'poke'
    this.aliases = []
    this.description = 'User pokes target to summon them'
  }
  //      onFuckEmbedBroadcast({ username, message, url}) {

  onCommand(username, message) {
    let target = message.split(" ").slice(1).join(" ");
    getPoke().then(a => {
        this.send(`/gc ${username} has poked ${target}!`)
        this.minecraft.broadcastFuckEmbed({ username: username, message: `Has poked ${target}`,url:a })
    })


  }
}

module.exports = PokeCommand
