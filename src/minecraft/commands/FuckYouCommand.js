const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastCalledTime.txt'
let lastRun
async function getfuckyou() {
    return new Promise((resolve, reject) => {
        try {
            axios.get('https://waifu.it/api/v4/midfing', {headers: {
                Authorization: "NTM3MzMxNzk3OTA2OTQ4MTA3.MTczMDAzOTQyMw--.68be21ac0",
            }})
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

class FuckYouCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'fuckyou'
    this.aliases = []
    this.description = 'Replies with `Fuck You!` to the user'
  }
  //      onFuckEmbedBroadcast({ username, message, url}) {

  onCommand(username, message) {
    let target = message.split(" ").slice(1).join(" ");
    getfuckyou().then(a => { 
        this.send(`/gc ${username}: Fuck you ${target}!`)
        this.minecraft.broadcastFuckEmbed({ username: username, message: `Fuck you ${target}`,url:a })
    })
  }
}

module.exports = FuckYouCommand
