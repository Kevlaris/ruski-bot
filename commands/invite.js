const Discord = require('discord.js');
const { invLink } = require('../data/config.json');

module.exports = {
	name: 'invite',
	description: 'Gives you a link to invite the bot into your server',
	async execute(interaction) {
		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
			.setTitle('Click here to invite me!')
			.setURL(invLink);
		return await interaction.reply({ embeds: embed });
	},
};