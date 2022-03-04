const fs = require('fs');

module.exports = {
	name: 'prefix',
	description: 'Shows or sets the bot\'s prefix for this guild.',
	usage: '(prefix)',
	execute(message, args) {
		const prefixes = JSON.parse(fs.readFileSync('./data/prefixes.json', 'utf8'));
		if (!prefixes[message.guild.id]) {
			prefixes[message.guild.id] = {
				prefixes: require('./data/config.json').prefix,
			};
		}
		const prefix = prefixes[message.guild.id].prefixes;

		if(!message.member.hasPermission('MANAGE_SERVER' || 'ADMINISTRATOR')) return message.reply('you don\'t have the proper permissions to change my prefix!');
		if(!args[0]) return message.reply(`the current prefix is **${prefix}**`);

		prefixes[message.channel.guild.id] = {
			prefixes: args[0],
		};

		fs.writeFile('./data/prefixes.json', JSON.stringify(prefixes), (error) => {
			if(error) console.error(error);
		});

		message.channel.send(`The new prefix for this guild is: **${args[0]}**`);
	},
};