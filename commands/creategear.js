const { SlashCommandBuilder } = require('discord.js');
const db = require('../services/firebase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('firestoretest')
    .setDescription('Tests Firestore connectivity'),

  async execute(interaction) {
    try {
      await db.collection('test').add({
        timestamp: new Date(),
        message: 'Hello from Discord bot!',
      });

      await interaction.reply({ content: '✅ Firestore write succeeded!', ephemeral: true });
    } catch (err) {
      console.error('❌ Firestore write failed:', err);
      await interaction.reply({ content: '❌ Firestore write failed.', ephemeral: true });
    }
  }
};
