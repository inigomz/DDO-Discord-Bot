const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    try{
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    } catch (err) {
        console.error(`Failed to load command ${file}`, err)
    }
  
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    try{
        const event = require(`./events/${file}`);
        if (event.once) client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    } catch (err) {
        console.error(`Failed to load event ${file}:`, err);
    }
  
}

client.login(process.env.DISCORD_TOKEN);
if (!process.env.DISCORD_TOKEN) {
    console.error("DISCORD_TOKEN not set in .env");
    process.exit(1);
}
