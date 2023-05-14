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

		// let channel;

		let channel;
		try {
			channel = interaction.options.get('channel').value;
		}
		catch (error) {
			console.error(error);
			channel = interaction.member.voice.channel;
		}

		if (!interaction.member.voice.channelId && !channel && !interaction.guild.me.voice.channelId) return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		if (!channel && interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });

		let queue = player.getQueue(interaction.guildId);
		if (!queue) {
			queue = player.createQueue(interaction.guild, {
				metadata: {
					channel: interaction.channel,
				},
			});
		}


		// verify vc connection
		if (!queue.connection) {
			try {
				await queue.connect(channel);
			}
			catch (err) {
				console.error(err);
				try {
					await queue.connect(channel);
				}
				catch (errr) {
					queue.destroy();
					console.error(errr);
					return await interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
				}
			}
		}
		else if (!channel) {
			channel = queue.connection.channel;
		}

		const query = interaction.options.get('video').value;

		await interaction.deferReply();

		const track = await player.search(query, {
			requestedBy: interaction.user,
		}).then(x => x.tracks[0]);
		if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

		queue.addTrack(track);
		if (!queue.nowPlaying() || queue.nowPlaying() == track) {
			queue.play();
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
		else {
			const embed = new Discord.MessageEmbed()
				.setTitle(`Added ${track.title} to the queue!`)
				.setThumbnail(track.thumbnail)
				.setURL(track.url);
			return await interaction.followUp({ embeds: [embed] });
		}
	},
};