const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const commands = await rest.get(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID)
    );

    for (const command of commands) {
      await rest.delete(
        Routes.applicationCommand(process.env.DISCORD_CLIENT_ID, command.id)
      );
      console.log(`✅ Deleted global command: ${command.name}`);
    }

    console.log('✅ All global commands deleted.');
  } catch (err) {
    console.error('❌ Error deleting global commands:', err);
  }
})();
