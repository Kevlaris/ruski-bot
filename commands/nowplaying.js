const index = require('../index.js');
const Discord = require('discord.js');

module.exports = {
	name: 'nowplaying',
	description: 'Prints currently playing track',
	options: [],
	async execute(interaction) {
		const queue = await index.player.getQueue(interaction.guildId);
		if (!queue) {
			return await interaction.reply({ content: 'Couldn\'t find queue in server', ephemeral: true });
		}
		const track = queue.nowPlaying();
		if (!track) {
			return await interaction.reply({ content: 'There\'s nothing playing right now', ephemeral: true });
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.avatarURL() })
			.setTitle(`🎶 Now playing: ${track.title}`)
			.setDescription(`By: ${track.author}`)
			.setThumbnail(track.thumbnail)
			.setURL(track.url)
			.addField('Progress', queue.createProgressBar({ queue: false, timecodes: true }))
			.setFooter({ text: `Requested by: ${track.requestedBy.username}`, iconURL: track.requestedBy.avatarURL() });

		const isCurrentTrack = (element) => element == track;
		const trackIdx = queue.tracks.findIndex(isCurrentTrack);

		embed.addField('Next up', queue.tracks[trackIdx + 1].title);

		return await interaction.reply({ embeds: [embed] });
	},
};