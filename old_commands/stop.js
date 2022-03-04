module.exports = {
	name: 'stop',
	description: 'Stops playing and leaves channel',
	aliases: ['dc', 'disconnect'],
	execute(message) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('you need to be in a voice channel to play music!');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		message.channel.send('Stopped the music for ya!');
	},
};