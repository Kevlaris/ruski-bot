const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
const { client } = require('../index.js');

module.exports = {
	name: 'meme',
	description: 'Gives you a random meme from r/memes or r/dankmemes.',
	async execute(message) {
		const source = ['memes', 'dankmemes'];
		const random = source[Math.floor(Math.random() * source.length)];

		const img = await randomPuppy(random);

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle(`Here's a random meme from r/${random}`)
			.setImage(img)
			.setURL(img);

		message.channel.send(embed);
	},
};