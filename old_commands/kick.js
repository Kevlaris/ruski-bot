const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'kick',
	description: 'Kicks a guild member.',
	usage: '[member] <reason>',
	async execute(message, args) {
		if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply('you don\'t have the proper permissions to kick a member!');

		if(!message.channel.guild.me.hasPermission('KICK_MEMBERS')) return message.reply('I don\'t have the proper permissions to kick this member. Make sure I have the permission to kick!');

		const mentioned = message.mentions.users.first();
		if(!mentioned || !args[0]) return message.reply('you didn\'t mention anyone!');

		var member;

		try {
			member = await message.channel.guild.members.fetch(mentioned);
		}
		catch (error) {
			member = null;
			console.error(error);
		}

		if(!member) return message.reply('I couldn\'t find the specified member.');

		if(message.author === !message.channel.guild.owner) {
			if(member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you can\'t kick this member.');
		}

		var reason = args.splice(1).join(' ');
		if(!reason) reason = 'Unspecified';

		try {

			const kickEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle('Member Kicked')
				.addField('Member:', mentioned, true)
				.addField('Kicked by:', message.author, true)
				.addField('Reason:', reason, true)
				.setFooter('Kick Log');
			message.channel.send(kickEmbed);

			const kickedEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle(`You were kicked from ${message.channel.guild.name}`)
				.setDescription(reason);

			try {
				await mentioned.send(kickedEmbed);
			}
			catch (error) {
				console.warn(error);
			}

			member.kick(reason);
		}
		catch (err) {
			console.log(err);
			return message.reply('kicking process failed.');
		}
	},
};
