const Discord = require('discord.js');
const superagent = require('superagent');
const { client } = require('../index.js');

module.exports = {
	name: 'doggo',
	description: 'Gives you a random doggo picture. **>w<**',
	async execute(message) {
		const { body } = await superagent
			.get('https://random.dog/woof.json');

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle('Here, get some Doggo! >w<')
			.setImage(body.url)
			.setFooter('Doggo Footage from random.dog');

		message.channel.send(embed);
	},
};