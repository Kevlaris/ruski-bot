const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'ban',
	description: 'Bans a guild member.',
	usage: '[member] <reason>',
	async execute(message, args) {
		if(!message.member.hasPermission('BAN_MEMBERS')) return message.reply('you don\'t have the proper permissions to ban a member!');
		if(!message.channel.guild.me.hasPermission('BAN_MEMBERS')) return message.reply('I don\'t have the proper permissions to ban this member. Make sure I have the permission to ban!');


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
			if(member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you can\'t ban this member.');
		}

		var reason = args.splice(1).join(' ');
		if(!reason) reason = 'Unspecified';

		try {

			const banEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle('Member Banned')
				.addField('Member:', mentioned, true)
				.addField('Banned by:', message.author, true)
				.addField('Reason:', reason, true)
				.setFooter('Ban Log');
			message.channel.send(banEmbed);

			const bannedEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle(`You were banned from ${message.channel.guild.name}`)
				.setDescription(reason);

			try {
				await mentioned.send(bannedEmbed);
			}
			catch (error) {
				console.warn(error);
			}

			message.channel.guild.members.ban(mentioned, { reason: reason })
				.then(console.log);
		}
		catch (err) {
			console.error(err);
			return message.reply('banning process failed.');
		}
	},
};
