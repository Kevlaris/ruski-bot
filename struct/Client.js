const { Client } = require('discord.js');
const fs = require('fs');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableMentions: 'everyone',
		});

		this.queue = new Map();

		this.reports = new Map();

		this.logChannels = new Map();

		this.config = config;

		this.config.config = fs.readFileSync('./data/config.json', 'utf8');

		try {
			if (fs.readFileSync('./data/config_private.json', 'utf8')) this.config.private = fs.readFileSync('./data/config_private.json', 'utf8');
		}
		catch (err) {
			console.warn(err);
		}
	}
};
