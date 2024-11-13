const minecraftCommand = require("../../contracts/minecraftCommand.js");
const config = require("../../../config.json");

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
class EightBallCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = '8ball'
    this.description = '8ball'
  }

  onCommand(username, message) {
    ask().then(ans => {
        setTimeout(() => {
            this.send(`/gc ${ans}`)
            this.minecraft.broadcastCommandEmbed3({ username: `The Magic 8 Ball`, message: `${ans}`, icon: "https://cdn.discordapp.com/attachments/1045517755044085762/1084545786886504508/mlfaJuO.png" })
        }, 1000);
      })
  }
}

module.exports = EightBallCommand
