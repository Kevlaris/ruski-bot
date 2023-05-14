const index = require('../index.js');
const Discord = require('discord.js');

module.exports = {
	name: 'skip',
	description: 'Skips current track',
	options: [],
	async execute(interaction) {
		const queue = await index.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server' });
		}

		let track;

		try {
			const isCurrentTrack = (element) => element == track;
			const trackIdx = queue.tracks.findIndex(isCurrentTrack);
			track = await queue.tracks[trackIdx + 1];
			await queue.skip();
		}
		catch (error) {
			console.error(error);
			return await interaction.reply({ content: 'Couldn\'t skip track' });
		}
		await interaction.reply({ content: 'Skipped current track' });

		try {
			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
				.setTitle(`🎶 Now playing: ${track.title}`)
				.setDescription(`By: ${track.author}`)
				.setThumbnail(track.thumbnail)
				.setURL(track.url)
				.addField('Duration', track.duration, true)
				.setFooter({ text: `Requested by: ${track.requestedBy.username}`, iconURL: track.requestedBy.avatarURL() });

			return await interaction.followUp({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			return;
		}
	},
};