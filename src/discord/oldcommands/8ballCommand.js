const DiscordCommand = require('../../contracts/DiscordCommand')

const config = require("../../../config.json")
const fs = require('fs');

async function ask() {
    let eightball = [
        'It is certain.',
        'It is decidedly so.',
        'Without a doubt.',
        'Yes definitely.',
        'You may rely on it.',
        'As I see it, yes.',
        'Most likely.',
        'Outlook good.',
        'Yes.',
        'Signs point to yes.',
        "Don't count on it.",
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Very doubtful.',
        'No way.',
        'Maybe',
        'No.',
        'Depends on the mood of the RNGesus',
        'No',
        'Yes',
    ];
    let index = (Math.floor(Math.random() * Math.floor(eightball.length)));
    return eightball[index]


}
class EightBallCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)
    this.permission = "all"

    this.name = '8ball'
    this.description = '8ball'
  }

  onCommand(message) {
    ask().then(ans => {
        setTimeout(() => {
          this.sendMinecraftMessage(`/gc ${ans}`)

          message.channel.send({
            embeds: [{
              description: ans,
              color: 0x2A2A2A,
              timestamp: new Date(),
              footer: {
                text: "BOT",
              },
              author: {
                name: `The Magic 8 Ball`,
                icon_url: 'https://cdn.discordapp.com/attachments/1045517755044085762/1084545786886504508/mlfaJuO.png',
              },
            }],
          })
        }, 1000);
      })
  }
}

module.exports = EightBallCommand
