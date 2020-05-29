const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'unban',
	description: 'Unbans a banned guild member.',
	usage: '[member] <reason>',
	async execute(message, args) {
		const User = args[0];
		var reason = args.slice(1).join(' ');
		if (!User) return message.reply('you need to specify a banned guild member to unban.');
		if (!reason) reason = 'Unspecified';

		try {

			message.guild.fetchBans()
				.then(bans => {
					if (bans.some(u => User.includes(u.username))) {
						const member = bans.find(user => user.username === User);

						message.guild.unban(member.id, reason);

						const unbanEmbed = new Discord.MessageEmbed()
				            .setAuthor(client.user.tag, client.user.avatarURL())
				            .setTitle('Member Unbanned')
			            	.addField('Member:', User, true)
				            .addField('Unbanned by:', message.author, true)
				            .addField('Reason:', reason, true)
				            .setFooter('Unban Log');
		            	message.channel.send(unbanEmbed);

		            	const unbannedEmbed = new Discord.MessageEmbed()
			            	.setAuthor(client.user.tag, client.user.avatarURL())
			            	.setTitle(`You were unbanned from ${message.channel.guild.name}`)
			            	.setDescription(reason);

		            	try {
		            		User.send(unbannedEmbed);
		            	}
		            	catch (err) {
		            		console.warn(err);
		            	}
					}
					else if (bans.some(u => User.includes(u.id))) {

						message.guild.unban(User, reason);

						const unbanEmbed = new Discord.MessageEmbed()
				            .setAuthor(client.user.tag, client.user.avatarURL())
				            .setTitle('Member Unbanned')
			            	.addField('Member:', User, true)
				            .addField('Unbanned by:', message.author, true)
				            .addField('Reason:', reason, true)
				            .setFooter('Unban Log');
		            	message.channel.send(unbanEmbed);

		            	const unbannedEmbed = new Discord.MessageEmbed()
			            	.setAuthor(client.user.tag, client.user.avatarURL())
			            	.setTitle(`You were unbanned from ${message.channel.guild.name}`)
			            	.setDescription(reason);

		            	try {
		            		User.send(unbannedEmbed);
		            	}
		            	catch (err) {
		            		return console.warn(err);
		            	}
					}
					else {return message.reply('this person is not banned.');}
				});
		}
		catch (error) {
			message.channel.send('Unbanning process failed.');
			return console.log('Unbanning process failed: ' + error);
		}
	},
};