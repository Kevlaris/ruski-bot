const { botAuthor, botName, botVersion } = require('../data/config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Shows info about the bot',
	options: [],
	async execute(interaction) {
		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
			.setTitle('Info')
			.addFields(
				{ name: 'Bot\'s name', value: botName, inline: true },
				{ name: 'Author', value: botAuthor, inline: true },
				{ name: 'Version', value: botVersion, inline: true },
				{ name: 'Server counter', value: interaction.client.guilds.cache.size, inline: true },
			)
			.setFooter({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() });
		return await interaction.reply({ embeds: embed });
	},
};