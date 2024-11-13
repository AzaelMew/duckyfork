const MinecraftManager = require("./minecraft/MinecraftManager.js");
const DiscordManager = require("./discord/DiscordManager.js");
const ExpressManager = require('./express/ExpressManager')
// eslint-disable-next-line no-unused-vars
const Configuration = require("./Configuration.js");
// eslint-disable-next-line no-unused-vars
const Updater = require("./Updater.js");

class Application {
  async register() {
    this.discord = new DiscordManager(this);
    this.minecraft = new MinecraftManager(this);
    this.express = new ExpressManager(this)

    this.discord.setBridge(this.minecraft);
    this.minecraft.setBridge(this.discord);
  }

  async connect() {
    this.discord.connect();
    this.minecraft.connect();
    this.express.initialize()
  }
}

module.exports = new Application();
