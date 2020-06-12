const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const { prefix, botName, botVersion, botAuthor } = require('./config.json');
const Discord = require('discord.js');
const token = process.env.token;

const MusicClient = require('./struct/Client');
const client = new MusicClient({ token: process.env.DISCORD_TOKEN, prefix: process.env.DISCORD_PREFIX });
module.exports = { client: client };

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('error', console.error);
client.on('warn', console.warn);

client.once('ready', () => {
	console.log(`Hello there, ${botAuthor}!`);
	console.log(`${botName} is ready to launch in ${client.guilds.cache.size} servers :D`);
	client.user.setActivity('your commands ;)', { type: 'LISTENING' });
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.usable == false) return message.reply('this command is not usable.');

	try {
		command.execute(message, args);
	}

	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);