module.exports = {
	name: 'mute',
	description: 'Mute a member.',
	usaege: '[member] <reason>',
	usable: false,
	async execute(message, args) {
        if(!message.member.hasPermission('MUTE_MEMBERS' || 'ADMINISTRATOR')) return message.reply('you don\'t have the proper permissions to kick a member!');

		if(!message.channel.guild.me.hasPermission('MUTE_MEMBERS' || 'ADMINISTRATOR')) return message.reply('I don\'t have the proper permissions to kick this member. Make sure I have the permission to kick!');

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

        
	}
}