const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastCalledTime.txt'
let lastRun


async function getSlap() {
    return new Promise((resolve, reject) => {
        try {
            axios.get('https://api.otakugifs.xyz/gif?reaction=slap')
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

class SlapCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)
    this.permission = "all"

        this.name = 'slap'
        this.aliases = []
        this.description = 'Slaps specified user'
    }

    onCommand(message) {
        let args = this.getArgs(message)
        let user = args.shift()
        let target = message.content.split(" ").slice(1).join(" ");
        let mcuser = target
        if(!user) return
        if(message?.mentions?.users?.first()){
            mcuser = target.replace(`<@${message.mentions.users.first().id}>`,message.mentions.users.first().globalName)
        }
        getSlap().then(Slap => {
            if (Slap == "Please wait 5 seconds before running this command again") {
                message.channel.send({
                    embeds: [{
                        description: "Please wait 5 seconds before running this command again",
                        color: 0x2A2A2A,
                        timestamp: new Date(),
                        footer: {
                            text: "BOT",
                        },
                    }],
                })
            } else {
                setTimeout(() => {
                    this.sendMinecraftMessage(`/gc ${message.author.globalName} slapped ${mcuser}!`)
                }, 350);
                message.channel.send({
                    embeds: [{
                        description: `${message.author} has slapped ${target}!`,
                        image: {
                            url: Slap,
                        },
                        color: 0x2A2A2A,
                        timestamp: new Date(),
                        footer: {
                            text: "BOT",
                        },
                    }],
                })
            }
        })
    }
}
module.exports = SlapCommand