module.exports = {
	name: 'clear',
	description: 'Deletes messages.',
	usage: '[number]',
	aliases: ['purge', 'delete'],
	async execute(message, args) {
		const amount = args[0];

		if (!message.member.hasPermission('MANAGE_MESSAGES' || 'MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the permissions to delete messages.');
		if (!message.channel.guild.me.hasPermission('MANAGE_MESSAGES')) return message.reply('I don\'t have the proper permissions to delete messages.');

		if (!amount) return message.reply('you haven\'t specified a number.');
		if (isNaN(amount)) return message.reply('you haven\'t specified a number.');

		if (amount > 100) return message.reply('you can`t delete more than 100 messages at once!');
		if (amount < 1) return message.reply('you have to delete at least 1 message!');

		try {
			const messages = await message.channel.messages.fetch({ limit: amount });
			message.channel.bulkDelete(messages);
		}
		catch (err) {
			console.error(err);
		}
	},
};
