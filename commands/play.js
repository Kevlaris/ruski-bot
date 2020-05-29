const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const yt_api_key = process.env.yt_api_key;
const Discord = require('discord.js');
const { client } = require('../index.js');

const yt = new YouTube(yt_api_key);

module.exports = {
	name: 'play',
	description: 'Plays a Youtube video.',
	usage: '[link]',
	aliases: ['p', 'start'],
	async execute(message, args) {
		const searchString = args.slice(0).join(' ');
		const url = args[0].replace(/<(.+)>/g, '$1');

		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

		try {
			var video = await yt.getVideo(url);
		}
		catch {
			try {
				const videos = await yt.searchVideos(searchString, 1);
				var video = await yt.getVideoByID(videos[0].id);
				console.log(video);
			}
			catch (error) {
				console.error(error);
				return message.channel.send('I couldn\'t find any videos with that URL/name.');
			}
		}

		var thumbnail;
		if (!video.thumbnails.maxres) {
			thumbnail = video.thumbnails.high;
		}
		else {
			thumbnail = video.thumbnails.maxres;
		}

		const serverQueue = message.client.queue.get(message.guild.id);
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
		console.log(song);

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true,
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url))
				.on('finish', () => {
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);

			var length;
			if (song.lengthSeconds) {
				if (song.lengthMinutes) {
					if(song.lengthHours) {
						length = `${song.lengthHours}:${song.lengthMinutes}:${song.lengthSeconds}`;
					}
					else {length = `${song.lengthMinutes}:${song.lengthSeconds}`;}
				}
				else {length = song.lengthSeconds;}
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.displayAvatarURL)
				.setTitle(`🎶 Now playing: ${song.title}`)
				.setDescription(`By: ${song.publisherChannel}`)
				.setThumbnail(thumbnail)
				.setURL(song.url)
				.addFields(
					{ name: 'Duration', value: length, inline: true },
				)
				.setFooter(`Requested by: ${message.author.username}`, message.author.displayAvatarURL);


			queue.textChannel.send(embed);
		};

		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		}
		catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send('I could not join the voice channel');
		}
	},
};
