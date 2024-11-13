const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

class GHCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft)

        this.name = 'farmhelper'
        this.aliases = ["fh"]
        this.description = 'Gives needed farm info'
    }

    onCommand(username, message) {
        let args = message.toLowerCase().split(" ")
        if (args[1] == "cocoa") {
            this.send(`/gc 150 speed w/o Sprint | 55° Angle Pitch`)
        }
        else if (args[1] == "cane") {
            this.send(`/gc 327 Speed | 135° or 45° Angle Yaw`)
        }
        else if (args[1] == "potato") {
            this.send(`/gc Normal: 116 Speed (4 Lanes) or 93 Speed (5 Lanes) | 90° Yaw`)
        }
        else if (args[1] == "carrot") {
            this.send(`/gc Normal: 116 Speed (4 Lanes) or 93 Speed (5 Lanes) | 90° Yaw`)
        }
        else if (args[1] == "wart") {
            this.send(`/gc Normal: 116 Speed (4 Lanes) or 93 Speed (5 Lanes) | 90° Yaw`)
        }
        else if (args[1] == "wheat") {
            this.send(`/gc Normal: 116 Speed (4 Lanes) or 93 Speed (5 Lanes) | 90° Yaw`)
        }
        else if (args[1] == "pumpkin") {
            this.send(`/gc Normal: 155 Speed (Vertical Pumpkin) or 327 Speed (2 Lane) | 90° (Vert) and 145° or 35° (2 Lane) Angle Yaw`)

        }
        else if (args[1] == "melon") {
            this.send(`/gc Normal: 155 Speed (Vertical Pumpkin) or 327 Speed (2 Lane) | 90° (Vert) and 145° or 35° (2 Lane) Angle Yaw`)

        }
        else if (args[1] == "cactus") {
            this.send(`/gc 400 Speed | 90° Angle Yaw`)

        }
        else if (args[1] == "mushroom") {
            this.send(`/gc "233 speed 30degree offset towards way you walking, hold down forwards running into the mushroom block" - and i'm not touching this again.`)

        }
        else {
            setTimeout(() => {
                this.send(`/gc Cocoa, Cane, Potato, Carrot, Wheat, Pumpkin, Melon, Cactus, Wart, Mushroom`)
            }, 500);
            this.send(`/gc Specify which crop you want to know about. The options are:`)

        }
    }
}

module.exports = GHCommand
