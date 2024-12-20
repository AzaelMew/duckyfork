const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const helperFunctions = require("./helperFunctions.js");
const config = require("../../config.json");
const axios = require("axios");

async function apicall(message) {
  try {
    const response = await axios.post('http://192.168.0.6:3001/api/command', { message: message }, { headers: { Authorization: "yonkowashere" } })
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused: Aria is offline');
    } else {
      console.error('An error occurred:', error.message);
    }
  }
}
class minecraftCommand {
  constructor(minecraft) {
    this.minecraft = minecraft;
  }

  getArgs(message) {
    const args = message.split(" ");

    args.shift();

    return args;
  }

  send(message, n = 1) {
    if (bot === undefined && bot._client.chat === undefined) {
      return;
    }
    apicall(message)

    const listener = async (msg) => {
      if (
        msg.toString().includes("You are sending commands too fast! Please slow down.") &&
        !msg.toString().includes(":")
      ) {
        bot.removeListener("message", listener);
        n++;

        if (n >= 5) {
          return this.send("/gc Command failed to send message after 5 attempts. Please try again later.");
        }

        await delay(250);

        return this.send(message);
      } else if (
        msg.toString().includes("You cannot say the same message twice!") === true &&
        msg.toString().includes(":") === false
      ) {
        bot.removeListener("message", listener);
        n++;

        if (n >= 5) {
          return this.send("/gc Command failed to send message after 5 attempts. Please try again later.");
        }

        await delay(250);

        return this.send(
          `${message} {${helperFunctions.generateID(config.minecraft.bot.messageRepeatBypassLength)}}`,
          n + 1,
        );
      }
    };

    bot.once("message", listener);
    bot.chat(message);

    setTimeout(() => {
      bot.removeListener("message", listener);
    }, 500);

  }
  warpSend(message, n = 1) {
    if (bot === undefined && bot._client.chat === undefined) {
      return;
    }

    const listener = async (msg) => {
      if (
        msg.toString().includes("You are sending commands too fast! Please slow down.") &&
        !msg.toString().includes(":")
      ) {
        bot.removeListener("message", listener);
        n++;

        if (n >= 5) {
          return this.send("/gc Command failed to send message after 5 attempts. Please try again later.");
        }

        await delay(250);

        return this.send(message);
      } else if (
        msg.toString().includes("You cannot say the same message twice!") === true &&
        msg.toString().includes(":") === false
      ) {
        bot.removeListener("message", listener);
        n++;

        if (n >= 5) {
          return this.send("/gc Command failed to send message after 5 attempts. Please try again later.");
        }

        await delay(250);

        return this.send(
          `${message} {${helperFunctions.generateID(config.minecraft.bot.messageRepeatBypassLength)}}`,
          n + 1,
        );
      }
    };

    bot.once("message", listener);
    bot.chat(message);

    setTimeout(() => {
      bot.removeListener("message", listener);
    }, 500);
  }
  onCommand(player, message) {
    throw new Error("Command onCommand method is not implemented yet!");
  }
}

module.exports = minecraftCommand;
