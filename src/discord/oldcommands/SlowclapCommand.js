const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json");
const axios = require("axios");
const { time } = require('console');
const fs = require('fs');
const filename = 'lastCalledTime.txt'
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
                                incrementNumberInJSON("SlowClapCommand")
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

class SlowClapCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)
    this.permission = "all"

        this.name = 'slowclap'
        this.aliases = []
        this.description = 'User shall slow clap'
    }

    onCommand(message) {
        let args = this.getArgs(message)

        getSlowClap().then(SlowClap => {
            if (SlowClap == "Please wait 5 seconds before running this command again") {
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
                this.sendMinecraftMessage(`/gc ${message.author.username} is slow clapping!`)
                message.channel.send({
                    embeds: [{
                        description: `${message.author} is slow clapping!`,
                        image: {
                            url: SlowClap,
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
module.exports = SlowClapCommand