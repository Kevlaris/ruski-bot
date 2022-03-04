const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'warn',
	description: 'Warns a guild member.',
	usage: '[member] <reason>',
	async execute(message, args) {
		if(!message.member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the proper permissions to warn a member!');

		const mentioned = message.mentions.users.first();
		if(!mentioned || !args[0]) return message.reply('you didn\'t mention anyone!');

		var member;

		try {
			member = await message.channel.guild.members.fetch(mentioned);
		}
		catch (error) {
			member = null;
			console.log(error);
		}

		if(!member) return message.reply('I couldn\'t find the specified member.');

		if(message.author === !message.channel.guild.owner) {
			if(member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you can\'t warn this member.');
		}

		var reason = args.splice(1).join(' ');
		if(!reason) reason = 'Unspecified';

		try {

			const warnEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle('Member Warned')
				.addField('Member:', mentioned, true)
				.addField('Warned by:', message.author, true)
				.addField('Reason:', reason, true)
				.setFooter('Warn Log');
			message.channel.send(warnEmbed);

			const warnedEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle(`You were warned in ${message.channel.guild.name}`)
				.setDescription(reason);

			try {
				await mentioned.send(warnedEmbed);
			}
			catch (error) {
				console.warn(error);
			}
		}
		catch (err) {
			console.log(err);
			return message.reply('warning process failed.');
		}
	},
};
