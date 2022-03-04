module.exports = {
	name: 'sendnudes',
	async execute(message, args) {
		const defaultNude = 'Someone just wanted to send you a nude.. watch out for your friends! ;3';

		const mentioned = message.mentions.users.first();
		if(!mentioned) return message.reply('you need to mention someone! ;3');

		var member;
		try {
			member = await message.channel.guild.members.fetch(mentioned);
		}
		catch (error) {
			member = null;
			console.log(error);
		}
		if(!member) return message.reply('I couldn\'t find the specified member. 3:');

		const nudes = args.splice(1).join(' ');
		if(!nudes) {
			try {
				return mentioned.send(defaultNude);
			}
			catch (warning) {
				message.reply('I couldn\'t reach the specified member.');
				return console.warn(warning);
			}
		}

		try {
			mentioned.send(nudes);
		}
		catch (err) {
			return console.warn(err);
		}
	},
};