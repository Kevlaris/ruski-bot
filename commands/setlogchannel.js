module.exports = {
	name: 'setlogchannel',
	description: 'Sets the log channel in the server.',
	usage: '[channel]',
	execute(message, args) {
		if(!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) {
			return message.reply('you don\'t have the permissions to change the log channel.');
		}

		const logChannel = args[0];
		if(!logChannel) {
			return message.reply('you need to specify a channel.');
		}
		if(logChannel.type === !'Channel') {
			return message.reply('you need to specify a channel.');
		}

		const logChannels = message.client.logChannels;

		const serverLogChannel = logChannels.get(message.guild.id);
		if(serverLogChannel) {
			try {
				serverLogChannel.logChannel.push(logChannel);
				serverLogChannel.logChannel.send('This is the new log channel.');
				return message.channel.send(`The new log channel is **${logChannel}**.`);
			}
			catch (err) {
				message.reply('failed to change the log channel');
				return console.error(err);
			}
		}

		const logChannelsConstruct = {
			logChannel: logChannel,
		};

		try {
			message.client.logChannels.set(message.channel.guild.id, logChannelsConstruct);
			console.log(logChannels);
			console.log(logChannels.logChannelsConstruct);
		}
		catch (error) {
			message.reply('failed to change the log channel');
			return console.error(error);
		}

		serverLogChannel.logChannel.send('This is the new log channel.');
		message.channel.send(`The new log channel is **${logChannel}**.`);
	},
};
