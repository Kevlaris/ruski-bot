const Discord = require('discord.js');
const superagent = require('superagent');
const { client } = require('../index.js');

module.exports = {
	name: 'cat',
	description: 'Gives you a random cat picture. **purr**',
	async execute(message) {
		const { body } = await superagent
			.get('http://aws.random.cat//meow');

		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle('Here, get some cat! *purr*')
			.setImage(body.file)
			.setFooter('Cat Footage from random.cat');

		message.channel.send(embed);
	},
};