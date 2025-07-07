const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gear')
    .setDescription('Start building your gear set!'),

  async execute(interaction) {
    await interaction.reply({
      content: '🛠️ Gear planner loading... (UI coming soon! -Tihf)',
      ephemeral: true
    });
  }
};
