module.exports = {
	name: 'setnick',
	description: 'Sets or resets a guild member\'s nickname.',
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
		if(!nick) {
			try {
				member.setNickname('');
				return message.channel.send(`I've reset **${person}**'s nickname.`);
			}
			catch (err) {
				message.reply(`failed to reset **${person}**'s nickname.`);
				return console.error(err);
			}
		}

		if(!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the permissions to change the person\'s nickname.');
		if(!message.channel.guild.me.hasPermission('MANAGE_NICKNAMES' || 'ADMINISTRATOR')) return message.reply('I don\'t have the proper permissions to change nicknames. Make sure I can change other people\'s nicknames!');

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
