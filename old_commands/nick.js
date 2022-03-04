module.exports = {
	name: 'nick',
	description: 'Sets or resets the bot\'s nickname.',
	usage: '[new nickname]',
	execute(message, args) {
		const nick = args.splice(0).join(' ');
		if(!nick) {
			try {
				message.channel.guild.me.setNickname('');
				return message.channel.send('I\'ve reset my nickname.');
			}
			catch (err) {
				message.reply('failed to reset my nickname.');
				return console.error(err);
			}
		}

		if(!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the permissions to change my nickname.');

		try {
			message.channel.guild.me.setNickname(nick);
		}
		catch (error) {
			message.channel.send('Failed to change my nickname');
			return console.error(error);
		}
		message.channel.send(`My new nickname is **${nick}**.`);
	},
};