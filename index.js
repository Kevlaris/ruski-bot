const fs = require('fs');
const { botName, botAuthor, testGuildId } = require('./data/config.json');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const dateFormat = require('dateformat');
require('dotenv').config();

let token = process.env.TOKEN;

if (token == null) token = require('./data/config_private.json').token;

const botIntents = new Intents();
botIntents.add(Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, 'GUILD_VOICE_STATES');

const botClient = require('./struct/Client');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Player } = require('discord-player');
const client = new Client({
	intents: botIntents,
	token: token,
});
module.exports = { client: client };

/*
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commandFiles.set(command.name, command);
}
*/

client.on('error', console.error);
client.on('warn', console.warn);

client.once('ready', () => {
	console.log('');
	console.log(`Hello there, ${botAuthor}!`);
	console.log(`${botName} is ready to launch in ${client.guilds.cache.size} servers :D`);
	console.log('');
	const now = new Date();
	console.log(dateFormat(now, 'yyyy/hh/dd, HH:MM:ss (dddd)'));

	client.user.setActivity('your commands ;)', { type: 'LISTENING' });

	client.player = new Player(client);

	let commands;
	const testGuild = client.guilds.cache.get(testGuildId);
	if (testGuild) {
		commands = testGuild.commands;
	}
	else {
		commands = client.application.commands;
	}

	commands.create({
		name: 'play',
		description: 'Plays a YouTube video.',
		options: [
			{
				type: 3,
				name: 'video',
				description: 'Link or title of the video to be played',
				required: true,
			},
		],
	});
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) { return; }

	const { commandName } = interaction;

	if (commandName === 'play') {
		require('./play.js').execute(interaction);
	}
});

/*
client.on('messageCreate', (message) => {
	console.log(message.content);

	const prefixes = JSON.parse(fs.readFileSync('./data/prefixes.json', 'utf8'));
	if (!prefixes[message.channel.guild.id]) {
		prefixes[message.channel.guild.id] = {
			prefixes: require('./data/config.json').prefix,
		};
	}
	const prefix = prefixes[message.channel.guild.id].prefixes;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.usable == false) return message.reply('this command is not usable.');

	try {
		command.execute(message, args, client);
	}

	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
*/

client.login(token);