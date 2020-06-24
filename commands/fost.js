const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
const { client } = require('../index.js');

module.exports = {
	name: 'fost',
	description: 'Ad egy jó bötyár Fostot. Garantált fos. :D',
	async execute(message, args) {
		const source = 'FostTalicska';

		const img = await randomPuppy(source);

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle('Itt egy random Fost.')
			.setImage(img)
			.setURL(img);

		message.channel.send(embed);
	},
};