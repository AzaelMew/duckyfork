const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastCalledTime.txt'
let lastRun

async function getSlowClap() {
    return new Promise((resolve, reject) => {
        try {
            let url = ['https://api.otakugifs.xyz/gif?reaction=slowclap','https://api.otakugifs.xyz/gif?reaction=clap']
             axios.get(url[Math.round(Math.random())])
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

class SlowClapCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'slowclap'
    this.aliases = []
    this.description = 'Replies with User is `Slowclapping`'
  }
  //      onFuckEmbedBroadcast({ username, message, url}) {

  onCommand(username) {
    getSlowClap().then(a => {
        this.send(`/gc ${username} is slowclapping!`)
        this.minecraft.broadcastFuckEmbed({ username: username, message: `is slow clapping`,url:a })
    })


  }
}

module.exports = SlowClapCommand
