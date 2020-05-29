module.exports = {
	name: 'setnick',
	description: 'Sets a guild member\'s nickname.',
	usage: '[member] [new nickname]',
	async execute(message, args) {
		const person = message.mentions.users.first();
		if(!person || !args[0]) return message.reply('you need to specify a guild member!');

		var member;

		try {
			member = await message.channel.guild.members.fetch(person);
		}
		catch (error) {
			member = null;
			return console.warn(error);
		}

		if(!member) return message.reply('I couldn\'t find the person you asked for.');

		const nick = args.splice(1).join(' ');
		if(!nick) return message.reply('you need to specify a new nickname for the guild member!');

		if(!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the permissions to change the person\'s nickname.');
		if(!message.channel.guild.me.hasPermission('MANAGE_NICKNAMES' || 'ADMINISTRATOR')) return message.reply('I don\'t have the proper permissions to change nicknames. Make sure I can change other people\'s nicknames!');
		if(!member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you can\'t kick this member.');

		try {
			member.setNickname(nick);
		}
		catch (error) {
			message.reply('Failed to change member\'s nickname');
			return console.error(error);
		}
		message.channel.send(`**${person}**'s new nickname is **${nick}**!`);
	},
};
