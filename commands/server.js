const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'server',
	description: 'Shows server info',
	options: [],
	async execute(interaction) {
		if (interaction.channel.type === 'DM') return await interaction.reply({ contents: 'You need to be in a server to use this command.', ephemeral: true });

		const guild = interaction.guild;
		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: client.user.tag, iconURL: client.user.avatarURL() })
			.setTitle(guild.name)
			.setDescription('Server Information')
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: 'Owner', value: guild.owner.user.tag, inline: true },
				{ name: 'Number of Members', value: guild.memberCount, inline:true },
				{ name: 'Region', value: guild.region, inline: true },
			)
			.setFooter({ name: 'Server Information' });
		return await interaction.reply({ embeds: embed });
	},
};
