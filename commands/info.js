const { botAuthor, botName, botVersion } = require('../config.json');
const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'info',
	description: 'Shows info about the bot.',
	execute(message) {
		const embed = new Discord.MessageEmbed
			.setTitle('Info')
			.addFields(
				{ name: 'Bot\'s name', value: botName, inline: true },
				{ name: 'Author', value: botAuthor, inline: true },
				{ name: 'Version', value: botVersion, inline: true },
				{ name: 'Server counter', value: client.guilds.cache.size, inline: true },
			);

		message.channel.send(embed);
	},
};