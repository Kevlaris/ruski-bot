/* eslint-disable no-lonely-if */
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
let yt_api_key = process.env.yt_api_key;
const fs = require('fs');

if (yt_api_key == null) yt_api_key = require('../data/config_private.json').yt_api_key;

const Discord = require('discord.js');
const { client } = require('../index.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { join } = require('path');

const yt = new YouTube(yt_api_key);

module.exports = {
	name: 'play',
	description: 'Plays a Youtube video.',
	usage: '[link]',
	aliases: ['p', 'start'],
	async execute(interaction, args) {
		const searchString = args;
		const url = args[0].replace(/<(.+)>/g, '$1');

		const channel = await interaction.guild.channels.fetch('817283371406327828');
		// console.log(channel);

		if (!channel) return interaction.reply('You need to be in a voice channel to play music!');
		// const permissions = channel.permissionsFor(interaction.client.user);
		// if (!permissions.has('CONNECT')) return interaction.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		// if (!permissions.has('SPEAK')) return interaction.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

		try {
			var video = await yt.getVideo(url);
		}
		catch {
			try {
				const videos = await yt.searchVideos(searchString, 1);
				var video = await yt.getVideoByID(videos[0].id);
				// console.log(video);
			}
			catch (error) {
				console.error(error);
				return interaction.reply('I couldn\'t find any videos with that URL/name.');
			}
		}

		let thumbnail;
		if (!video.thumbnails.maxres) {
			thumbnail = video.thumbnails.high;
		}
		else {
			thumbnail = video.thumbnails.maxres;
		}

		// console.log(interaction.channel);

		const serverQueue = interaction.client.queue.get(interaction.guild.id);
		const song = {
			id: video.id.replace(/^[a-zA-Z0-9-_]{11}$/),
			title: video.title,
			url: 'https://www.youtube.com/watch?v=' + video.id,
			thumbnail: thumbnail.url,
			publisherChannel: video.channel.title,
			lengthSeconds: video.duration.seconds,
			lengthMinutes: video.duration.minutes,
			lengthHours: video.duration.hours,
		};
		// console.log(song);

		if (serverQueue) {
			serverQueue.songs.push(song);

			const queueEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: client.user.tag, iconURL: client.user.avatarURL() })
				.setTitle(`✅ ${song.title} Has been added to the queue!`)
				.setDescription(`Uploaded By: ${song.publisherChannel}`)
				.setURL(song.url)
				.setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });

			return interaction.channel.reply({ embeds: [ queueEmbed ] });
		}

		const queueConstruct = {
			textChannel: interaction.client.guilds.resolve(interaction.guildId).channels.resolve(interaction.channelId),
			voiceChannel: channel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true,
		};
		interaction.client.queue.set(interaction.guildId, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = interaction.client.queue.get(interaction.guildId);
			if (!song) {
				player.stop();
				queue.connection.destroy();
				interaction.client.queue.delete(interaction.guildId);
				return;
			}

			const player = await createAudioPlayer();
			const resource = await createAudioResource(ytdl(song.url));
			await queue.connection.subscribe(player);
			await player.play(resource);
			console.log(player);

			player.on(AudioPlayerStatus.Idle, () => {
				queue.songs.shift();
				play(queue.songs[0]);
			});

			let videoLength;
			if (song.lengthSeconds) {
				if (song.lengthMinutes) {
					if(song.lengthHours) {
						if (song.lengthSeconds.toString().length === 1 && song.lengthMinutes.toString().length === 1 && song.lengthHours.toString().length === 1) {
							videoLength = `0${song.lengthHours}:0${song.lengthMinutes}:0${song.lengthSeconds}`;
						}

						else if (song.lengthSeconds.toString().length === 1 && song.lengthMinutes.toString().length === 1) {
							videoLength = `${song.lengthHours}:0${song.lengthMinutes}:0${song.lengthSeconds}`;
						}

						else if (song.lengthSeconds.toString().length === 1 && song.lengthHours.toString().length === 1) {
							videoLength = `0${song.lengthHours}:${song.lengthMinutes}:0${song.lengthSeconds}`;
						}

						else if (song.lengthHours.toString().length === 1 && song.lengthMinutes.toString().length === 1) {
							videoLength = `0${song.lengthHours}:0${song.lengthMinutes}:${song.lengthSeconds}`;
						}

						else if (song.lengthSeconds.toString().length === 1) {
							videoLength = `${song.lengthMinutes}:0${song.lengthSeconds}`;
						}

						else if (song.lengthMinutes.toString().length === 1) {
							videoLength = `0${song.lengthMinutes}:${song.lengthSeconds}`;
						}

						else {
							videoLength = `${song.lengthHours}:${song.lengthMinutes}:${song.lengthSeconds}`;
						}
					}

					else {
						if (song.lengthSeconds.toString().length === 1 && song.lengthMinutes.toString().length === 1) {
							videoLength = `0${song.lengthMinutes}:0${song.lengthSeconds}`;
						}

						else if (song.lengthSeconds.toString().length === 1) {
							videoLength = `${song.lengthMinutes}:0${song.lengthSeconds}`;
						}

						else if (song.lengthMinutes.toString().length === 1) {
							videoLength = `0${song.lengthMinutes}:${song.lengthSeconds}`;
						}

						else {
							videoLength = `${song.lengthMinutes}:${song.lengthSeconds}`;
						}
					}
				}

				else if (song.lengthSeconds.toString().length === 1) {
					videoLength = `0${song.lengthSeconds}`;
				}

				else {videoLength = song.lengthSeconds;}
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: client.user.tag, iconURL: client.user.avatarURL() })
				.setTitle(`🎶 Now playing: ${song.title}`)
				.setDescription(`By: ${song.publisherChannel}`)
				.setThumbnail(song.thumbnail)
				.setURL(song.url)
				.addFields(
					{ name: 'Duration', value: videoLength, inline: true },
				)
				.setFooter({ text: `Requested by: ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });
			interaction.reply({ embeds: [ embed ] });
		};

		let connection;

		try {
			connection = joinVoiceChannel({
				channelId: '817283371406327828',
				guildId: '624280910900232212',
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		}
		catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			interaction.client.queue.delete(interaction.guild.id);
			await connection.destroy();
			return interaction.channel.send('I could not join the voice channel');
		}
	},
};
