const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'serverinfo',
	description: 'Shows server info.',
	aliases: ['serverinf', 'guildinfo', 'guild'],
	execute(message) {
		if (message.channel.type === 'dm') return message.channel.send('You need to be in a server to use this command.');

		const guild = message.channel.guild;

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.tag, client.user.avatarURL)
			.setTitle(guild.name)
			.setDescription('Server Information')
			.addFields(
				{ name: 'Owner', value: guild.owner.user.tag, inline: true },
				{ name: 'Number of Members', value: guild.memberCount, inline:true },
				{ name: 'Region', value: guild.region, inline: true },
			)
			.setFooter('Server Information');
		message.channel.send(embed);
		console.log(guild.icon);
		console.log(client.user.avatarURL);
	},
};
