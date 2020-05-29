module.exports = {
	name: 'nick',
	description: 'Sets the bot\'s nickname.',
	usage: '[new nickname]',
	execute(message, args) {
		const nick = args.splice(0).join(' ');
		if(!nick) return message.reply('you need to specify a new nickname for me!');

		if(!message.author.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the permissions to change my nickname.');

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