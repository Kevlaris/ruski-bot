const { Client } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableMentions: 'everyone',
		});

		this.queue = new Map();

		this.reports = new Map();

		this.logChannels = new Map();

		this.config = config;
	}
};
