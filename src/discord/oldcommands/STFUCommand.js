const DiscordCommand = require('../../contracts/DiscordCommand');
const path = require('path');
const fs = require('fs');

class STFUCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all";

    this.name = 'stfu';
    this.aliases = ['person', 'stfuperson']
    this.description = 'strangle';
  }

  onCommand(message) {
    let args = this.getArgs(message);
    let user = args.shift();

    const filePath = path.resolve(__dirname, '../../assets/hands.png'); // Adjust the path as necessary

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      message.channel.send({
        files: [{
          attachment: filePath,
          name: 'hands.png'
        }],
        embeds: [{
          image: {
            url: 'attachment://hands.png',
          },
          color: 0x2A2A2A,
          timestamp: new Date(),
          footer: {
            text: 'I WILL STRANGLE YOU',
          },
        }],
      }).catch(error => {
        console.error('Error sending message:', error);
        message.channel.send({
          embeds: [{
            description: `Failed to send the embed: ${error.message}`,
            color: 0xDC143C,
          }],
        });
      });
    } else {
      message.channel.send({
        embeds: [{
          description: `File not found`,
          color: 0xDC143C,
        }],
      });
    }
  }
}

module.exports = STFUCommand;
