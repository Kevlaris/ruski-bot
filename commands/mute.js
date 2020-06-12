const Discord = require('discord.js');
const [ client ] = 

module.exports = {
	name: 'mute',
	description: 'Mute a member.',
	usaege: '[member] <reason>',
	usable: false,
	async execute(message, args) {
		const guild = message.guild;

        if(!message.member.hasPermission('MUTE_MEMBERS' || 'ADMINISTRATOR')) return message.reply('you don\'t have the proper permissions to manage roles!');

		if(!message.channel.guild.me.hasPermission('ADMINISTRATOR' || 'MANAGE_MEMBERS' || 'MANAGE_ROLES')) return message.reply('I don\'t have the proper permissions to manage roles. Make sure I have the permissions!');

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
			if(member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you can\'t mute this member.');
		}

		var reason = args.splice(1).join(' ');
		if(!reason) reason = 'Unspecified';

		const muterole = guild.roles.cache.find(role => role.name === 'Muted');
		if (muterole) {
			try {
				mentioned.roles.add(muterole);

				try {
					mentioned.send(`You were muted in **${guild.name}**.`);
					mentioned.send(`Reason: *${reason}*`);
				}
				catch (warn) {
					console.warn(warn);
				}

				const embed = new Discord.MessageEmbed()
					.setAuthor(client.user.tag, client.user.avatarURL())
					.setTitle('Member Muted')
					.addFields(
						{ name: 'Member', value: mentioned, inline: true },
						{ name: 'Reason', value: reason, inline: true },
						{ name: 'Muted by', value: message.author, inline: true },
					)
					.setFooter('Mute Log');

				return message.channel.send(embed);
			}
			catch (err) {
				message.reply(`I couldn't set the role to ${mentioned}.`);
				return console.error(err);
			}
		}

		guild.roles.create({
			data: {
				name: 'Muted',
				color: 'DEFAULT',
				hoist: false,
				permissions: [ 'VIEW_CHANNEL', 'CONNECT', 'READ_MESSAGE_HISTORY' ],
			},
		});
	},
};