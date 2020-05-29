module.exports = {
	name: 'volume',
	description: 'Set volume (100% is 5, default is 2)',
	aliases: ['setvolume', 'v', 'vol'],
	usage: '<volume 0-100>',
	execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('You need to be in a voice channel to play music!');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		if (args[0]) {
			if (typeof args[0] === !'number') {
				return message.channel.send('The value you have specified is not a number');
			}
			else if (Number.args[0] >= 100 || Number.args[0] <= 0) {
				return message.channel.send('The value you have specified is out of range. Specify a value between 0-100.');
			}
		}
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(`I set the volume to: **${args[0]}**`);
	},
};