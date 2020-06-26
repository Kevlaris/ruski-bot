const Discord = require('discord.js');
const { invLink } = require('../data/config.json');

module.exports = {
	name: 'invitelink',
	description: 'Gives you a link to invite Ruski Bot into your server.',
	aliases: ['invlink', 'invite', 'inv'],
	execute(message, _, client) {
		const embed = new Discord.MessageEmbed()
			.setAuthor(client.user.tag, client.user.avatarURL())
			.setTitle('Click here to invite me!')
			.setURL(invLink);

		message.channel.send(embed);
	},
};