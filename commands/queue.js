const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'queue',
	description: 'Displays the queue',
	aliases: ['q'],
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.tag, client.user.avatarURL())
			.setTitle('Server Queue')
			.setDescription(serverQueue.songs.map(song => `**-** ${song.title}`).join('\n'))
			.setFooter('Server Queue');

		return message.channel.send(embed);
	},
};