const index = require('../index.js');
const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Lists the queue',
	options: [],
	async execute(interaction) {
		const queue = await index.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server' });
		}

		const tracksArray = new Array(queue.tracks.length);
		tracksArray[0] = `**Now Playing:** ${queue.nowPlaying().title}`;
		for (let i = 0; i < queue.tracks.length; i++) {
			const track = queue.tracks[i];
			tracksArray[i + 1] = `**#${i + 2}** - ${track.title}, ${track.duration}`;
		}

		const trackList = tracksArray.join('\n');

		try {
			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
				.setTitle(`Server queue of **${interaction.guild.name}**`)
				.setDescription(trackList)
				.addField('Total length', queue.totalTime, true)
				.setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });
			return await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			return;
		}
	},
};