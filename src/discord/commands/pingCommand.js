const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Shows the latency of the bot.",

  execute: async (interaction) => {
    const clientLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🏓 Pong!")
      .setDescription(`Client Latency: \`${clientLatency}ms\`\nAPI Latency: \`${apiLatency}ms\``)


    interaction.followUp({ embeds: [embed] });
  },
};
