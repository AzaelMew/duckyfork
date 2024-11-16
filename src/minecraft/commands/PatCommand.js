const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastCalledTime.txt'
let lastRun
async function getPat() {
    return new Promise((resolve, reject) => {
        try {
            axios.get('https://api.otakugifs.xyz/gif?reaction=pat')
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

class PatCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'pat'
    this.aliases = []
    this.description = 'Replies with `User pat target!` to the user'
  }
  //      onFuckEmbedBroadcast({ username, message, url}) {

  onCommand(username, message) {
    let target = message.split(" ").slice(1).join(" ");
    getPat().then(a => {
        this.send(`/gc ${username} pat ${target}!`)
        this.minecraft.broadcastFuckEmbed({ username: username, message: `pat ${target}`,url:a })
    })


  }
}

module.exports = PatCommand
