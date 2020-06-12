const Discord = require('discord.js');
const { client } = require('../index.js');

module.exports = {
	name: 'report',
	description: 'Reports a guild member.',
	usage: '[@member] [reason]',
	usable: false,
	async execute(message, args) {
		const mentioned = message.mentions.users.first();
		if(!mentioned || !args[0]) return message.reply('you need to specify a member to report!');

		var member;

		try {
			member = await message.channel.guild.members.fetch(mentioned);
		}
		catch (error) {
			member = null;
			console.error(error);
		}

		if(!member) return message.reply('I couldn\'t find the specified member.');

		const reason = args.splice(1).join(' ');

		const serverLogChannel = message.client.logChannels.get(message.channel.guild.id);
		if(!serverLogChannel || !serverLogChannel.logChannel) return message.reply('I can\'t detect a log channel in your guild. Ask an administrator to set a log channel.');

		const serverReports = message.channel.guild.client.reports.get(message.channel.guild.id);

		const report = {
			reported: member,
			reportedBy: message.member,
			reason: reason,
		};

		if(serverReports) {
			serverReports.reports.push(report);

			message.channel.send('**Report added!**');

			const logEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle('Report')
				.setDescription(message.channel.guild.name)
				.addFields(
					{ name: 'Reported person', value: mentioned, inline: true },
					{ name: 'Reported by', value: message.author, inline: true },
					{ name: 'Channel', value: message.channel, inline: true },
					{ name: 'Reason', value: reason, inline: false },
				)
				.setFooter('Report Log');

			return serverLogChannel.logChannel.send(logEmbed);
		}

		const reportsConstruct = {
			reports: [],
		};

		message.client.reports.set(message.channel.guild.id, reportsConstruct);

		try {
			reportsConstruct.reports.push(report);
			const logEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.tag, client.user.avatarURL())
				.setTitle('Report')
				.setDescription(message.channel.guild.name)
				.addFields(
					{ name: 'Reported person', value: mentioned, inline: true },
					{ name: 'Reported by', value: message.author, inline: true },
					{ name: 'Channel', value: message.channel, inline: true },
					{ name: 'Reason', value: reason, inline: false },
				)
				.setFooter('Report Log');

			serverLogChannel.logChannel.send(logEmbed);
		}
		catch (err) {
			message.reply('there was an error making the report.');
			return console.error(err);
		}

	},
};