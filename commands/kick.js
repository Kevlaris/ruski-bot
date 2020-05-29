const Discord = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'Kicks a guild member.',
	usage: '[member] <reason>',
	async execute(message, args) {
		if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply('you don\'t have the proper permissions to kick a member!');

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

		var reason = args.splice(1).join(' ');
		if(!reason) reason = 'Unspecified';

		const kickEmbed = new Discord.MessageEmbed()
			.setTitle('Member Kicked')
			.addField('Member:', mentioned, true)
			.addField('Kicked by:', message.author, true)
			.addField('Reason:', reason, true);
		message.channel.send(kickEmbed);

		const kickedEmbed = new Discord.MessageEmbed()
			.setTitle(`You were kicked from ${message.channel.guild.name}`)
			.setDescription(reason);

		try {
			await mentioned.send(kickedEmbed);
		}
		catch (error) {
			console.warn(error);
		}

		member.kick(reason);
	},
};
