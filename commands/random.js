module.exports = {
	name: 'random',
	description: 'Gives a random number between 1 and specified number. Default is 6.',
	usage: '(max-number)',
	execute(message, args) {
		try {
			if (!args[0]) {
				const random = Math.floor(Math.random() * 7) + 1;
				return message.channel.send(`**${random}**`);
			}

			else if (args[0]) {
				const random = Math.floor(Math.random() * args[0]) + 1;
				return message.channel.send(`**${random}**`);
			}
		}
		catch (error) {
			message.reply('there was an error while generating a random value.');
			return console.error(error);
		}
	},
};