const { SlashCommandBuilder } = require('discord.js');
const db = require('../services/firebase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creategear')
    .setDescription('Creats a new gear list')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of your gear build:')
            .setRequired(true)
    ),

  async execute(interaction) {
    try {
        const buildName = interaction.options.getString('name');
        const userId = interaction.user.id;
        const buildData = {
            name: buildName,
            createdAt: new Date(),
            slots: {}
        };
        await db.collection('gear_plans').doc(userId)
            .collection('builds')
            .doc(buildName)
            .set(buildData);
        await interaction.reply({ content: '✅ Successfully created!', ephemeral: true });
    }   catch (err) {
            console.error('Unable to create gear template:', err);
            await interaction.reply({ content: '❌ Unable to create a gear template.', ephemeral: true });
    }
  }
};
