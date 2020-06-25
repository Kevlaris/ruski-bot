module.exports = {
	name: 'setlogchannel',
	description: 'Sets the log channel in the server.',
	usage: '[channel]',
	usable: true,
	execute(message, args) {
		if(!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) {
			return message.reply('you don\'t have the permissions to change the log channel.');
		}

		const logChannel_raw = args[0];
		if(!logChannel_raw) {
			return message.reply('you need to specify a channel.');
		}
		if(logChannel_raw.type === !'Channel') {
			return message.reply('you need to specify a channel.');
		}

		const guild = message.channel.guild;

		const logChannel_id = logChannel_raw.substring(2, logChannel_raw.length - 1);

		const logChannel = guild.channels.cache.get(logChannel_id);

		const logChannels = message.client.logChannels;

		if(logChannels[guild.id]) {
			try {
				message.client.logChannels[guild.id].channel = logChannel;
				message.client.logChannels = logChannels;
				logChannel.send('This channel is the new log channel for this guild.');
				return message.channel.send(`The new log channel for this guild is ${logChannel_raw}.`);
			}
			catch (error) {
				message.reply('I couldn\'t set the log channel.');
				return console.error(error);
			}
		}

		const logChannelsConstruct = {
			channel: logChannel,
		};

		try {
			logChannels.set(guild.id, logChannelsConstruct);
			logChannel.send('This channel is the new log channel for this guild.');
			return message.channel.send(`The new log channel for this guild is ${logChannel_raw}.`);
		}
		catch (error) {
			message.reply('I couldn\'t set the log channel.');
			return console.error(error);
		}
	},
};
