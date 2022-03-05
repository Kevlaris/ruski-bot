const { Player } = require('discord-player');
const index = require('../index.js');
const Discord = require('discord.js');

module.exports = {
	name: 'play',
	description: 'Plays a video in a Voice Channel',
	options: [
		{
			type: 3,
			name: 'video',
			description: 'Link or title of the video to be played',
			required: true,
		},
		{
			type: 7,
			name: 'channel',
			description: 'Voice Channel to play the music in',
			required: false,
		},
	],
	async execute(interaction) {
		let player = index.player;
		if (player == null) {
			player = new Player(interaction.client);
			index.player = player;
		}

		let channel;

		try {
			channel = interaction.options.get('channel').value;
		}
		catch (error) {
			console.error(error);
		}

		if (!interaction.member.voice.channelId && !channel) return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		if (!channel && interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });

		let queue;
		if (index.queues) { queue = index.queues.get(interaction.guildId); }
		else { index.queues = new Discord.Collection(); }
		if (!queue) {
			queue = player.createQueue(interaction.guild, {
				metadata: {
					channel: interaction.channel,
				},
			});
			index.queues.set(interaction.guildId, queue);
		}

		// verify vc connection
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch (err) {
			console.error(err);
			try {
				await queue.connect(channel);
			}
			catch (errr) {
				queue.destroy();
				queue.remove(interaction.guild);
				console.error(errr);
				return await interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
			}
		}

		const query = interaction.options.get('video').value;

		await interaction.deferReply();

		const track = await player.search(query, {
			requestedBy: interaction.user,
		}).then(x => x.tracks[0]);
		if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

		queue.addTrack(track);
		queue.play();

		return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
	},
};