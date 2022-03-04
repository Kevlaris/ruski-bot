const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
const { client } = require('../index.js');

module.exports = {
	name: 'prequelmeme',
	description: 'Gives you a random meme from r/PrequelMemes.',
	async execute(message, args) {
		const source = 'PrequelMemes';

		const img = await randomPuppy(source);

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle('Here\'s a random PrequelMeme')
			.setImage(img)
			.setURL(img);

		message.channel.send(embed);
	},
};