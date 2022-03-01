const { Player } = require('discord-player');
const { Client, Intents } = require('discord.js');
const fs = require('fs');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableMentions: 'everyone',
			intents: new Intents(Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES),
		});

		this.commandFiles = new Map();

		this.player = new Player(this);

		this.config = config;

		this.config.intents = new Intents(Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES);

		this.config.config = fs.readFileSync('./data/config.json', 'utf8');

		try {
			if (fs.readFileSync('./data/config_private.json', 'utf8')) this.config.private = fs.readFileSync('./data/config_private.json', 'utf8');
		}
		catch (err) {
			console.warn(err);
		}
	}
};
