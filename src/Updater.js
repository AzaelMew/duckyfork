const { exec } = require("child_process");
const config = require("../config.json");
const Logger = require("./Logger.js");
const cron = require("node-cron");

function updateCode() {
  if (config.other.autoUpdater === false) {
    return;
  }

}

cron.schedule(`0 */${config.other.autoUpdaterInterval} * * *`, () => updateCode());
updateCode();
